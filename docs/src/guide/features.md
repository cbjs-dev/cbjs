---
title: Features | Guide
outline: deep
---

# Features

- Compatible with the official client
- Improved TypeScript function signatures - [learn more](#discriminated-unions)
- [Inferred return type for document and sub-document operation](#inferred-return-type)
- [Path autocomplete for sub-document operation](#ide-autocompletion)
- [Chainable sub-document operations](/guide/services/kv#chainable-sub-doc-operations)
- HTTP Client
- Vitest fixtures

## Compatible with the official client

Cbjs is compatible with the official client.  
The main goal of Cbjs is to bring TypeScript support.
Cbjs also bring more sound and consistent behaviour, sometimes leading to small runtime changes. See [runtime changes](runtime-changes).

## KeyValue Supercharged Types

Once you have defined your [Cluster Types](cluster-types), you will unlock many powers.

### Inferred return type

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [ DocDef<
        `book::${string}`,
        {
          title: string;
          authors: string[];
          quater_sales: [number, number, number, number];
        }
      > ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('');
const collection = cluster.bucket('store').scope('library').collection('books');
const bookId = 'book::001';
// @errors: 2304 2554
// ---cut-before---
const { content: book } = await collection.get(bookId);
const {
  content: [firstAuthor],
} = await collection.lookupIn(bookId).get('authors[0]');
//                 ^?
```

&nbsp;
&nbsp;
&nbsp;

### IDE Autocompletion

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [ DocDef<
        `book::${string}`,
        {
          title: string;
          authors: string[];
          quater_sales: [number, number, number, number];
        }
      > ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('');
const collection = cluster.bucket('store').scope('library').collection('books');
const bookId = 'book::001';
// @noErrors: 2769
// ---cut-before---
const {
  content: [title],
} = await collection
      .lookupIn(bookId)
      .get('ti');
//            ^|

const {
  content: [quaterSales],
} = await collection
      .lookupIn(bookId)
      .get('qua');
//             ^|
```

&nbsp;
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;  
&nbsp;

You can learn more about this topic on the page dedicated to [Cluster Types](cluster-types).

## Discriminated Unions

Because Cbjs uses discriminated unions, type guards emerge naturally.

### Sub-document lookup

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [ DocDef<
        `book::${string}`,
        {
          title: string;
          authors: string[];
          quater_sales: [number, number, number, number];
        }
      > ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('');
const collection = cluster.bucket('store').scope('library').collection('books');
const bookId = 'book::001';
// ---cut-before---

// The official library would give you : { value?: any; error: Error | null }
// With Cbjs you get :
const {
  content: [title],
} = await collection.lookupIn(bookId).get('title');
//                 ^?

if (title.error) {
  throw new Error('Failed to retrieve the title.');
}

// Because of the discriminated union, the previous condition acts as a type guard.
console.log(title);
//            ^?
```

&nbsp;

### Callbacks

```ts twoslash
import { connect, DocDef } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [ DocDef<
        `book::${string}`,
        {
          title: string;
          authors: string[];
          quater_sales: [number, number, number, number];
        }
      > ]
    };
  };
};

const cluster = await connect<MyClusterTypes>('');
const collection = cluster.bucket('store').scope('library').collection('books');
const bookId = 'book::001';
// ---cut-before---
// Check the type of `res` before the condition and after ✨
const result = await collection.get(bookId, (err, res) => {
  if (err) return;
  console.log(res);
});
```

## Better overall result types

Another example of what Cbjs does for you.

```ts twoslash
import { DocDef, connect } from '@cbjsdev/cbjs';

type MyClusterTypes = {
  store: {
    library: {
      books: [ DocDef<
        `book::${string}`,
        {
          title: string;
          authors: string[];
          quater_sales: [number, number, number, number];
        }
      > ]
    },
  };
};

const cluster = await connect<MyClusterTypes>('');
const collection = cluster.bucket('store').scope('library').collection('books');
const bookId = 'book::001';
// @noErrors: 2451 2769
// ---cut-before---

const { expiryTime } = await collection.get(bookId);
//       ^?



const { expiryTime } = await collection.get(bookId, { withExpiry: true });
//        ^?
```

&nbsp;  
&nbsp;
