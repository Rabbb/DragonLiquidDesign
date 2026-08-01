(module
  (memory (export "memory") 1)
  (func (export "fnv1a") (param $pointer i32) (param $length i32) (result i32)
    (local $hash i32)
    (local $end i32)
    i32.const -2128831035
    local.set $hash
    local.get $pointer
    local.get $length
    i32.add
    local.set $end
    block $done
      loop $next
        local.get $pointer
        local.get $end
        i32.ge_u
        br_if $done
        local.get $hash
        local.get $pointer
        i32.load8_u
        i32.xor
        i32.const 16777619
        i32.mul
        local.set $hash
        local.get $pointer
        i32.const 1
        i32.add
        local.set $pointer
        br $next
      end
    end
    local.get $hash
  )
)
