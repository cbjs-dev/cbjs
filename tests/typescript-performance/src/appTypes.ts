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
import { ClusterTypes, DocDef } from '@cbjsdev/cbjs';

type BookId = `book::${string}`;
type BookDocument = {
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

type BookSalesId = `book::${string}::sales`;
type BookSalesDocument = {
  perCountry: Record<
    string,
    {
      total: number;
      perYear: Record<number, number>;
    }
  >;
};

type AuthorId = `author::${string}`;
type AuthorDocument = {
  firstname: string;
  lastname: string;
  birthDate: number;
  bookIds: BookId[];
};

type EditorId = `editor::${string}`;
type EditorDocument = {
  name: string;
  createdAt?: number;
  bookPublished?: number;
};

export type AppTypes = ClusterTypes<
  {
    keyMatchingStrategy: 'delimiter';
    keyDelimiter: '::';
  },
  {
    store: {
      library: {
        books: [DocDef<BookId, BookDocument>, DocDef<BookSalesId, BookSalesDocument>];
        authors: [DocDef<AuthorId, AuthorDocument>];
        editors: [DocDef<EditorId, EditorDocument>];
      };
    };
  }
>;
