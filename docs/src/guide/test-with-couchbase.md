# How to write tests with Couchbase

When you write tests interacting with Couchbase, it's easy to get fooled by its asynchronicity.  
Buckets, scopes, collections, query indexes and search indexes are built asynchronously.

This means a numbers of things to avoid the flakiness of our tests.

## TL;DR - Cheat sheet

|                                      | Check / Solution                                                                      | Cbjs   helper                         |
|--------------------------------------|---------------------------------------------------------------------------------------|---------------------------------------|
| Write a keyspace inside a bucket     | GET `/pools/default/<bucket>` is a `200`                                              | `waitForBucket`                       |
| Write a keyspace inside a scope      | Response of `/pools/default/<bucket>/scopes` includes the scope                       | `waitForScope`                        |
| Write a keyspace inside a collection | Response of `/pools/default/<bucket>/scopes` includes the collection                  | `waitForCollection`                   |
| Write a document in the bucket       | The bucket stats (ram, vBuckets) are not empty                                        | `waitForBucket`                       |
| Write a document in the scope        | Bucket is writable and scope is included in `/pools/default/<bucket>/scopes`          | `waitForScope`                        |
| Write a document in the collection   | Bucket is writable and collection is included in `/pools/default/<bucket>/scopes`     | `waitForCollection`                   |
| Create a query index using a bucket  | `SELECT RAW name FROM system:keyspaces`                                               | `getQueryBuckets`                     |
| Query fresh documents                | Query with `REQUEST_PLUS` consistency on the indexes involved before our actual query | Too business specific to get a helper |
| Full Text Search fresh documents     | Query for docIds and wait for the result to include our documents                     | `waitForDocumentsInSearchIndex`       |


## Keyspaces (buckets, scopes and collections)

When we create a keyspace object, the API will return immediately, but the creation is not instantaneous.  
Each service of each node will be notified asynchronously about the new keyspace.

We will need to wait for the keyspace to be known and ready in order to :

1. Create a keyspace object within it
2. Write a document within it
3. Create an index that references it

The check must be performed on each node involved ; so if you want to write a document in a fresh keyspace, you need to
check every node with the `kv` service before writing the document.
For indexes, unless the index is configured to be on specific nodes, you will need to check every node with the `query` service.

To make sure a keyspace is visible by the query service, you need to execute the following statement and verify our keyspace is
included in the result set :

```sql
SELECT RAW name FROM system:keyspaces
```

## Query fresh documents

Since the indexes are built asynchronously, if we execute a query just after writing a document, the query result
is not guaranteed to include the latest changes.  
If we want to have the latest updates, we can execute our query with the `REQUEST_PLUS` consistency.
But it is likely that our actual business query does not require this level of consistency, so the trick here will be to execute a _consistency query_
prior to our actual query.  

Let's say we are testing a query that retrieves the blog posts authored by a user :

Given we have the following index: `CREATE INDEX posts_listing ON posts (authorId, categoryId, createdAt)`, we will proceed as follow :

1. We insert our test blog posts
2. We execute `SELECT META().id FROM posts WHERE authorId IS NOT MISSING` with `REQUEST_PLUS` consistency - that's our _consistency query_
3. We call `getUserPosts(userId)` which executes `SELECT META().id, title FROM posts WHERE authorId = $1 ORDER BY createdAt DESC`

The `WHERE` clause in our _consistency query_ is very important because it targets the index we are using in our business query.  
We only need to specify the first field of the index for it to be used by the query,
so one _consistency query_ can be reused for every query that use the same index.

So now we will create a helper function `waitForBlogPosts` that executes the query.
If we create a new index on the `posts` collection, we can add another _consistency query_ with an **index hint** in our helper function, so
we only have to know about this helper.
