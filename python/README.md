# Ergo Names Python SDK

### Example for resolving an ergoname

```python
name = "~balb";
address = ergonames.resolve_ergoname(name);
```

### Example for address lookup

```python
address = "3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL";
token_list = ergonames.reverse_search(address);
```