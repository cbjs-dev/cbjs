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
import {
  CppError,
  CppObservableRequests,
  CppObservableResponse,
  ObservableBindingFunc,
} from './binding.js';
import { errorFromCpp } from './bindingutilities.js';
import { Meter, ValueRecorder } from './metrics.js';
import { ObservableRequestHandler } from './observabilityhandler.js';
import { RequestSpan, RequestTracer } from './tracing.js';

/**
 * @internal
 */
export class NoOpSpan implements RequestSpan {
  /**
   * @internal
   */
  setAttribute(): void {
    // noop
  }

  /**
   * @internal
   */
  addEvent(): void {
    // noop
  }

  /**
   * @internal
   */
  setStatus(): void {
    // noop
  }

  /**
   * @internal
   */
  end(): void {
    // noop
  }

  /**
   * @internal
   */
  readonly name = '';
}

/**
 * @internal
 */
export class NoOpTracer implements RequestTracer {
  /**
   * @internal
   */
  requestSpan(): RequestSpan {
    return new NoOpSpan();
  }
}

/**
 * @internal
 */
export async function wrapObservableBindingCall<
  TReq extends CppObservableRequests,
  TResp extends CppObservableResponse,
>(
  fn: ObservableBindingFunc<TReq, TResp>,
  req: TReq,
  obsReqHandler: ObservableRequestHandler
): Promise<[Error | null, TResp]> {
  return await new Promise((resolve: (res: [Error | null, res: TResp]) => void) => {
    req.wrapper_span_name = obsReqHandler.wrapperSpanName;
    fn(req, (cppErr: CppError | null, res: TResp) => {
      let err = null;
      if (cppErr) {
        err = errorFromCpp(cppErr);
        obsReqHandler.processCoreSpan(cppErr.cpp_core_span);
      } else {
        obsReqHandler.processCoreSpan(res.cpp_core_span);
      }
      resolve([err, res]);
    });
  });
}

/**
 * @internal
 */
export class NoOpValueRecorder implements ValueRecorder {
  /**
   * @internal
   */
  recordValue(_value: number): void {
    // noop
  }
}

/**
 * @internal
 */
export class NoOpMeter implements Meter {
  /**
   * @internal
   */
  valueRecorder(_name: string, _tags: Record<string, string>): ValueRecorder {
    return new NoOpValueRecorder();
  }
}
