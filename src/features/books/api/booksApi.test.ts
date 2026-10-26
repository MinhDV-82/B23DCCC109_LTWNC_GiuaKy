import { fetchBooks } from './booksApi';
import { isApiSuccess } from '../types';

describe('mock books API', () => {
  it('resolves successfully after the 500ms mock delay', async () => {
    jest.useFakeTimers();
    const result = fetchBooks();
    jest.advanceTimersByTime(500);
    const response = await result;
    expect(isApiSuccess(response)).toBe(true);
    if (isApiSuccess(response)) {
      expect(response.data.length).toBeGreaterThanOrEqual(12);
    }
    jest.useRealTimers();
  });

  it('resolves with error when shouldFail is true', async () => {
    jest.useFakeTimers();
    const result = fetchBooks(true);
    jest.advanceTimersByTime(500);
    const response = await result;
    expect(isApiSuccess(response)).toBe(false);
    if (!isApiSuccess(response)) {
      expect(response.error).toContain('Không thể kết nối');
    }
    jest.useRealTimers();
  });
});

