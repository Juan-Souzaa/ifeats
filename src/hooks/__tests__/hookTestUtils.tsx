import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

export function renderHook<T>(useHook: () => T) {
  const result = { current: undefined as unknown as T };
  let root: TestRenderer.ReactTestRenderer;

  function Harness() {
    result.current = useHook();
    return null;
  }

  act(() => {
    root = TestRenderer.create(<Harness />);
  });

  return {
    result,
    rerender: () => act(() => root.update(<Harness />)),
  };
}

export async function actAsync(fn: () => Promise<void>) {
  await act(async () => {
    await fn();
  });
}
