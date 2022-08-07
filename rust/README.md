# Ergo Names Rust SDK

### Example for resolving an ergoname

```rust
let name: &str = "~balb";
let address: Option<String> = ergonames::resolve_ergoname(name, None);
```

### Example for address lookup

```rust
let address: &str = "3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL";
let token_list: Option<Vec<Token>> = ergonames::reverse_search(address, None);
```