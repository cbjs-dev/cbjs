import { describe, expectTypeOf, test } from 'vitest';

import { connect } from './couchbase.js';
import { DesignDocument, DesignDocumentView } from './viewindexmanager.js';
import { DesignDocumentNamespace } from './viewtypes.js';

describe('view index manager', async () => {
  const cluster = await connect('...');
  const viewManager = cluster.bucket('ci').viewIndexes();

  const designDoc = new DesignDocument({
    name: 'testDoc',
    views: {
      test: new DesignDocumentView({
        map: 'whatever',
      }),
    },
  });

  test('upsertDesignDocument should support all signatures', async () => {
    void viewManager.upsertDesignDocument(designDoc, DesignDocumentNamespace.Development);
    void viewManager.upsertDesignDocument(
      designDoc,
      DesignDocumentNamespace.Development,
      {}
    );
    void viewManager.upsertDesignDocument(
      designDoc,
      DesignDocumentNamespace.Development,
      (err) => {
        expectTypeOf(err).toEqualTypeOf<Error | null>();
      }
    );
    void viewManager.upsertDesignDocument(
      designDoc,
      DesignDocumentNamespace.Development,
      {},
      (err) => {
        expectTypeOf(err).toEqualTypeOf<Error | null>();
      }
    );
  });

  test('upsertDesignDocument should support all deprecated signatures', async () => {
    void viewManager.upsertDesignDocument(designDoc);
    void viewManager.upsertDesignDocument(designDoc, {});
    void viewManager.upsertDesignDocument(designDoc, (err) => {
      expectTypeOf(err).toEqualTypeOf<Error | null>();
    });
    void viewManager.upsertDesignDocument(designDoc, {}, (err) => {
      expectTypeOf(err).toEqualTypeOf<Error | null>();
    });
  });

  test('dropDesignDocument should support all signatures', async () => {
    void viewManager.dropDesignDocument(
      designDoc.name,
      DesignDocumentNamespace.Development
    );
    void viewManager.dropDesignDocument(
      designDoc.name,
      DesignDocumentNamespace.Development,
      {}
    );
    void viewManager.dropDesignDocument(
      designDoc.name,
      DesignDocumentNamespace.Development,
      (err) => {
        expectTypeOf(err).toEqualTypeOf<Error | null>();
      }
    );
    void viewManager.dropDesignDocument(
      designDoc.name,
      DesignDocumentNamespace.Development,
      {},
      (err) => {
        expectTypeOf(err).toEqualTypeOf<Error | null>();
      }
    );
  });

  test('dropDesignDocument should support all deprecated signatures', async () => {
    void viewManager.dropDesignDocument(designDoc.name);
    void viewManager.dropDesignDocument(designDoc.name, {});
    void viewManager.dropDesignDocument(designDoc.name, (err) => {
      expectTypeOf(err).toEqualTypeOf<Error | null>();
    });
    void viewManager.dropDesignDocument(designDoc.name, {}, (err) => {
      expectTypeOf(err).toEqualTypeOf<Error | null>();
    });
  });

  test('publishDesignDocument should support all signatures', async () => {
    void viewManager.publishDesignDocument(designDoc.name);
    void viewManager.publishDesignDocument(designDoc.name, {});
    void viewManager.publishDesignDocument(designDoc.name, (err) => {
      expectTypeOf(err).toEqualTypeOf<Error | null>();
    });
    void viewManager.publishDesignDocument(designDoc.name, {}, (err) => {
      expectTypeOf(err).toEqualTypeOf<Error | null>();
    });
  });

  test('getAllDesignDocuments should support all signatures', async () => {
    void viewManager.getAllDesignDocuments(DesignDocumentNamespace.Development);
    void viewManager.getAllDesignDocuments(DesignDocumentNamespace.Development, {});
    void viewManager.getAllDesignDocuments(
      DesignDocumentNamespace.Development,
      (err, res) => {
        expectTypeOf(res).toEqualTypeOf<DesignDocument[] | null>();
        expectTypeOf(err).toEqualTypeOf<Error | null>();

        if (err) {
          expectTypeOf(err).toEqualTypeOf<Error>();
          return;
        }

        expectTypeOf(res).toEqualTypeOf<DesignDocument[]>();
      }
    );
    void viewManager.getAllDesignDocuments(
      DesignDocumentNamespace.Development,
      {},
      (err, res) => {
        expectTypeOf(res).toEqualTypeOf<DesignDocument[] | null>();
        expectTypeOf(err).toEqualTypeOf<Error | null>();

        if (err) {
          expectTypeOf(err).toEqualTypeOf<Error>();
          return;
        }

        expectTypeOf(res).toEqualTypeOf<DesignDocument[]>();
      }
    );
  });

  test('getAllDesignDocuments should support all deprecated signatures', async () => {
    void viewManager.getAllDesignDocuments();
    void viewManager.getAllDesignDocuments({});
    void viewManager.getAllDesignDocuments((err, res) => {
      expectTypeOf(res).toEqualTypeOf<DesignDocument[] | null>();
      expectTypeOf(err).toEqualTypeOf<Error | null>();

      if (err) {
        expectTypeOf(err).toEqualTypeOf<Error>();
        return;
      }

      expectTypeOf(res).toEqualTypeOf<DesignDocument[]>();
    });
    void viewManager.getAllDesignDocuments({}, (err, res) => {
      expectTypeOf(res).toEqualTypeOf<DesignDocument[] | null>();
      expectTypeOf(err).toEqualTypeOf<Error | null>();

      if (err) {
        expectTypeOf(err).toEqualTypeOf<Error>();
        return;
      }

      expectTypeOf(res).toEqualTypeOf<DesignDocument[]>();
    });
  });

  test('getDesignDocument should support all signatures', async () => {
    void viewManager.getDesignDocument(
      designDoc.name,
      DesignDocumentNamespace.Development
    );
    void viewManager.getDesignDocument(
      designDoc.name,
      DesignDocumentNamespace.Development,
      {}
    );
    void viewManager.getDesignDocument(
      designDoc.name,
      DesignDocumentNamespace.Development,
      (err, res) => {
        expectTypeOf(res).toEqualTypeOf<DesignDocument | null>();
        expectTypeOf(err).toEqualTypeOf<Error | null>();

        if (err) {
          expectTypeOf(err).toEqualTypeOf<Error>();
          return;
        }

        expectTypeOf(res).toEqualTypeOf<DesignDocument>();
      }
    );
    void viewManager.getDesignDocument(
      designDoc.name,
      DesignDocumentNamespace.Development,
      {},
      (err, res) => {
        expectTypeOf(res).toEqualTypeOf<DesignDocument | null>();
        expectTypeOf(err).toEqualTypeOf<Error | null>();

        if (err) {
          expectTypeOf(err).toEqualTypeOf<Error>();
          return;
        }

        expectTypeOf(res).toEqualTypeOf<DesignDocument>();
      }
    );
  });

  test('getDesignDocument should support all deprecated signatures', async () => {
    void viewManager.getDesignDocument(designDoc.name);
    void viewManager.getDesignDocument(designDoc.name, {});
    void viewManager.getDesignDocument(designDoc.name, (err, res) => {
      expectTypeOf(res).toEqualTypeOf<DesignDocument | null>();
      expectTypeOf(err).toEqualTypeOf<Error | null>();

      if (err) {
        expectTypeOf(err).toEqualTypeOf<Error>();
        return;
      }

      expectTypeOf(res).toEqualTypeOf<DesignDocument>();
    });
    void viewManager.getDesignDocument(designDoc.name, {}, (err, res) => {
      expectTypeOf(res).toEqualTypeOf<DesignDocument | null>();
      expectTypeOf(err).toEqualTypeOf<Error | null>();

      if (err) {
        expectTypeOf(err).toEqualTypeOf<Error>();
        return;
      }

      expectTypeOf(res).toEqualTypeOf<DesignDocument>();
    });
  });
});
