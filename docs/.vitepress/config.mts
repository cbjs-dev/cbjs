/*
 * Copyright (c) 2024-Present Jonathan MASSUCHETTI.
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
import { defineConfig } from 'vitepress';

import { version } from '../../packages/cbjs/package.json';
import { gaHeadScript } from './ga-scripts';

const repositoryUrl = 'https://github.com/cbjs-dev/cbjs';

export default defineConfig({
  srcDir: 'src',
  title: 'Cbjs',
  description: 'A modern Couchbase client for JS runtimes',
  lastUpdated: true,
  head: [['script', {}, gaHeadScript]],
  themeConfig: {
    search: {
      provider: 'local',
    },

    editLink: {
      pattern: `${repositoryUrl}/edit/main/docs/src/:path`,
      text: 'Suggest changes to this page',
    },

    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '^/guide/' },
      {
        text: `v${version}`,
        link: `${repositoryUrl}/releases`,
      },
    ],

    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Why Cbjs',
              link: '/guide/why',
            },
            {
              text: 'Getting Started',
              link: '/guide/',
            },
            {
              text: 'Features',
              link: '/guide/features',
            },
            {
              text: 'Cluster Types',
              link: '/guide/cluster-types',
            },
            {
              text: 'Services',
              items: [
                {
                  text: 'KeyValue',
                  link: '/guide/services/kv.md',
                },
              ],
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/cbjs-dev/cbjs' }],

    footer: {
      copyright: 'Copyright © 2023-Present Jonathan Massuchetti',
    },
  },
});
