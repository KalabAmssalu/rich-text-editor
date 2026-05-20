import { useMemo, useRef } from "react";

function debounceFn<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number,
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let maxTimeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      if (maxTimeoutId !== undefined) {
        clearTimeout(maxTimeoutId);
        maxTimeoutId = undefined;
      }
      if (lastArgs) {
        fn(...lastArgs);
      }
    }, ms);

    if (maxWait !== undefined && maxTimeoutId === undefined) {
      maxTimeoutId = setTimeout(() => {
        maxTimeoutId = undefined;
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
          timeoutId = undefined;
        }
        if (lastArgs) {
          fn(...lastArgs);
        }
      }, maxWait);
    }
  }) as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId);
      maxTimeoutId = undefined;
    }
  };

  return debounced;
}

export function useDebounce<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
  maxWait?: number,
) {
  const funcRef = useRef<T | null>(null);
  funcRef.current = fn;

  return useMemo(
    () =>
      debounceFn(
        (...args: Parameters<T>) => {
          if (funcRef.current) {
            funcRef.current(...args);
          }
        },
        ms,
        maxWait,
      ),
    [ms, maxWait],
  );
}
