use serde_json::{json, Map, Number, Value};
use std::{collections::HashMap, mem, slice, str};

mod syntax;

const ABI_VERSION: u32 = 3;

#[derive(Clone, Debug)]
struct SourceLine {
    text: String,
    number: usize,
}

#[derive(Debug)]
struct ListLine {
    indent: usize,
    ordered: bool,
    start: usize,
    checked: Option<bool>,
    content: String,
}

static mut OUTPUT_POINTER: *mut u8 = std::ptr::null_mut();
static mut OUTPUT_LENGTH: usize = 0;

#[no_mangle]
pub extern "C" fn dl_mdx_abi_version() -> u32 {
    ABI_VERSION
}

#[no_mangle]
pub extern "C" fn dl_mdx_alloc(length: usize) -> *mut u8 {
    let mut bytes = Vec::<u8>::with_capacity(length);
    let pointer = bytes.as_mut_ptr();
    mem::forget(bytes);
    pointer
}

#[no_mangle]
/// Releases a buffer previously returned by [`dl_mdx_alloc`].
///
/// # Safety
/// `pointer` and `capacity` must be the unchanged pair returned by `dl_mdx_alloc`,
/// and the buffer must not have been released before.
pub unsafe extern "C" fn dl_mdx_dealloc(pointer: *mut u8, capacity: usize) {
    if !pointer.is_null() && capacity > 0 {
        drop(Vec::from_raw_parts(pointer, 0, capacity));
    }
}

#[no_mangle]
/// Parses one UTF-8 MarkdownX buffer and returns the current output buffer pointer.
///
/// # Safety
/// `pointer..pointer + length` must identify initialized bytes inside this module's
/// linear memory and remain valid for the duration of the call.
pub unsafe extern "C" fn dl_mdx_parse(pointer: *const u8, length: usize) -> *const u8 {
    dl_mdx_release_output();
    let source = str::from_utf8(slice::from_raw_parts(pointer, length)).unwrap_or_default();
    let encoded = serde_json::to_vec(&parse_document(source)).unwrap_or_else(|_| b"{\"blocks\":[],\"stats\":{\"sourceLength\":0,\"lineCount\":1,\"blockCount\":0,\"headingCount\":0,\"readingMinutes\":1}}".to_vec());
    store_output(encoded)
}

#[no_mangle]
/// Highlights one UTF-8 source buffer and returns a JSON token document.
///
/// # Safety
/// Both pointer ranges must identify initialized bytes inside this module's
/// linear memory and remain valid for the duration of the call.
pub unsafe extern "C" fn dl_mdx_highlight(
    source_pointer: *const u8,
    source_length: usize,
    language_pointer: *const u8,
    language_length: usize,
) -> *const u8 {
    dl_mdx_release_output();
    let source =
        str::from_utf8(slice::from_raw_parts(source_pointer, source_length)).unwrap_or_default();
    let language =
        str::from_utf8(slice::from_raw_parts(language_pointer, language_length)).unwrap_or("text");
    let encoded = serde_json::to_vec(&syntax::highlight_code(source, language))
        .unwrap_or_else(|_| b"{\"language\":\"text\",\"supported\":false,\"lines\":[]}".to_vec());
    store_output(encoded)
}

unsafe fn store_output(encoded: Vec<u8>) -> *const u8 {
    let output = encoded.into_boxed_slice();
    OUTPUT_LENGTH = output.len();
    OUTPUT_POINTER = Box::into_raw(output) as *mut u8;
    OUTPUT_POINTER
}

#[no_mangle]
/// Returns the byte length of the current parser output.
///
/// # Safety
/// The single-threaded WASM caller must not interleave this with another parse.
pub unsafe extern "C" fn dl_mdx_output_len() -> usize {
    OUTPUT_LENGTH
}

#[no_mangle]
/// Releases the current parser output buffer.
///
/// # Safety
/// The single-threaded WASM caller must not read the output pointer afterwards.
pub unsafe extern "C" fn dl_mdx_release_output() {
    if !OUTPUT_POINTER.is_null() {
        let raw = std::ptr::slice_from_raw_parts_mut(OUTPUT_POINTER, OUTPUT_LENGTH);
        drop(Box::from_raw(raw));
        OUTPUT_POINTER = std::ptr::null_mut();
        OUTPUT_LENGTH = 0;
    }
}

#[no_mangle]
/// Hashes one UTF-8 buffer with FNV-1a.
///
/// # Safety
/// `pointer..pointer + length` must identify initialized bytes inside this module's
/// linear memory and remain valid for the duration of the call.
pub unsafe extern "C" fn dl_mdx_fnv1a(pointer: *const u8, length: usize) -> u32 {
    slice::from_raw_parts(pointer, length)
        .iter()
        .fold(0x811c9dc5, |hash, byte| {
            (hash ^ u32::from(*byte)).wrapping_mul(0x01000193)
        })
}

#[no_mangle]
/// Classifies one UTF-8 URL without accepting executable schemes.
///
/// # Safety
/// `pointer..pointer + length` must identify initialized bytes inside this module's
/// linear memory and remain valid for the duration of the call.
pub unsafe extern "C" fn dl_mdx_inspect_url(pointer: *const u8, length: usize) -> u32 {
    let value = str::from_utf8(slice::from_raw_parts(pointer, length)).unwrap_or_default();
    inspect_url(value)
}

fn push_text(tokens: &mut Vec<Value>, value: &str) {
    if !value.is_empty() {
        tokens.push(json!({ "type": "text", "value": value }));
    }
}

fn closing(source: &str, start: usize, delimiter: &str) -> Option<usize> {
    source
        .get(start..)?
        .find(delimiter)
        .map(|offset| start + offset)
}

fn link_target(value: &str) -> (&str, Option<&str>) {
    let trimmed = value.trim();
    for quote in ['"', '\''] {
        if trimmed.ends_with(quote) {
            let before_end = &trimmed[..trimmed.len() - quote.len_utf8()];
            if let Some(start) = before_end.rfind(quote) {
                if start > 0 && before_end[..start].ends_with(char::is_whitespace) {
                    return (
                        before_end[..start].trim(),
                        Some(&before_end[start + quote.len_utf8()..]),
                    );
                }
            }
        }
    }
    (trimmed, None)
}

fn parse_inline(source: &str) -> Vec<Value> {
    let mut tokens = Vec::new();
    let mut index = 0;
    while index < source.len() {
        let rest = &source[index..];
        if let Some(stripped) = rest.strip_prefix('\\') {
            if let Some(character) = stripped.chars().next() {
                if "\\`*_{[]}()#+-.!>".contains(character) {
                    push_text(&mut tokens, &character.to_string());
                    index += 1 + character.len_utf8();
                    continue;
                }
            }
        }
        if let Some(stripped) = rest.strip_prefix("![") {
            if let Some(label_end) = stripped.find("](") {
                let label_end = label_end + 2;
                if let Some(target_end) = rest[label_end + 2..].find(')') {
                    let target_end = label_end + 2 + target_end;
                    let (src, title) = link_target(&rest[label_end + 2..target_end]);
                    if !src.is_empty() && !src.chars().any(char::is_whitespace) {
                        let mut token = Map::from_iter([
                            ("type".into(), Value::String("image".into())),
                            ("alt".into(), Value::String(rest[2..label_end].into())),
                            ("src".into(), Value::String(src.into())),
                        ]);
                        if let Some(title) = title {
                            token.insert("title".into(), Value::String(title.into()));
                        }
                        tokens.push(Value::Object(token));
                        index += target_end + 1;
                        continue;
                    }
                }
            }
        }
        if let Some(stripped) = rest.strip_prefix('[') {
            if let Some(label_end) = stripped.find("](") {
                let label_end = label_end + 1;
                if let Some(target_end) = rest[label_end + 2..].find(')') {
                    let target_end = label_end + 2 + target_end;
                    let (href, title) = link_target(&rest[label_end + 2..target_end]);
                    if !href.is_empty() && !href.chars().any(char::is_whitespace) {
                        let mut token = Map::from_iter([
                            ("type".into(), Value::String("link".into())),
                            ("href".into(), Value::String(href.into())),
                            (
                                "children".into(),
                                Value::Array(parse_inline(&rest[1..label_end])),
                            ),
                        ]);
                        if let Some(title) = title {
                            token.insert("title".into(), Value::String(title.into()));
                        }
                        tokens.push(Value::Object(token));
                        index += target_end + 1;
                        continue;
                    }
                }
            }
        }
        if rest.starts_with('<') {
            if let Some(end) = rest.find('>') {
                let candidate = &rest[1..end];
                if candidate.starts_with("http://")
                    || candidate.starts_with("https://")
                    || candidate.starts_with("mailto:")
                {
                    tokens.push(json!({ "type": "link", "href": candidate, "children": [{ "type": "text", "value": candidate }] }));
                    index += end + 1;
                    continue;
                }
            }
        }
        if rest.starts_with('`') {
            let size = rest.bytes().take_while(|byte| *byte == b'`').count();
            let marker = "`".repeat(size);
            if let Some(end) = closing(rest, size, &marker) {
                tokens.push(json!({ "type": "code", "value": rest[size..end].trim() }));
                index += end + size;
                continue;
            }
        }
        let mut formatted = false;
        for (delimiter, kind) in [
            ("**", "strong"),
            ("__", "strong"),
            ("~~", "strike"),
            ("*", "em"),
            ("_", "em"),
        ] {
            if rest.starts_with(delimiter) {
                let content_start = delimiter.len();
                if let Some(end) = closing(rest, content_start, delimiter) {
                    let content = &rest[content_start..end];
                    if !content.trim().is_empty() {
                        tokens.push(json!({ "type": kind, "children": parse_inline(content) }));
                        index += end + delimiter.len();
                        formatted = true;
                        break;
                    }
                }
            }
        }
        if formatted {
            continue;
        }
        if rest.starts_with("  \n") {
            tokens.push(json!({ "type": "break" }));
            index += 3;
            continue;
        }
        if rest.starts_with("\\\n") {
            tokens.push(json!({ "type": "break" }));
            index += 2;
            continue;
        }
        if rest.starts_with('\n') {
            push_text(&mut tokens, " ");
            index += 1;
            continue;
        }
        let length = rest
            .char_indices()
            .skip(1)
            .find(|(_, character)| {
                ['\\', '`', '*', '_', '[', ']', '!', '<', '~', '\n'].contains(character)
            })
            .map_or(rest.len(), |(offset, _)| offset);
        push_text(&mut tokens, &rest[..length]);
        index += length;
    }
    tokens
}

fn slug(value: &str, counts: &mut HashMap<String, usize>) -> String {
    let mut raw = String::new();
    let mut separator = false;
    for character in value.chars().flat_map(char::to_lowercase) {
        if "`*_~".contains(character) {
            continue;
        }
        if character.is_alphanumeric() {
            if separator && !raw.is_empty() {
                raw.push('-');
            }
            raw.push(character);
            separator = false;
        } else {
            separator = true;
        }
    }
    if raw.is_empty() {
        raw.push_str("section");
    }
    let count = counts.entry(raw.clone()).or_default();
    *count += 1;
    if *count == 1 {
        raw
    } else {
        format!("{}-{}", raw, count)
    }
}

fn valid_name(value: &str) -> bool {
    let mut chars = value.chars();
    matches!(chars.next(), Some(first) if first.is_ascii_alphabetic())
        && chars.all(|character| character.is_ascii_alphanumeric() || "_.-".contains(character))
}

fn valid_event_name(value: &str) -> bool {
    let mut chars = value.chars();
    matches!(chars.next(), Some(first) if first.is_ascii_alphabetic())
        && chars.all(|character| character.is_ascii_alphanumeric() || "_:.-".contains(character))
}

fn bounded_value(value: &Value, depth: usize) -> bool {
    if depth > 12 {
        return false;
    }
    match value {
        Value::Null | Value::Bool(_) | Value::Number(_) | Value::String(_) => true,
        Value::Array(values) => {
            values.len() <= 200 && values.iter().all(|item| bounded_value(item, depth + 1))
        }
        Value::Object(values) => {
            values.len() <= 100
                && values
                    .iter()
                    .all(|(key, item)| valid_name(key) && bounded_value(item, depth + 1))
        }
    }
}

fn scalar(value: &str) -> Value {
    let trimmed = value.trim();
    match trimmed {
        "true" => return Value::Bool(true),
        "false" => return Value::Bool(false),
        "null" => return Value::Null,
        _ => {}
    }
    if let Ok(integer) = trimmed.parse::<i64>() {
        return Value::Number(integer.into());
    }
    if let Ok(float) = trimmed.parse::<f64>() {
        if let Some(number) = Number::from_f64(float) {
            return Value::Number(number);
        }
    }
    if trimmed.len() >= 2 {
        let first = trimmed.as_bytes()[0];
        let last = trimmed.as_bytes()[trimmed.len() - 1];
        if (first == b'"' && last == b'"') || (first == b'\'' && last == b'\'') {
            let inner = &trimmed[1..trimmed.len() - 1];
            return Value::String(
                inner
                    .replace("\\\"", "\"")
                    .replace("\\'", "'")
                    .replace("\\\\", "\\"),
            );
        }
    }
    if trimmed.starts_with('[') || trimmed.starts_with('{') {
        if let Ok(parsed) = serde_json::from_str::<Value>(trimmed) {
            if bounded_value(&parsed, 0) {
                return parsed;
            }
        }
    }
    Value::String(trimmed.into())
}

fn list_line(value: &str) -> Option<ListLine> {
    let indent = value
        .bytes()
        .take_while(|byte| *byte == b' ' || *byte == b'\t')
        .count();
    let rest = &value[indent..];
    let (ordered, start, marker_len) =
        if rest.starts_with("- ") || rest.starts_with("+ ") || rest.starts_with("* ") {
            (false, 1, 2)
        } else {
            let digits = rest.bytes().take_while(u8::is_ascii_digit).count();
            if digits == 0
                || rest.len() <= digits + 1
                || !matches!(rest.as_bytes()[digits], b'.' | b')')
                || rest.as_bytes()[digits + 1] != b' '
            {
                return None;
            }
            (true, rest[..digits].parse().ok()?, digits + 2)
        };
    let mut content = rest[marker_len..].to_string();
    let checked = if content.starts_with("[ ] ") {
        content.drain(..4);
        Some(false)
    } else if content.len() >= 4
        && content.as_bytes()[0] == b'['
        && matches!(content.as_bytes()[1], b'x' | b'X')
        && &content[2..4] == "] "
    {
        content.drain(..4);
        Some(true)
    } else {
        None
    };
    Some(ListLine {
        indent,
        ordered,
        start,
        checked,
        content,
    })
}

fn divider(value: &str) -> bool {
    let compact: String = value
        .chars()
        .filter(|character| !character.is_whitespace())
        .collect();
    compact.len() >= 3 && compact.chars().all(|character| character == '-')
        || compact.len() >= 3 && compact.chars().all(|character| character == '*')
        || compact.len() >= 3 && compact.chars().all(|character| character == '_')
}

fn split_table_row(value: &str) -> Vec<String> {
    let trimmed = value.trim().trim_start_matches('|').trim_end_matches('|');
    let mut cells = Vec::new();
    let mut current = String::new();
    let mut escaped = false;
    for character in trimmed.chars() {
        if escaped {
            current.push(character);
            escaped = false;
        } else if character == '\\' {
            escaped = true;
        } else if character == '|' {
            cells.push(current.trim().into());
            current.clear();
        } else {
            current.push(character);
        }
    }
    cells.push(current.trim().into());
    cells
}

fn table_divider(value: &str) -> bool {
    let compact: String = value
        .chars()
        .filter(|character| !character.is_whitespace())
        .collect();
    let core = compact.trim_start_matches(':').trim_end_matches(':');
    core.len() >= 3 && core.chars().all(|character| character == '-')
}

fn is_table(lines: &[SourceLine], index: usize) -> bool {
    lines.get(index).is_some_and(|line| line.text.contains('|'))
        && lines.get(index + 1).is_some_and(|line| {
            line.text.contains('|')
                && split_table_row(&line.text)
                    .iter()
                    .all(|cell| table_divider(cell))
        })
}

fn block_start(lines: &[SourceLine], index: usize) -> bool {
    let Some(line) = lines.get(index) else {
        return true;
    };
    let trimmed = line.text.trim_start();
    line.text.trim().is_empty()
        || trimmed.starts_with('#')
            && trimmed
                .find(char::is_whitespace)
                .is_some_and(|position| position <= 6)
        || trimmed.starts_with("```")
        || trimmed.starts_with("~~~")
        || trimmed.starts_with('>')
        || list_line(&line.text).is_some()
        || divider(&line.text)
        || trimmed.starts_with("+++component:")
        || jsx_component_invocation(trimmed).is_some()
        || is_table(lines, index)
}

fn jsx_component_invocation(value: &str) -> Option<&str> {
    let body = value.strip_prefix('<')?.strip_suffix("/>")?.trim();
    if body.chars().next().is_some_and(char::is_uppercase) && valid_name(body) {
        Some(body)
    } else {
        None
    }
}

fn strip_indent(lines: &[SourceLine], amount: usize) -> Vec<SourceLine> {
    lines
        .iter()
        .map(|line| {
            let actual = line
                .text
                .bytes()
                .take_while(|byte| *byte == b' ' || *byte == b'\t')
                .count()
                .min(amount);
            SourceLine {
                text: line.text[actual..].into(),
                number: line.number,
            }
        })
        .collect()
}

fn parse_blocks(lines: &[SourceLine], slug_counts: &mut HashMap<String, usize>) -> Vec<Value> {
    let mut blocks = Vec::new();
    let mut index = 0;
    while index < lines.len() {
        let line = &lines[index];
        let trimmed = line.text.trim();
        if trimmed.is_empty() {
            index += 1;
            continue;
        }

        if let Some(name) = jsx_component_invocation(trimmed) {
            blocks.push(json!({
                "type": "component",
                "context": {
                    "name": name,
                    "props": {},
                    "events": {},
                    "sourceLine": line.number,
                }
            }));
            index += 1;
            continue;
        }

        if let Some(name) = trimmed.strip_prefix("+++component:") {
            if valid_name(name) {
                let mut props = Map::new();
                let mut events = Map::new();
                let mut slots = Map::new();
                let mut cursor = index + 1;
                while cursor < lines.len() && lines[cursor].text.trim() != "+++end" {
                    if let Some(slot_name) = lines[cursor]
                        .text
                        .trim()
                        .strip_prefix("+++slot:")
                        .filter(|slot_name| valid_name(slot_name))
                    {
                        let mut body = Vec::new();
                        cursor += 1;
                        while cursor < lines.len() && lines[cursor].text.trim() != "+++endslot" {
                            body.push(lines[cursor].text.as_str());
                            cursor += 1;
                        }
                        slots.insert(slot_name.into(), Value::String(body.join("\n")));
                        if cursor < lines.len() {
                            cursor += 1;
                        }
                        continue;
                    }
                    if let Some((name, value)) = lines[cursor].text.split_once('=') {
                        let name = name.trim();
                        if let Some(event) = name.strip_prefix('@').filter(|event| valid_event_name(event)) {
                            if let Value::String(action) = scalar(value) {
                                events.insert(event.into(), Value::String(action));
                            }
                        } else if valid_name(name) {
                            props.insert(name.into(), scalar(value));
                        }
                    }
                    cursor += 1;
                }
                let id = props.get("id").and_then(Value::as_str).map(str::to_string);
                let mut context = Map::from_iter([
                    ("name".into(), Value::String(name.into())),
                    ("props".into(), Value::Object(props)),
                    ("events".into(), Value::Object(events)),
                    ("sourceLine".into(), Value::Number(line.number.into())),
                ]);
                if let Some(id) = id {
                    context.insert("id".into(), Value::String(id));
                }
                if !slots.is_empty() {
                    context.insert("slots".into(), Value::Object(slots));
                }
                blocks.push(json!({ "type": "component", "context": context }));
                index = if cursor < lines.len() {
                    cursor + 1
                } else {
                    cursor
                };
                continue;
            }
        }

        let leading = line.text.trim_start();
        if leading.starts_with("```") || leading.starts_with("~~~") {
            let marker = leading.as_bytes()[0] as char;
            let size = leading
                .chars()
                .take_while(|character| *character == marker)
                .count();
            let language = leading[size..]
                .split_whitespace()
                .next()
                .unwrap_or("text")
                .to_lowercase();
            let mut body = Vec::new();
            let mut cursor = index + 1;
            while cursor < lines.len() {
                let close = lines[cursor].text.trim();
                if close.len() >= size && close.chars().all(|character| character == marker) {
                    break;
                }
                body.push(lines[cursor].text.clone());
                cursor += 1;
            }
            blocks.push(json!({ "type": "code", "language": if language.is_empty() { "text" } else { &language }, "value": body.join("\n"), "id": format!("code-{}", line.number) }));
            index = if cursor < lines.len() {
                cursor + 1
            } else {
                cursor
            };
            continue;
        }

        let hashes = leading.bytes().take_while(|byte| *byte == b'#').count();
        if (1..=6).contains(&hashes) && leading.as_bytes().get(hashes) == Some(&b' ') {
            let heading = leading[hashes + 1..]
                .trim()
                .trim_end_matches('#')
                .trim_end();
            blocks.push(json!({ "type": "heading", "level": hashes, "id": slug(heading, slug_counts), "tokens": parse_inline(heading) }));
            index += 1;
            continue;
        }

        if divider(&line.text) {
            blocks.push(json!({ "type": "divider" }));
            index += 1;
            continue;
        }

        if leading.starts_with('>') {
            let mut quoted = Vec::new();
            while index < lines.len() && lines[index].text.trim_start().starts_with('>') {
                let value = lines[index]
                    .text
                    .trim_start()
                    .trim_start_matches('>')
                    .strip_prefix(' ')
                    .unwrap_or(lines[index].text.trim_start().trim_start_matches('>'));
                quoted.push(SourceLine {
                    text: value.into(),
                    number: lines[index].number,
                });
                index += 1;
            }
            blocks.push(
                json!({ "type": "blockquote", "blocks": parse_blocks(&quoted, slug_counts) }),
            );
            continue;
        }

        if let Some(first) = list_line(&line.text) {
            let mut items = Vec::new();
            let mut cursor = index;
            while cursor < lines.len() {
                let Some(item) = list_line(&lines[cursor].text) else {
                    break;
                };
                if item.indent != first.indent || item.ordered != first.ordered {
                    break;
                }
                let nested_start = cursor + 1;
                let mut nested_end = nested_start;
                while nested_end < lines.len() {
                    if let Some(next) = list_line(&lines[nested_end].text) {
                        if next.indent == first.indent && next.ordered == first.ordered {
                            break;
                        }
                    }
                    if !lines[nested_end].text.trim().is_empty() {
                        let indent = lines[nested_end]
                            .text
                            .bytes()
                            .take_while(|byte| *byte == b' ' || *byte == b'\t')
                            .count();
                        if indent <= first.indent {
                            break;
                        }
                    }
                    nested_end += 1;
                }
                let nested = strip_indent(&lines[nested_start..nested_end], first.indent + 2);
                let mut entry = Map::from_iter([
                    ("tokens".into(), Value::Array(parse_inline(&item.content))),
                    (
                        "sourceLine".into(),
                        Value::Number(lines[cursor].number.into()),
                    ),
                    (
                        "children".into(),
                        Value::Array(if nested.iter().any(|line| !line.text.trim().is_empty()) {
                            parse_blocks(&nested, slug_counts)
                        } else {
                            Vec::new()
                        }),
                    ),
                ]);
                if let Some(checked) = item.checked {
                    entry.insert("checked".into(), Value::Bool(checked));
                }
                items.push(Value::Object(entry));
                cursor = nested_end;
            }
            blocks.push(json!({ "type": "list", "ordered": first.ordered, "start": first.start, "items": items }));
            index = cursor;
            continue;
        }

        if is_table(lines, index) {
            let headers = split_table_row(&line.text)
                .iter()
                .map(|cell| Value::Array(parse_inline(cell)))
                .collect::<Vec<_>>();
            let alignments = split_table_row(&lines[index + 1].text)
                .iter()
                .map(|cell| {
                    let compact: String = cell
                        .chars()
                        .filter(|character| !character.is_whitespace())
                        .collect();
                    Value::String(
                        if compact.starts_with(':') && compact.ends_with(':') {
                            "center"
                        } else if compact.ends_with(':') {
                            "right"
                        } else {
                            "left"
                        }
                        .into(),
                    )
                })
                .collect::<Vec<_>>();
            let mut rows = Vec::new();
            index += 2;
            while index < lines.len()
                && lines[index].text.contains('|')
                && !lines[index].text.trim().is_empty()
            {
                rows.push(Value::Array(
                    split_table_row(&lines[index].text)
                        .iter()
                        .map(|cell| Value::Array(parse_inline(cell)))
                        .collect(),
                ));
                index += 1;
            }
            blocks.push(json!({ "type": "table", "headers": headers, "rows": rows, "alignments": alignments }));
            continue;
        }

        let mut paragraph = vec![line.text.trim_start().to_string()];
        index += 1;
        while index < lines.len()
            && !lines[index].text.trim().is_empty()
            && !block_start(lines, index)
        {
            paragraph.push(lines[index].text.trim_start().into());
            index += 1;
        }
        blocks.push(json!({ "type": "paragraph", "tokens": parse_inline(&paragraph.join("\n")) }));
    }
    blocks
}

fn parse_document(source: &str) -> Value {
    let normalized = source.replace("\r\n", "\n").replace('\r', "\n");
    let lines = normalized
        .split('\n')
        .enumerate()
        .map(|(number, text)| SourceLine {
            text: text.into(),
            number,
        })
        .collect::<Vec<_>>();
    let blocks = parse_blocks(&lines, &mut HashMap::new());
    let mut words = 0usize;
    let mut inside_word = false;
    for character in normalized.chars() {
        if character.is_alphanumeric() {
            if !inside_word {
                words += 1;
            }
            inside_word = true;
        } else {
            inside_word = false;
        }
    }
    let heading_count = blocks
        .iter()
        .filter(|block| block.get("type").and_then(Value::as_str) == Some("heading"))
        .count();
    json!({
        "blocks": blocks,
        "stats": {
            "sourceLength": normalized.encode_utf16().count(),
            "lineCount": lines.len(),
            "blockCount": blocks.len(),
            "headingCount": heading_count,
            "readingMinutes": usize::max(1, words.div_ceil(260)),
        }
    })
}

fn percent_decode(value: &str) -> String {
    let bytes = value.as_bytes();
    let mut decoded = Vec::with_capacity(bytes.len());
    let mut index = 0;
    while index < bytes.len() {
        if bytes[index] == b'%' && index + 2 < bytes.len() {
            if let (Some(high), Some(low)) = (
                (bytes[index + 1] as char).to_digit(16),
                (bytes[index + 2] as char).to_digit(16),
            ) {
                decoded.push(((high << 4) | low) as u8);
                index += 3;
                continue;
            }
        }
        decoded.push(bytes[index]);
        index += 1;
    }
    String::from_utf8_lossy(&decoded).into_owned()
}

fn inspect_url(value: &str) -> u32 {
    let candidate = value.trim();
    if candidate.is_empty() || candidate.contains('\\') {
        return 0;
    }
    let decoded = percent_decode(&percent_decode(candidate));
    let inspected = decoded
        .chars()
        .filter(|character| !matches!(*character as u32, 0..=32 | 127..=159))
        .collect::<String>()
        .to_ascii_lowercase();
    if inspected.starts_with("javascript:") || inspected.starts_with("vbscript:") {
        return 0;
    }
    if candidate.starts_with("//") {
        return 2;
    }
    if candidate.starts_with('#')
        || candidate.starts_with('?')
        || candidate.starts_with('/')
        || candidate.starts_with("./")
        || candidate.starts_with("../")
    {
        return 1;
    }
    let Some(colon) = inspected.find(':') else {
        return 1;
    };
    let scheme = &inspected[..colon];
    if scheme.is_empty()
        || !scheme.as_bytes()[0].is_ascii_alphabetic()
        || !scheme
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'+' | b'.' | b'-'))
    {
        return 1;
    }
    match scheme {
        "http" => 3,
        "https" => 4,
        "mailto" => 5,
        "tel" => 6,
        "data" => 7,
        "blob" => 8,
        _ => 9,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_markdownx_structure_and_stats() {
        let document = parse_document("# 标题\n\n- [ ] 第一项\n- [x] 第二项\n\n| 字段 | 状态 |\n| :--- | ---: |\n| 标题 | 完成 |\n\n+++component:Callout\ntone = \"accent\"\n@click = saveNotice\n+++end");
        assert_eq!(document["stats"]["blockCount"], 4);
        assert_eq!(document["stats"]["headingCount"], 1);
        assert_eq!(document["blocks"][3]["context"]["props"]["tone"], "accent");
        assert_eq!(document["blocks"][3]["context"]["events"]["click"], "saveNotice");
    }

    #[test]
    fn keeps_component_default_slot_as_raw_mdx() {
        let document = parse_document("+++component:JournalTodo\nsourceTodoId = \"todo-1\"\n+++slot:default\n## 完整标题\n\n- [ ] 独立的 **MDX** 描述\n+++endslot\n+++end");
        assert_eq!(document["blocks"][0]["context"]["slots"]["default"], "## 完整标题\n\n- [ ] 独立的 **MDX** 描述");
    }

    #[test]
    fn parses_named_jsx_function_invocations() {
        let document = parse_document("# Journal\n\n<Todo_1234 />");
        assert_eq!(document["blocks"][1]["context"]["name"], "Todo_1234");
        assert_eq!(document["blocks"][1]["type"], "component");
    }

    #[test]
    fn classifies_obfuscated_and_supported_urls() {
        assert_eq!(inspect_url("java%73cript:alert(1)"), 0);
        assert_eq!(inspect_url("/archive/42"), 1);
        assert_eq!(inspect_url("//example.com"), 2);
        assert_eq!(inspect_url("https://example.com"), 4);
    }

    #[test]
    fn hashes_with_fnv1a() {
        let bytes = b"Dragon Liquid";
        let hash = bytes.iter().fold(0x811c9dc5u32, |hash, byte| {
            (hash ^ u32::from(*byte)).wrapping_mul(0x01000193)
        });
        assert_eq!(hash, 0x3d351322);
    }
}
