export type OptimizationFlag = keyof ReturnType<typeof getFlagsMap>;

export function getFlagsMap() {
  return {
    IsFunction: 1 << 0,
    NeverOptimize: 1 << 1,
    AlwaysOptimize: 1 << 2,
    MaybeDeopted: 1 << 3,
    Optimized: 1 << 4,
    TurboFanned: 1 << 5,
    Interpreted: 1 << 6,
    MarkedForOptimization: 1 << 7,
    MarkedForConcurrentOptimization: 1 << 8,
    OptimizingConcurrently: 1 << 9,
    IsExecuting: 1 << 10,
    TopmostFrameIsTurboFanned: 1 << 11,
    LiteMode: 1 << 12,
    MarkedForDeoptimization: 1 << 13,
  } as const;
}

export function getOptimizationFlags(
  fn: (...args: never[]) => unknown
): OptimizationFlag[] {
  const getOptimizationStatus = new Function('fn', 'return %GetOptimizationStatus(fn);');
  const status = getOptimizationStatus(fn);
  return Object.entries(getFlagsMap())
    .filter(([, value]) => status & value)
    .map(([key]) => key) as OptimizationFlag[];
}

export function isOptimized(fn: (...args: never[]) => unknown): boolean {
  const flags = getOptimizationFlags(fn);
  return flags.includes('IsFunction') && flags.includes('Optimized');
}
