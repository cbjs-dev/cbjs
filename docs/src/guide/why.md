---
title: Why Cbjs | Guide
---

# Why Cbjs

## Seeking a greater DX

We love Couchbase products.  
When using them, we want to have a great experience, we want to feel some magic.

### Powerful TypeScript integration

By adding path autocompletion, Cbjs increases your velocity, reduce the risk of typing errors while making future changes in document structure easier to manage.

The same goes for the names of buckets, scopes and collections. No more guessing no more constant.  
Autocompletion also means faster onboarding as the discovery for the keyspaces is right there, in your IDE.

When retrieving a document, the thought of having the type inferred from the key you passed felt so natural, and having the values type checked when mutating a document also felt really good !

Cbjs solves all of that for you using TypeScript.

### Integration tests

We know the pain of integration tests with a database.

You have to create the database structure before a single test can start and if you forget to clear the data after each test, your next test result may very well be wrong.  
Running tests concurrently required more a complex setup, resulting in increased difficulties.

The dream would be to create the keyspace involved in your test on demand, but also somehow isolate it so two tests using the same keyspace can run concurrently.

Cbjs do that for you transparently when using vitest.