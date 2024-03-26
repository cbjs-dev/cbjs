# Keyspace Isolation

## Isolation Scope

The task isolation can take the following values :  `'suite' | 'test' | true | false`.

`'per-suite'`: the same keyspaces will be shared by the current suite and all its children, unless overwritten.  
`'per-test'`: each test will have its own isolation.  
`'local'`: the isolation is shared by this suite and all its children.  
`false`: no isolation will be provided. 


## Isolation Level

By default the keyspaces are isolated at the collection level.
Meaning that two tests run with a task isolation of `test` will use the same bucket, but they will have isolated scopes and collections.

If you need a complete isolation, you can use the `bucket` isolation level, which will use a new bucket for each isolation. 