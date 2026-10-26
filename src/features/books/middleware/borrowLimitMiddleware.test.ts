import { describe, it, expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import booksReducer, {
  borrowBook,
  type BooksState,
} from '../booksSlice';
import {
  borrowLimitMiddleware,
  BORROW_LIMIT_EXCEEDED_MESSAGE,
} from './borrowLimitMiddleware';
import type { Book } from '../types';

const sampleBooks: Book[] = [
  {
    id: 'b1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'CNTT',
    publishYear: 2008,
    availableCopies: 3,
    totalCopies: 5,
  },
  {
    id: 'b2',
    title: 'Kinh Tế Học Vi Mô',
    author: 'N. Gregory Mankiw',
    category: 'Kinh tế',
    publishYear: 2014,
    availableCopies: 2,
    totalCopies: 2,
  },
  {
    id: 'b3',
    title: 'Algorithms',
    author: 'CLRS',
    category: 'CNTT',
    publishYear: 2009,
    availableCopies: 2,
    totalCopies: 2,
  },
  {
    id: 'b4',
    title: 'Blue Ocean Strategy',
    author: 'W. Chan Kim',
    category: 'Kinh tế',
    publishYear: 2005,
    availableCopies: 2,
    totalCopies: 2,
  },
];

function createTestStore(preloadedBooksState?: Partial<BooksState>) {
  const initialBooksState: BooksState = {
    items: sampleBooks,
    borrowedIds: [],
    loading: false,
    error: null,
    warning: null,
    ...preloadedBooksState,
  };

  return configureStore({
    reducer: { books: booksReducer },
    preloadedState: { books: initialBooksState },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(borrowLimitMiddleware),
  });
}

describe('Redux borrowLimitMiddleware (AC-23)', () => {
  it('cho phép mượn sách thành công khi số lượng mượn chưa vượt quá 3 cuốn', () => {
    const store = createTestStore({ borrowedIds: ['b1'] });

    store.dispatch(borrowBook('b2'));

    const state = store.getState().books;
    expect(state.borrowedIds).toEqual(['b1', 'b2']);
    expect(state.warning).toBeNull();
    const book2 = state.items.find((b) => b.id === 'b2');
    expect(book2?.availableCopies).toBe(1);
  });

  it('chặn thao tác mượn sách tại middleware khi sinh viên đã mượn đủ 3 cuốn', () => {
    const store = createTestStore({
      borrowedIds: ['b1', 'b2', 'b3'],
    });

    store.dispatch(borrowBook('b4'));

    const state = store.getState().books;
    expect(state.borrowedIds).toHaveLength(3);
    expect(state.borrowedIds).not.toContain('b4');

    const book4 = state.items.find((b) => b.id === 'b4');
    expect(book4?.availableCopies).toBe(2);

    expect(state.warning).toBe(BORROW_LIMIT_EXCEEDED_MESSAGE);
  });
});
