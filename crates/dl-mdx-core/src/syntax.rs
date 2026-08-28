use serde_json::{json, Value};

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum Profile {
    Plain,
    JavaScript,
    Python,
    Rust,
    CFamily,
    Go,
    Shell,
    PowerShell,
    Sql,
    Json,
    Yaml,
    Css,
    Markup,
}

#[derive(Clone, Copy)]
struct Language {
    canonical: &'static str,
    profile: Profile,
}

fn language(value: &str) -> Language {
    match value.trim().to_ascii_lowercase().as_str() {
        "js" | "jsx" | "javascript" | "node" => Language {
            canonical: "javascript",
            profile: Profile::JavaScript,
        },
        "ts" | "tsx" | "typescript" => Language {
            canonical: "typescript",
            profile: Profile::JavaScript,
        },
        "py" | "python" => Language {
            canonical: "python",
            profile: Profile::Python,
        },
        "rs" | "rust" => Language {
            canonical: "rust",
            profile: Profile::Rust,
        },
        "c" | "h" | "cpp" | "c++" | "cc" | "cxx" | "hpp" => Language {
            canonical: "cpp",
            profile: Profile::CFamily,
        },
        "cs" | "csharp" | "c#" | "dotnet" => Language {
            canonical: "csharp",
            profile: Profile::CFamily,
        },
        "java" | "kotlin" | "kt" | "swift" | "dart" | "scala" => Language {
            canonical: "java",
            profile: Profile::CFamily,
        },
        "go" | "golang" => Language {
            canonical: "go",
            profile: Profile::Go,
        },
        "sh" | "bash" | "zsh" | "shell" | "console" => Language {
            canonical: "shell",
            profile: Profile::Shell,
        },
        "ps1" | "powershell" => Language {
            canonical: "powershell",
            profile: Profile::PowerShell,
        },
        "sql" | "mysql" | "pgsql" | "postgres" | "postgresql" => Language {
            canonical: "sql",
            profile: Profile::Sql,
        },
        "json" | "jsonc" => Language {
            canonical: "json",
            profile: Profile::Json,
        },
        "yaml" | "yml" | "toml" | "ini" => Language {
            canonical: "yaml",
            profile: Profile::Yaml,
        },
        "css" | "scss" | "sass" | "less" => Language {
            canonical: "css",
            profile: Profile::Css,
        },
        "html" | "htm" | "xml" | "svg" | "vue" | "svelte" => Language {
            canonical: "html",
            profile: Profile::Markup,
        },
        _ => Language {
            canonical: "text",
            profile: Profile::Plain,
        },
    }
}

fn push(tokens: &mut Vec<Value>, kind: &'static str, value: &str) {
    if value.is_empty() {
        return;
    }
    if let Some(last) = tokens.last_mut() {
        if last.get("kind").and_then(Value::as_str) == Some(kind) {
            if let Some(Value::String(current)) = last.get_mut("value") {
                current.push_str(value);
                return;
            }
        }
    }
    tokens.push(json!({ "kind": kind, "value": value }));
}

fn next_boundary(source: &str, index: usize) -> usize {
    source[index..]
        .char_indices()
        .nth(1)
        .map_or(source.len(), |(offset, _)| index + offset)
}

fn take_while(source: &str, start: usize, predicate: impl Fn(char) -> bool) -> usize {
    source[start..]
        .char_indices()
        .find(|(_, character)| !predicate(*character))
        .map_or(source.len(), |(offset, _)| start + offset)
}

fn escaped(source: &str, index: usize) -> bool {
    let mut count = 0;
    let mut cursor = index;
    while cursor > 0 && source.as_bytes()[cursor - 1] == b'\\' {
        count += 1;
        cursor -= 1;
    }
    count % 2 == 1
}

fn delimiter_end(source: &str, start: usize, delimiter: &str) -> Option<usize> {
    delimiter_end_from(source, start + delimiter.len(), delimiter)
}

fn delimiter_end_from(source: &str, start: usize, delimiter: &str) -> Option<usize> {
    let mut cursor = start;
    while let Some(offset) = source[cursor..].find(delimiter) {
        let end = cursor + offset;
        if !escaped(source, end) {
            return Some(end + delimiter.len());
        }
        cursor = end + delimiter.len();
    }
    None
}

fn next_non_space(source: &str, start: usize) -> Option<char> {
    source[start..]
        .chars()
        .find(|character| !character.is_whitespace())
}

fn previous_non_space(source: &str, start: usize) -> Option<char> {
    source[..start]
        .chars()
        .rev()
        .find(|character| !character.is_whitespace())
}

fn is_identifier_start(character: char) -> bool {
    character == '_' || character == '$' || character.is_alphabetic()
}

fn is_identifier(character: char) -> bool {
    is_identifier_start(character) || character.is_alphanumeric()
}

fn is_constant(value: &str) -> bool {
    matches!(
        value,
        "true"
            | "false"
            | "null"
            | "nil"
            | "none"
            | "None"
            | "undefined"
            | "NaN"
            | "Infinity"
            | "self"
            | "Self"
    ) || value.len() > 1
        && value.chars().all(|character| {
            character == '_' || character.is_ascii_uppercase() || character.is_ascii_digit()
        })
}

fn is_keyword(profile: Profile, value: &str) -> bool {
    match profile {
        Profile::JavaScript => matches!(
            value,
            "as" | "async"
                | "await"
                | "break"
                | "case"
                | "catch"
                | "class"
                | "const"
                | "continue"
                | "debugger"
                | "declare"
                | "default"
                | "delete"
                | "do"
                | "else"
                | "enum"
                | "export"
                | "extends"
                | "finally"
                | "for"
                | "from"
                | "function"
                | "get"
                | "if"
                | "implements"
                | "import"
                | "in"
                | "infer"
                | "instanceof"
                | "interface"
                | "keyof"
                | "let"
                | "module"
                | "namespace"
                | "new"
                | "of"
                | "private"
                | "protected"
                | "public"
                | "readonly"
                | "return"
                | "satisfies"
                | "set"
                | "static"
                | "super"
                | "switch"
                | "this"
                | "throw"
                | "try"
                | "type"
                | "typeof"
                | "var"
                | "void"
                | "while"
                | "with"
                | "yield"
        ),
        Profile::Python => matches!(
            value,
            "and"
                | "as"
                | "assert"
                | "async"
                | "await"
                | "break"
                | "case"
                | "class"
                | "continue"
                | "def"
                | "del"
                | "elif"
                | "else"
                | "except"
                | "finally"
                | "for"
                | "from"
                | "global"
                | "if"
                | "import"
                | "in"
                | "is"
                | "lambda"
                | "match"
                | "nonlocal"
                | "not"
                | "or"
                | "pass"
                | "raise"
                | "return"
                | "try"
                | "while"
                | "with"
                | "yield"
        ),
        Profile::Rust => matches!(
            value,
            "as" | "async"
                | "await"
                | "break"
                | "const"
                | "continue"
                | "crate"
                | "dyn"
                | "else"
                | "enum"
                | "extern"
                | "false"
                | "fn"
                | "for"
                | "if"
                | "impl"
                | "in"
                | "let"
                | "loop"
                | "match"
                | "mod"
                | "move"
                | "mut"
                | "pub"
                | "ref"
                | "return"
                | "static"
                | "struct"
                | "super"
                | "trait"
                | "true"
                | "type"
                | "unsafe"
                | "use"
                | "where"
                | "while"
        ),
        Profile::CFamily => matches!(
            value,
            "abstract"
                | "auto"
                | "base"
                | "bool"
                | "break"
                | "byte"
                | "case"
                | "catch"
                | "char"
                | "class"
                | "const"
                | "continue"
                | "decimal"
                | "default"
                | "delegate"
                | "do"
                | "double"
                | "else"
                | "enum"
                | "explicit"
                | "extends"
                | "extern"
                | "false"
                | "final"
                | "finally"
                | "float"
                | "for"
                | "foreach"
                | "goto"
                | "if"
                | "implements"
                | "implicit"
                | "import"
                | "in"
                | "int"
                | "interface"
                | "internal"
                | "is"
                | "long"
                | "namespace"
                | "new"
                | "null"
                | "operator"
                | "out"
                | "override"
                | "package"
                | "private"
                | "protected"
                | "public"
                | "readonly"
                | "record"
                | "ref"
                | "return"
                | "sealed"
                | "short"
                | "signed"
                | "sizeof"
                | "static"
                | "string"
                | "struct"
                | "super"
                | "switch"
                | "this"
                | "throw"
                | "throws"
                | "true"
                | "try"
                | "typeof"
                | "uint"
                | "ulong"
                | "unchecked"
                | "unsigned"
                | "using"
                | "var"
                | "virtual"
                | "void"
                | "volatile"
                | "while"
        ),
        Profile::Go => matches!(
            value,
            "break"
                | "case"
                | "chan"
                | "const"
                | "continue"
                | "default"
                | "defer"
                | "else"
                | "fallthrough"
                | "for"
                | "func"
                | "go"
                | "goto"
                | "if"
                | "import"
                | "interface"
                | "map"
                | "package"
                | "range"
                | "return"
                | "select"
                | "struct"
                | "switch"
                | "type"
                | "var"
        ),
        Profile::Shell => matches!(
            value,
            "case"
                | "do"
                | "done"
                | "elif"
                | "else"
                | "esac"
                | "export"
                | "fi"
                | "for"
                | "function"
                | "if"
                | "in"
                | "local"
                | "readonly"
                | "select"
                | "then"
                | "until"
                | "while"
        ),
        Profile::PowerShell => matches!(
            value.to_ascii_lowercase().as_str(),
            "begin"
                | "break"
                | "catch"
                | "class"
                | "continue"
                | "data"
                | "do"
                | "dynamicparam"
                | "else"
                | "elseif"
                | "end"
                | "enum"
                | "exit"
                | "filter"
                | "finally"
                | "for"
                | "foreach"
                | "from"
                | "function"
                | "if"
                | "in"
                | "param"
                | "process"
                | "return"
                | "switch"
                | "throw"
                | "trap"
                | "try"
                | "until"
                | "using"
                | "while"
        ),
        Profile::Sql => matches!(
            value.to_ascii_uppercase().as_str(),
            "ADD"
                | "ALL"
                | "ALTER"
                | "AND"
                | "AS"
                | "ASC"
                | "BEGIN"
                | "BETWEEN"
                | "BY"
                | "CASE"
                | "CHECK"
                | "COLUMN"
                | "COMMIT"
                | "CONSTRAINT"
                | "CREATE"
                | "DATABASE"
                | "DEFAULT"
                | "DELETE"
                | "DESC"
                | "DISTINCT"
                | "DROP"
                | "ELSE"
                | "END"
                | "EXISTS"
                | "FOREIGN"
                | "FROM"
                | "FULL"
                | "GROUP"
                | "HAVING"
                | "IN"
                | "INDEX"
                | "INNER"
                | "INSERT"
                | "INTO"
                | "IS"
                | "JOIN"
                | "KEY"
                | "LEFT"
                | "LIKE"
                | "LIMIT"
                | "NOT"
                | "NULL"
                | "ON"
                | "OR"
                | "ORDER"
                | "OUTER"
                | "PRIMARY"
                | "PROCEDURE"
                | "REFERENCES"
                | "RIGHT"
                | "ROLLBACK"
                | "SELECT"
                | "SET"
                | "TABLE"
                | "THEN"
                | "TRIGGER"
                | "UNION"
                | "UNIQUE"
                | "UPDATE"
                | "VALUES"
                | "VIEW"
                | "WHEN"
                | "WHERE"
                | "WITH"
        ),
        Profile::Css => matches!(
            value,
            "and" | "from" | "important" | "not" | "only" | "or" | "to"
        ),
        _ => false,
    }
}

fn line_comment(profile: Profile, rest: &str) -> Option<&'static str> {
    match profile {
        Profile::JavaScript | Profile::Rust | Profile::CFamily | Profile::Go
            if rest.starts_with("//") =>
        {
            Some("//")
        }
        Profile::Python | Profile::Shell | Profile::PowerShell | Profile::Yaml
            if rest.starts_with('#') =>
        {
            Some("#")
        }
        Profile::Sql if rest.starts_with("--") => Some("--"),
        _ => None,
    }
}

fn supports_block_comments(profile: Profile) -> bool {
    matches!(
        profile,
        Profile::JavaScript
            | Profile::Rust
            | Profile::CFamily
            | Profile::Go
            | Profile::Sql
            | Profile::Css
    )
}

fn string_delimiter(profile: Profile, rest: &str) -> Option<&'static str> {
    if profile == Profile::Python {
        if rest.starts_with("\"\"\"") {
            return Some("\"\"\"");
        }
        if rest.starts_with("'''") {
            return Some("'''");
        }
    }
    if rest.starts_with('"') {
        return Some("\"");
    }
    if rest.starts_with('\'') {
        return Some("'");
    }
    if matches!(
        profile,
        Profile::JavaScript | Profile::Shell | Profile::PowerShell
    ) && rest.starts_with('`')
    {
        return Some("`");
    }
    None
}

fn highlight_general(source: &str, profile: Profile) -> Vec<Vec<Value>> {
    let mut block_comment: Option<&'static str> = None;
    let mut open_string: Option<&'static str> = None;
    source
        .split('\n')
        .map(|line| {
            let mut tokens = Vec::new();
            let mut index = 0;
            while index < line.len() {
                let rest = &line[index..];
                if let Some(end_marker) = block_comment {
                    if let Some(offset) = rest.find(end_marker) {
                        let end = index + offset + end_marker.len();
                        push(&mut tokens, "comment", &line[index..end]);
                        index = end;
                        block_comment = None;
                    } else {
                        push(&mut tokens, "comment", rest);
                        index = line.len();
                    }
                    continue;
                }
                if let Some(end_marker) = open_string {
                    if let Some(end) = delimiter_end_from(line, index, end_marker) {
                        push(&mut tokens, "string", &line[index..end]);
                        index = end;
                        open_string = None;
                    } else {
                        push(&mut tokens, "string", rest);
                        index = line.len();
                    }
                    continue;
                }
                if line_comment(profile, rest).is_some() {
                    push(&mut tokens, "comment", rest);
                    break;
                }
                if supports_block_comments(profile) && rest.starts_with("/*") {
                    if let Some(offset) = rest[2..].find("*/") {
                        let end = index + 2 + offset + 2;
                        push(&mut tokens, "comment", &line[index..end]);
                        index = end;
                    } else {
                        push(&mut tokens, "comment", rest);
                        block_comment = Some("*/");
                        index = line.len();
                    }
                    continue;
                }
                if let Some(delimiter) = string_delimiter(profile, rest) {
                    if let Some(end) = delimiter_end(line, index, delimiter) {
                        let kind = if matches!(profile, Profile::Json | Profile::Yaml)
                            && next_non_space(line, end) == Some(':')
                        {
                            "property"
                        } else {
                            "string"
                        };
                        push(&mut tokens, kind, &line[index..end]);
                        index = end;
                    } else {
                        push(&mut tokens, "string", rest);
                        if delimiter.len() > 1
                            || matches!(
                                profile,
                                Profile::JavaScript | Profile::Shell | Profile::PowerShell
                            ) && delimiter == "`"
                        {
                            open_string = Some(delimiter);
                        }
                        index = line.len();
                    }
                    continue;
                }
                let character = rest.chars().next().unwrap_or_default();
                if character.is_whitespace() {
                    let end = take_while(line, index, char::is_whitespace);
                    push(&mut tokens, "plain", &line[index..end]);
                    index = end;
                } else if character.is_ascii_digit()
                    || character == '.'
                        && rest
                            .chars()
                            .nth(1)
                            .is_some_and(|next| next.is_ascii_digit())
                {
                    let end = take_while(line, index, |value| {
                        value.is_ascii_alphanumeric() || "._".contains(value)
                    });
                    push(&mut tokens, "number", &line[index..end]);
                    index = end;
                } else if is_identifier_start(character) {
                    let end = take_while(line, index, |value| {
                        is_identifier(value)
                            || matches!(profile, Profile::Css | Profile::Yaml) && value == '-'
                    });
                    let value = &line[index..end];
                    let next = next_non_space(line, end);
                    let previous = previous_non_space(line, index);
                    let kind = if is_keyword(profile, value) {
                        "keyword"
                    } else if is_constant(value) {
                        "constant"
                    } else if matches!(profile, Profile::Json | Profile::Yaml | Profile::Css)
                        && next == Some(':')
                    {
                        "property"
                    } else if value.starts_with('$') {
                        "variable"
                    } else if next == Some('(') {
                        "function"
                    } else if previous == Some('.') {
                        "property"
                    } else if value.chars().next().is_some_and(char::is_uppercase) {
                        "type"
                    } else {
                        "plain"
                    };
                    push(&mut tokens, kind, value);
                    index = end;
                } else if "+-*/%=!<>|&^~?:".contains(character) {
                    let end = take_while(line, index, |value| "+-*/%=!<>|&^~?:".contains(value));
                    push(&mut tokens, "operator", &line[index..end]);
                    index = end;
                } else {
                    let end = next_boundary(line, index);
                    push(&mut tokens, "punctuation", &line[index..end]);
                    index = end;
                }
            }
            tokens
        })
        .collect()
}

fn highlight_markup(source: &str) -> Vec<Vec<Value>> {
    let mut comment_open = false;
    let mut tag_open = false;
    let mut expect_tag = false;
    source
        .split('\n')
        .map(|line| {
            let mut tokens = Vec::new();
            let mut index = 0;
            while index < line.len() {
                let rest = &line[index..];
                if comment_open {
                    if let Some(offset) = rest.find("-->") {
                        let end = index + offset + 3;
                        push(&mut tokens, "comment", &line[index..end]);
                        index = end;
                        comment_open = false;
                    } else {
                        push(&mut tokens, "comment", rest);
                        break;
                    }
                    continue;
                }
                if let Some(comment_body) = rest.strip_prefix("<!--") {
                    if let Some(offset) = comment_body.find("-->") {
                        let end = index + 4 + offset + 3;
                        push(&mut tokens, "comment", &line[index..end]);
                        index = end;
                    } else {
                        push(&mut tokens, "comment", rest);
                        comment_open = true;
                        break;
                    }
                } else if rest.starts_with("</") {
                    push(&mut tokens, "punctuation", "</");
                    index += 2;
                    tag_open = true;
                    expect_tag = true;
                } else if rest.starts_with('<') {
                    push(&mut tokens, "punctuation", "<");
                    index += 1;
                    tag_open = true;
                    expect_tag = true;
                } else if tag_open && rest.starts_with("/>") {
                    push(&mut tokens, "punctuation", "/>");
                    index += 2;
                    tag_open = false;
                } else if tag_open && rest.starts_with('>') {
                    push(&mut tokens, "punctuation", ">");
                    index += 1;
                    tag_open = false;
                } else if tag_open && (rest.starts_with('"') || rest.starts_with('\'')) {
                    let delimiter = if rest.starts_with('"') { "\"" } else { "'" };
                    let end = delimiter_end(line, index, delimiter).unwrap_or(line.len());
                    push(&mut tokens, "string", &line[index..end]);
                    index = end;
                } else {
                    let character = rest.chars().next().unwrap_or_default();
                    if character.is_whitespace() {
                        let end = take_while(line, index, char::is_whitespace);
                        push(&mut tokens, "plain", &line[index..end]);
                        index = end;
                    } else if tag_open && is_identifier_start(character) {
                        let end =
                            take_while(line, index, |value| is_identifier(value) || value == ':');
                        push(
                            &mut tokens,
                            if expect_tag { "tag" } else { "attribute" },
                            &line[index..end],
                        );
                        expect_tag = false;
                        index = end;
                    } else if tag_open && "=!?".contains(character) {
                        let end = next_boundary(line, index);
                        push(&mut tokens, "operator", &line[index..end]);
                        index = end;
                    } else {
                        let end = if tag_open {
                            next_boundary(line, index)
                        } else {
                            rest.find('<').map_or(line.len(), |offset| index + offset)
                        };
                        if end == index {
                            let next = next_boundary(line, index);
                            push(&mut tokens, "plain", &line[index..next]);
                            index = next;
                        } else {
                            push(&mut tokens, "plain", &line[index..end]);
                            index = end;
                        }
                    }
                }
            }
            tokens
        })
        .collect()
}

pub fn highlight_code(source: &str, requested_language: &str) -> Value {
    let detected = language(requested_language);
    let lines = if detected.profile == Profile::Markup {
        highlight_markup(source)
    } else if detected.profile == Profile::Plain {
        source
            .split('\n')
            .map(|line| {
                if line.is_empty() {
                    Vec::new()
                } else {
                    vec![json!({ "kind": "plain", "value": line })]
                }
            })
            .collect()
    } else {
        highlight_general(source, detected.profile)
    };
    json!({
        "language": detected.canonical,
        "supported": detected.profile != Profile::Plain,
        "lines": lines,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn highlights_typescript_without_changing_source() {
        let result = highlight_code("const answer: number = 42 // done", "ts");
        assert_eq!(result["language"], "typescript");
        assert_eq!(result["supported"], true);
        let restored = result["lines"][0]
            .as_array()
            .unwrap()
            .iter()
            .filter_map(|token| token["value"].as_str())
            .collect::<String>();
        assert_eq!(restored, "const answer: number = 42 // done");
        assert!(result["lines"][0]
            .as_array()
            .unwrap()
            .iter()
            .any(|token| token["kind"] == "keyword"));
        assert!(result["lines"][0]
            .as_array()
            .unwrap()
            .iter()
            .any(|token| token["kind"] == "comment"));
    }

    #[test]
    fn highlights_markup_tags_and_attributes() {
        let result = highlight_code("<button disabled=\"true\">Save</button>", "html");
        let tokens = result["lines"][0].as_array().unwrap();
        assert!(tokens
            .iter()
            .any(|token| token["kind"] == "tag" && token["value"] == "button"));
        assert!(tokens
            .iter()
            .any(|token| token["kind"] == "attribute" && token["value"] == "disabled"));
    }
}
