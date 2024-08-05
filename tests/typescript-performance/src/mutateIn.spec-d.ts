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
import { connect } from '@cbjsdev/cbjs';

import { AppTypes } from './appTypes.js';

const cluster = await connect<AppTypes>('');
const library = cluster.bucket('store').scope('library');
const books = library.collection('books');
const authors = library.collection('authors');

const r = await authors.mutateIn('author::001').arrayAppend('bookIds', 'book::001');

const r2 = await books.mutateIn('book::001::sales').replace('perCountry.FR', {
  total: 3038,
  perYear: {
    2024: 2300,
    2023: 738,
  },
});
