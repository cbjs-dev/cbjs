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
import { DocDef } from '@cbjsdev/cbjs';

export type BookId = `book::${string}`;
export type BookDocument = {
  title: string;
  authors: [string, ...string[]];
  styles: string[];
  tags: string[];
  editors: Record<
    EditorId,
    {
      publishedAt: number;
      price: string;
      sales?: number;
    }
  >;
};

export type BookSalesId = `book::${string}::sales`;
export type BookSalesDocument = {
  perCountry: Record<
    string,
    {
      total: number;
      perYear: Record<number, number>;
    }
  >;
};

export type AuthorId = `author::${string}`;
export type AuthorDocument = {
  firstname: string;
  lastname: string;
  birthDate: number;
  bookIds: BookId[];
};

export type EditorId = `editor::${string}`;
export type EditorDocument = {
  name: string;
  createdAt?: number;
  bookPublished?: number;
};

export type AppTypes = {
  '@options': {
    keyMatchingStrategy: 'delimiter';
    keyDelimiter: '::';
  };
  'store': {
    library: {
      books: [DocDef<BookId, BookDocument>, DocDef<BookSalesId, BookSalesDocument>];
      authors: [DocDef<AuthorId, AuthorDocument>];
      editors: [DocDef<EditorId, EditorDocument>];
    };
  };
};
