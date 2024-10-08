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
import { transformerTwoslash } from '@shikijs/vitepress-twoslash';
import { defineConfig } from 'vitepress';

import { version } from '../../packages/cbjs/package.json';

const repositoryUrl = 'https://github.com/cbjs-dev/cbjs';

// prettier-ignore
export default defineConfig({
  srcDir: 'src',
  title: 'Cbjs',
  titleTemplate: 'Cbjs - Couchbase SDK for Node.js & TypeScript',
  description:
    'A modern Couchbase SDK for Node.js clients written in TypeScript, compatible with the official library.',
  lastUpdated: true,
  sitemap: {
    hostname: 'https://cbjs.dev',
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.png', media: '(prefers-color-scheme: light)' }],
    ['link', { rel: 'icon', href: '/favicon-dark.png', media: '(prefers-color-scheme: dark)' }],
    ['link', { rel: 'icon', href: '/cbjs-logo.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' }],
    ['link', { rel: 'icon', href: '/cbjs-logo.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' }],

    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],

    ['link', { rel: 'prefetch', href: '/cbjs-logo.svg', as: 'image' }],

    ['meta', { name: 'author', content: 'Jonathan MASSUCHETTI' }],
    ['meta', { name: 'og:title', content: 'Cbjs | A modern Couchbase SDK for Node.js and TypeScript' }],
    ['meta', { name: 'og:description', content: 'Inferred return type, path autocompletion and more' }],
    ['meta', { name: 'og:url', content: 'https://cbjs.dev' }],
    ['meta', { name: 'og:image', content: 'https://cbjs.dev/cbjs-og-image.png' }],
    ['meta', { name: 'twitter:title', content: 'Cbjs | A modern Couchbase SDK for Node.js and TypeScript' }],
    ['meta', { name: 'twitter:description', content: 'Inferred return type, path autocompletion and more' }],
    ['meta', { name: 'twitter:image', content: 'https://cbjs.dev/cbjs-og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'keywords', content: 'cbjs, couchbase, sdk, typescript, vitest, esm, node' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-0TFQ0L2SG1' },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-0TFQ0L2SG1');`,
    ],
  ],
  themeConfig: {
    logo: {
      light: '/cbjs-logotype.svg',
      dark: '/cbjs-logotype-dark.svg',
      alt: 'Cbjs logo',
    },
    siteTitle: false,
    search: {
      provider: 'local',
    },

    editLink: {
      pattern: `${repositoryUrl}/edit/main/docs/src/:path`,
      text: 'Suggest changes to this page',
    },

    nav: [
      { text: 'FAQ', link: '/guide/faq', activeMatch: '^/faq/' },
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
              text: 'Utilities',
              link: '/guide/utilities',
            },
            {
              text: 'Services',
              items: [
                {
                  text: 'KeyValue',
                  link: '/guide/services/kv',
                },
                {
                  text: 'Query',
                  link: '/guide/services/query',
                },
              ],
            },
            {
              text: 'HTTP Client',
              items: [
                {
                  text: 'Setup',
                  link: '/guide/http-client/',
                },
                {
                  text: 'Actions',
                  link: '/guide/http-client/actions',
                },
                {
                  text: 'Wait For',
                  link: '/guide/http-client/wait-for',
                }
              ]
            },
            {
              text: 'Deploy',
              items: [
                {
                  text: 'Introduction',
                  link: '/guide/deploy/',
                },
                {
                  text: 'Cluster config',
                  link: '/guide/deploy/cluster-config',
                },
              ]
            },
            {
              text: 'FAQ',
              link: '/guide/faq',
            }
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/cbjs-dev/cbjs' }],

    footer: {
      copyright: 'Copyright © 2023-Present Jonathan Massuchetti',
    },
  },
  markdown: {
    codeTransformers: [
      transformerTwoslash({
        errorRendering: 'hover',
        jsdoc: false,
      }),
    ],
  },
});
