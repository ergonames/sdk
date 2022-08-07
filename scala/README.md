# Ergo Names Scala SDK

### Documentation

Now we can import the package.

```scala
import ergonames.Sdk.ErgoNamesSdk._
```

To resolve an address from an ErgoName use the **resolve\_ergoname()** function.

```scala
val name = "~balb" 
val address = ergonames.resolveErgoname(name)
```

This function will either return a String or a null object.

Example result:

```
3WwKzFjZGrtKAV7qSCoJsZK9iJhLLrUa3uwd4yw52bVtDVv6j5TL
```
