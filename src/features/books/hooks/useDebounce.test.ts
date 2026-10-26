import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('cập nhật giá trị sau 300ms và huỷ timer cũ khi người dùng gõ liên tục', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      {
        initialProps: { value: 'clean', delay: 300 },
      }
    );

    expect(result.current).toBe('clean');

    rerender({ value: 'clean code', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('clean');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('clean code');
  });
});

