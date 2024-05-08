---
title: Setup | HTTP Client
outline: [2, 3]
---

# Couchbase HTTP Client

Cbjs offers a HTTP client in order to support operations that are not offered by the native implementation.
It also support lightweight environment where loading 10+ MB of binary is not sustainable.

Because the Couchbase API is vast, only a subset of endpoints are currently supported.  
The initial motivation for this client was deployment automation but only aims to grow .

If you need something that is not supported yet, please open [an issue](https://github.com/cbjs-dev/cbjs/issues).

::: code-group

```bash [npm]
npm install @cbjsdev/http-client
```

```bash [yarn]
yarn add @cbjsdev/http-client
```

```bash [pnpm]
pnpm add @cbjsdev/http-client
```

```bash [bun]
bun add @cbjsdev/http-client
```

:::

## API Config
All the functions of the http client take the api config as the first parameter:

```ts twoslash
export type CouchbaseHttpApiConfig = {
  /**
   * Hostname of the node that will receive the request.
   */
  hostname: string;

  /**
   * Use https or not.
   * 
   * @default: true
   */
  secure: boolean;

  /**
   * Credentials to authenticate the request.
   */
  credentials: {
    username: string;
    password: string;
  };

  /**
   * Timeout for the HTTP requests.
   */
  timeout?: number;
  
  /**
   * The certificate will be used for HTTPS requests.
   */
  certificate?: string; 
};
```

::: tip
The SSL certificate of Couchbase Capella is already included in the library, so you don't need to provide it.
:::

## Logger

You can integrate the http client by passing your own logger.

```ts twoslash
import { Logger } from 'pino';
const logger = 1 as any as Logger;
// ---cut-before---
import { setHttpClientLogger } from '@cbjsdev/http-client';

setHttpClientLogger(logger);
```