# Keyspace Isolation

If you want to run your integration tests concurrently, you must use some kind of isolation so each test doesn't see the data of the other tests.
Cbjs provides an easy way to do that.

You can either isolate at the test level, so each test will have its own `keyspace realm`. Or you can isolate at the suite level and your tests will share the same `keyspace realm`.

## Keyspace Realm

Let's say we have two keyspaces : `store.library.books` and `store.library.members`.
When running our first test, Cbjs will create the following realm :

```
bucket: 
    store_dskjdlksqd8 => store
scope: 
    library_adjkfejdri8 => library
collection: 
    books_dsjokfjdk9 => books
    members_fdjksfa6 => members
```

Any call within the same test that reference a keyspace, will use that realm to reach the targeted keyspace. If we run a new test, a new realm will be created, unless with use a different `isolation scope`. 

## Realm Scope

The realm can be shared for all the tests in suites, or be exclusive to each test.
You can also share a realm between all suites within the current suite.

`'per-suite'`: the realm is shared by all tests in a suite, but each suite have their own realm.  
`'per-test'`: the realm is exclusive to each test.  
`'local'`: the realm is shared by this suite and all its children.  
`false`: no isolation will be provided.

:::note
The realm scope is inherited by children suites. So defining `per-suite` or `per-test` in a suite means suites and suites within them will apply this logic.

## Isolation Level

By default a bucket can be host of several realms. Since each realm have their own boundaries, it works for most cases. This is the default, `collection` isolation level.

Sometimes you really need dedicated buckets just for this test or suite, not shared at all with other realms. When this is the case, use the `bucket` isolation level and each isolation will be affected to an exclusive bucket.  
Be sure to understand that if the isolation scope is `per-suite`, the realm and therefore the buckets will still be shared between all the tests of the suite, but they will not host other realms.
