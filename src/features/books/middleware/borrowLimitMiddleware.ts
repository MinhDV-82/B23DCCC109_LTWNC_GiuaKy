import type { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setWarning, type BooksState } from '../booksSlice';

export const BORROW_LIMIT_EXCEEDED_MESSAGE =
  'Mỗi sinh viên chỉ được mượn tối đa 3 cuốn sách cùng lúc! Vui lòng trả bớt sách trước khi mượn tiếp.';

interface StateWithBooks {
  books: BooksState;
}

/**
 * Custom Redux middleware enforcing the maximum of 3 active loans (AC-23).
 * If the student has already borrowed 3 books, attempting to borrow another one
 * is intercepted and blocked before reaching the reducers.
 */
export const borrowLimitMiddleware: Middleware<{}, StateWithBooks> = (storeApi) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const state = storeApi.getState();
    if (state.books.borrowedIds.length >= 3) {
      storeApi.dispatch(setWarning(BORROW_LIMIT_EXCEEDED_MESSAGE));
      // Intercept and block the action from reaching reducers
      return;
    }
  }
  return next(action);
};
