import { seedBooks } from '../constants/books';
import type { ApiResult, Book } from '../types';

export function fetchBooks(shouldFail = false): Promise<ApiResult<Book[]>> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Không thể kết nối đến máy chủ thư viện. Vui lòng thử lại!',
        });
      } else {
        resolve({
          ok: true,
          data: seedBooks.map((book) => ({ ...book })),
        });
      }
    }, 500);
  });
}

