# Ergo Names Rust SDK

### Example for resolving an ergoname

```rust
let name: &str = "mgpai";
let address = ergonames::resolve_ergoname(name);
```

### Example for address lookup

```rust
let name: &str = "mgpai";
let address = ergoname_owner(name);
```
```
