/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { describe, expectTypeOf, test } from 'vitest';

import { BucketTypes, ClusterTypes, CollectionTypes, ScopeTypes } from './cluster.types.js';
import { DocDef } from './document.types.js';

describe('full types', () => {
  expectTypeOf<
    ClusterTypes<{
      BucketOne: BucketTypes<{
        ScopeOne: ScopeTypes<{
          CollectionOne: CollectionTypes<[DocDef<string, { title: string }>]>;
        }>;
      }>;
    }>
  >().toEqualTypeOf<{
    options: never;
    definitions: {
      BucketOne: {
        options: never;
        definitions: {
          ScopeOne: {
            options: never;
            definitions: {
              CollectionOne: {
                options: never;
                definitions: [DocDef<string, { title: string }>];
              };
            };
          };
        };
      };
    };
  }>();
});

describe('ClusterTypes', () => {
  test('raw bucket map without options', () => {
    expectTypeOf<
      ClusterTypes<{
        BucketOne: {
          ScopeOne: {
            CollectionOne: [DocDef<string, { title: string }>];
          };
        };
      }>
    >().toEqualTypeOf<{
      options: never;
      definitions: {
        BucketOne: {
          options: never;
          definitions: {
            ScopeOne: {
              options: never;
              definitions: {
                CollectionOne: {
                  options: never;
                  definitions: [DocDef<string, { title: string }>];
                };
              };
            };
          };
        };
      };
    }>();
  });

  test('raw scope map with options', () => {
    expectTypeOf<
      ClusterTypes<
        { keyMatchingStrategy: 'always' },
        {
          BucketOne: {
            ScopeOne: {
              CollectionOne: [DocDef<string, { title: string }>];
            };
          };
        }
      >
    >().toEqualTypeOf<{
      options: { keyMatchingStrategy: 'always' };
      definitions: {
        BucketOne: {
          options: never;
          definitions: {
            ScopeOne: {
              options: never;
              definitions: {
                CollectionOne: {
                  options: never;
                  definitions: [DocDef<string, { title: string }>];
                };
              };
            };
          };
        };
      };
    }>();
  });

  test('normalized scopes without options', () => {
    expectTypeOf<
      ClusterTypes<{
        BucketOne: BucketTypes<{
          ScopeOne: {
            CollectionOne: [DocDef<string, { title: string }>];
          };
        }>;
      }>
    >().toEqualTypeOf<{
      options: never;
      definitions: {
        BucketOne: {
          options: never;
          definitions: {
            ScopeOne: {
              options: never;
              definitions: {
                CollectionOne: {
                  options: never;
                  definitions: [DocDef<string, { title: string }>];
                };
              };
            };
          };
        };
      };
    }>();
  });

  test('normalized scopes with options', () => {
    expectTypeOf<
      ClusterTypes<
        { keyMatchingStrategy: 'always' },
        {
          BucketOne: BucketTypes<{
            ScopeOne: {
              CollectionOne: [DocDef<string, { title: string }>];
            };
          }>;
        }
      >
    >().toEqualTypeOf<{
      options: { keyMatchingStrategy: 'always' };
      definitions: {
        BucketOne: {
          options: never;
          definitions: {
            ScopeOne: {
              options: never;
              definitions: {
                CollectionOne: {
                  options: never;
                  definitions: [DocDef<string, { title: string }>];
                };
              };
            };
          };
        };
      };
    }>();
  });
});

test('BucketTypes', () => {
  test('raw scope map without options', () => {
    expectTypeOf<
      BucketTypes<{
        ScopeOne: {
          CollectionOne: [DocDef<string, { title: string }>];
        };
      }>
    >().toEqualTypeOf<{
      options: never;
      definitions: {
        ScopeOne: {
          options: never;
          definitions: {
            CollectionOne: {
              options: never;
              definitions: [DocDef<string, { title: string }>];
            };
          };
        };
      };
    }>();
  });

  test('raw scope map with options', () => {
    expectTypeOf<
      BucketTypes<
        { keyMatchingStrategy: 'always' },
        {
          ScopeOne: {
            CollectionOne: [DocDef<string, { title: string }>];
          };
        }
      >
    >().toEqualTypeOf<{
      options: { keyMatchingStrategy: 'always' };
      definitions: {
        ScopeOne: {
          options: never;
          definitions: {
            CollectionOne: {
              options: never;
              definitions: [DocDef<string, { title: string }>];
            };
          };
        };
      };
    }>();
  });

  test('normalized scopes without options', () => {
    expectTypeOf<
      BucketTypes<{
        ScopeOne: ScopeTypes<{
          CollectionOne: CollectionTypes<[DocDef<string, { title: string }>]>;
        }>;
      }>
    >().toEqualTypeOf<{
      options: never;
      definitions: {
        ScopeOne: {
          options: never;
          definitions: {
            CollectionOne: {
              options: never;
              definitions: [DocDef<string, { title: string }>];
            };
          };
        };
      };
    }>();
  });

  test('normalized scopes with options', () => {
    expectTypeOf<
      BucketTypes<
        { keyMatchingStrategy: 'always' },
        {
          ScopeOne: ScopeTypes<{
            CollectionOne: CollectionTypes<[DocDef<string, { title: string }>]>;
          }>;
        }
      >
    >().toEqualTypeOf<{
      options: { keyMatchingStrategy: 'always' };
      definitions: {
        ScopeOne: {
          options: never;
          definitions: {
            CollectionOne: {
              options: never;
              definitions: [DocDef<string, { title: string }>];
            };
          };
        };
      };
    }>();
  });
});

test('ScopeTypes', () => {
  test('raw collection map without options', () => {
    expectTypeOf<
      ScopeTypes<{
        CollectionOne: [DocDef<string, { title: string }>];
      }>
    >().toEqualTypeOf<{
      options: never;
      definitions: {
        CollectionOne: {
          options: never;
          definitions: [DocDef<string, { title: string }>];
        };
      };
    }>();
  });

  test('raw collection map with options', () => {
    expectTypeOf<
      ScopeTypes<
        { keyMatchingStrategy: 'always' },
        {
          CollectionOne: [DocDef<string, { title: string }>];
        }
      >
    >().toEqualTypeOf<{
      options: { keyMatchingStrategy: 'always' };
      definitions: {
        CollectionOne: {
          options: never;
          definitions: [DocDef<string, { title: string }>];
        };
      };
    }>();
  });

  test('normalized collections without options', () => {
    expectTypeOf<
      ScopeTypes<{
        CollectionOne: CollectionTypes<[DocDef<string, { title: string }>]>;
      }>
    >().toEqualTypeOf<{
      options: never;
      definitions: {
        CollectionOne: {
          options: never;
          definitions: [DocDef<string, { title: string }>];
        };
      };
    }>();
  });

  test('normalized collections with options', () => {
    expectTypeOf<
      ScopeTypes<
        { keyMatchingStrategy: 'always' },
        {
          CollectionOne: CollectionTypes<[DocDef<string, { title: string }>]>;
        }
      >
    >().toEqualTypeOf<{
      options: { keyMatchingStrategy: 'always' };
      definitions: {
        CollectionOne: {
          options: never;
          definitions: [DocDef<string, { title: string }>];
        };
      };
    }>();
  });
});

describe('CollectionTypes', () => {
  test('without options', () => {
    expectTypeOf<CollectionTypes<[DocDef<string, { title: string }>]>>().toEqualTypeOf<{
      options: never;
      definitions: [DocDef<string, { title: string }>];
    }>();
  });

  test('with options', () => {
    expectTypeOf<
      CollectionTypes<
        { keyMatchingStrategy: 'always' },
        [DocDef<string, { title: string }>]
      >
    >().toEqualTypeOf<{
      options: { keyMatchingStrategy: 'always' };
      definitions: [DocDef<string, { title: string }>];
    }>();
  });
});
