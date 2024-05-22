import { describe, expectTypeOf, it } from 'vitest';

import { Cas, ClusterTypes, DocDef } from '@cbjsdev/shared';

import { CppTransactionGetMetaData, CppTransactionLinks } from './binding.js';
import {
  connect,
  DocumentId,
  TransactionDocInfo,
  TransactionGetResult,
} from './index.js';

type Book = {
  title: string;
  authors: [string, ...string[]];
  sales: number;
  metadata: {
    tags: string[];
  };
};

type Author = {
  name: string;
};

type Publisher = {
  language: string;
};

type Order = {
  id: string;
};

type UserClusterTypes = ClusterTypes<{
  store: {
    grocery: {
      orders: [DocDef<`order::${string}`, Order>];
    };
    library: {
      books: [DocDef<`book::${string}`, Book>];
      authors: [DocDef<`author::${string}`, Author>];
      publisher: [DocDef<`publisher::${string}`, Publisher>];
    };
  };
}>;

describe('transactions', async () => {
  const cluster = await connect<UserClusterTypes>('');
  const collection = cluster.bucket('store').scope('library').collection('books');

  describe('get', () => {
    it('should validate the document key based on the cluster types', async () => {
      const tx = cluster.transactions();
      await tx.run(async (attempt) => {
        // @ts-expect-error Invalid key
        await attempt.get(collection, 'foo');

        await attempt.get(collection, 'book::001');
      });
    });

    it('should infer the result type based on the cluster types', async () => {
      const tx = cluster.transactions();
      const collection = cluster.bucket('store').scope('library').collection('authors');
      await tx.run(async (attempt) => {
        const result = await attempt.get(collection, 'author::001');

        expectTypeOf(result).toEqualTypeOf<
          TransactionGetResult<
            UserClusterTypes,
            'store',
            'library',
            'authors',
            'author::001'
          >
        >();
      });
    });
  });

  describe('exists', () => {
    it('should validate the document key based on the cluster types', async () => {
      const tx = cluster.transactions();
      await tx.run(async (attempt) => {
        // @ts-expect-error Invalid key
        await attempt.exists(collection, 'foo');

        await attempt.exists(collection, 'book::001');
      });
    });

    it('should infer the result type based on the cluster types', async () => {
      const tx = cluster.transactions();
      await tx.run(async (attempt) => {
        const result = await attempt.exists(collection, 'book::001');

        expectTypeOf(result.exists).toEqualTypeOf<boolean>();
        expectTypeOf(result.id).toEqualTypeOf<
          DocumentId<UserClusterTypes, 'store', 'library', 'books', 'book::001'>
        >();
        expectTypeOf(result.cas).toEqualTypeOf<Cas | undefined>();
        expectTypeOf(result._links).toEqualTypeOf<CppTransactionLinks | undefined>();
        expectTypeOf(result._metadata).toEqualTypeOf<
          CppTransactionGetMetaData | undefined
        >();

        if (result.exists) {
          expectTypeOf(result.exists).toEqualTypeOf<true>();
          expectTypeOf(result.id).toEqualTypeOf<
            DocumentId<UserClusterTypes, 'store', 'library', 'books', 'book::001'>
          >();
          expectTypeOf(result.cas).toEqualTypeOf<Cas>();
          expectTypeOf(result._links).toEqualTypeOf<CppTransactionLinks>();
          expectTypeOf(result._metadata).toEqualTypeOf<CppTransactionGetMetaData>();
          return;
        }

        expectTypeOf(result.exists).toEqualTypeOf<false>();
        expectTypeOf(result.id).toEqualTypeOf<
          DocumentId<UserClusterTypes, 'store', 'library', 'books', 'book::001'>
        >();
        expectTypeOf(result.cas).toEqualTypeOf<undefined>();
        expectTypeOf(result._links).toEqualTypeOf<undefined>();
        expectTypeOf(result._metadata).toEqualTypeOf<undefined>();
      });
    });
  });

  describe('insert', () => {
    it('should validate both key and value type based on the cluster types', async () => {
      const tx = cluster.transactions();
      await tx.run(async (attempt) => {
        // @ts-expect-error Invalid key
        await attempt.insert(collection, 'recipe::001', {
          title: 'Cbjs',
          authors: ['JesusTheHun'],
          metadata: { tags: ['npm'] },
          sales: 1_000_000_000,
        });

        // @ts-expect-error Invalid value
        await attempt.insert(collection, 'book::001', {
          title: 'Cbjs',
        });

        await attempt.insert(collection, 'book::001', {
          title: 'Cbjs',
          authors: ['JesusTheHun'],
          metadata: { tags: ['npm'] },
          sales: 1_000_000_000,
        });
      });
    });

    it('should infer the result type based on the cluster types', async () => {
      const tx = cluster.transactions();
      await tx.run(async (attempt) => {
        const result = await attempt.insert(collection, 'book::001', {
          title: 'Cbjs',
          authors: ['JesusTheHun'],
          metadata: { tags: ['npm'] },
          sales: 1_000_000_000,
        });

        expectTypeOf(result).toEqualTypeOf<
          TransactionGetResult<UserClusterTypes, 'store', 'library', 'books', 'book::001'>
        >();
      });
    });
  });

  describe('replace', () => {
    it('should validate both key and value type based on the cluster types', async () => {
      const tx = cluster.transactions();
      await tx.run(async (attempt) => {
        const bookExists = await attempt.exists(collection, 'book::001');

        if (!bookExists.exists) return;

        // @ts-expect-error Invalid key
        await attempt.replace(collection, 'recipe::001', {
          title: 'Cbjs',
          authors: ['JesusTheHun'],
          metadata: { tags: ['npm'] },
          sales: 1_000_000_000,
        });

        // @ts-expect-error Invalid value
        await attempt.replace(bookExists, {
          title: 'Cbjs',
        });

        await attempt.replace(bookExists, {
          title: 'Cbjs',
          authors: ['JesusTheHun'],
          metadata: { tags: ['npm'] },
          sales: 1_000_000_000,
        });
      });
    });

    it('should infer the result type based on the cluster types', async () => {
      const tx = cluster.transactions();
      await tx.run(async (attempt) => {
        const result = await attempt.insert(collection, 'book::001', {
          title: 'Cbjs',
          authors: ['JesusTheHun'],
          metadata: { tags: ['npm'] },
          sales: 1_000_000_000,
        });

        expectTypeOf(result).toEqualTypeOf<
          TransactionGetResult<UserClusterTypes, 'store', 'library', 'books', 'book::001'>
        >();
      });
    });
  });

  describe('remove', () => {
    it('should validate the TransactionDocInfo type based on the cluster types', async () => {
      const tx = cluster.transactions();
      await tx.run(async (attempt) => {
        const invalidTxDocInfo = null as unknown as TransactionDocInfo;

        // @ts-expect-error Invalid TransactionDocInfo
        await attempt.remove(invalidTxDocInfo);

        const bookExists = await attempt.exists(collection, 'book::001');
        if (!bookExists.exists) return;

        await attempt.remove(bookExists);
      });
    });

    it('should return an empty promise', async () => {
      const tx = cluster.transactions();
      await tx.run(async (attempt) => {
        const bookExists = await attempt.exists(collection, 'book::001');
        if (!bookExists.exists) return;

        const result = await attempt.remove(bookExists);

        expectTypeOf(result).toEqualTypeOf<void>();
      });
    });
  });

  describe('cbjs tx api', () => {
    it('should infer the result type based on the cluster types', async () => {
      await cluster.transactions().run(async (ctx) => {
        const result = await ctx
          .bucket('store')
          .scope('library')
          .collection('authors')
          .get('author::001');

        expectTypeOf(result).toEqualTypeOf<
          TransactionGetResult<
            UserClusterTypes,
            'store',
            'library',
            'authors',
            'author::001'
          >
        >();
      });
    });
  });
});
