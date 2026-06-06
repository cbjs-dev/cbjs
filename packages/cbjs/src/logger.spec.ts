/*
 * Copyright (c) 2023-Present Jonathan MASSUCHETTI <jonathan.massuchetti@dappit.fr>.
 * Copyright (c) 2013-Present Couchbase Inc.
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
import { describe, expect, it, vi } from 'vitest';

import {
  CouchbaseLogger,
  createConsoleLogger,
  type Logger,
  LogLevel,
  NoOpLogger,
  parseLogLevel,
} from './logger.js';

describe('parseLogLevel', () => {
  it('returns the level when given a valid enum value', () => {
    expect(parseLogLevel(LogLevel.TRACE)).toBe(LogLevel.TRACE);
    expect(parseLogLevel(LogLevel.ERROR)).toBe(LogLevel.ERROR);
  });

  it('parses level names case-insensitively', () => {
    expect(parseLogLevel('trace')).toBe(LogLevel.TRACE);
    expect(parseLogLevel('DEBUG')).toBe(LogLevel.DEBUG);
    expect(parseLogLevel('Info')).toBe(LogLevel.INFO);
    expect(parseLogLevel('WARN')).toBe(LogLevel.WARN);
    expect(parseLogLevel('error')).toBe(LogLevel.ERROR);
  });

  it('returns undefined for unknown names', () => {
    expect(parseLogLevel('verbose')).toBeUndefined();
    expect(parseLogLevel('')).toBeUndefined();
  });

  it('returns undefined for out-of-range numbers', () => {
    expect(parseLogLevel(-1)).toBeUndefined();
    expect(parseLogLevel(5)).toBeUndefined();
  });
});

describe('NoOpLogger', () => {
  it('implements every level as a no-op', () => {
    const logger = new NoOpLogger();
    expect(logger.trace('a')).toBeUndefined();
    expect(logger.debug('a')).toBeUndefined();
    expect(logger.info('a')).toBeUndefined();
    expect(logger.warn('a')).toBeUndefined();
    expect(logger.error('a')).toBeUndefined();
  });
});

describe('CouchbaseLogger', () => {
  it('delegates each level to the wrapped logger with all arguments', () => {
    const inner: Required<Logger> = {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const logger = new CouchbaseLogger(inner);

    logger.trace('t', 1);
    logger.debug('d', 2);
    logger.info('i', 3);
    logger.warn('w', 4);
    logger.error('e', 5);

    expect(inner.trace).toHaveBeenCalledWith('t', 1);
    expect(inner.debug).toHaveBeenCalledWith('d', 2);
    expect(inner.info).toHaveBeenCalledWith('i', 3);
    expect(inner.warn).toHaveBeenCalledWith('w', 4);
    expect(inner.error).toHaveBeenCalledWith('e', 5);
  });

  it('is safe when the wrapped logger only implements a subset of levels', () => {
    const info = vi.fn();
    const logger = new CouchbaseLogger({ info });

    expect(() => logger.trace('t')).not.toThrow();
    expect(() => logger.error('e')).not.toThrow();
    logger.info('hello');
    expect(info).toHaveBeenCalledWith('hello');
  });

  it('is safe when no logger is provided', () => {
    const logger = new CouchbaseLogger();
    expect(() => logger.info('noop')).not.toThrow();
  });
});

describe('createConsoleLogger', () => {
  it('only enables levels at or above the configured threshold', () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const logger = createConsoleLogger(LogLevel.WARN);

    // DEBUG < WARN: discarded.
    logger.debug('skip me');
    expect(debug).not.toHaveBeenCalled();

    // WARN >= WARN: forwarded.
    logger.warn('keep me');
    expect(warn).toHaveBeenCalledWith('keep me');
  });

  it('prepends the prefix to forwarded messages', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const logger = createConsoleLogger(LogLevel.ERROR, '[cbjs]');
    logger.error('boom', { code: 1 });

    expect(error).toHaveBeenCalledWith('[cbjs] boom', { code: 1 });
  });
});
