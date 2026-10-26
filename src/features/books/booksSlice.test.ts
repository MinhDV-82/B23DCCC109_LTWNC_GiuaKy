import { describe, it, expect } from '@jest/globals';
import booksReducer, {
  borrowBook,
  returnBook,
  setWarning,
  clearWarning,
  loadBooks,
  type BooksState,
} from './booksSlice';
import type { Book } from './types';

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
    availableCopies: 0,
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

describe('booksSlice reducer', () => {
  const baseState: BooksState = {
    items: sampleBooks,
    borrowedIds: [],
    loading: false,
    error: null,
    warning: null,
  };

  it('thêm sách vào danh sách đang mượn và giảm số bản còn lại', () => {
    const nextState = booksReducer(baseState, borrowBook('b1'));
    const book = nextState.items.find((b) => b.id === 'b1');

    expect(book?.availableCopies).toBe(2);
    expect(nextState.borrowedIds).toContain('b1');
  });

  it('trả sách và tăng số bản còn lại', () => {
    const stateWithBorrow: BooksState = {
      ...baseState,
      items: [{ ...sampleBooks[0], availableCopies: 2 }],
      borrowedIds: ['b1'],
    };

    const nextState = booksReducer(stateWithBorrow, returnBook('b1'));
    const book = nextState.items.find((b) => b.id === 'b1');

    expect(book?.availableCopies).toBe(3);
    expect(nextState.borrowedIds).not.toContain('b1');
  });

  it('không thể mượn sách đã hết bản', () => {
    const nextState = booksReducer(baseState, borrowBook('b2'));
    const book = nextState.items.find((b) => b.id === 'b2');

    expect(book?.availableCopies).toBe(0);
    expect(nextState.borrowedIds).not.toContain('b2');
  });

  it('chặn mượn khi đã đủ 3 cuốn và thông báo cảnh báo', () => {
    const stateAtLimit: BooksState = {
      ...baseState,
      borrowedIds: ['b1', 'b3', 'b4'],
    };

    const nextState = booksReducer(stateAtLimit, borrowBook('b2'));
    expect(nextState.borrowedIds).toHaveLength(3);
    expect(nextState.warning).toContain('tối đa 3 cuốn');
  });

  it('xử lý trạng thái tải dữ liệu khi pending và fulfilled', () => {
    const pendingState = booksReducer(baseState, { type: loadBooks.pending.type });
    expect(pendingState.loading).toBe(true);
    expect(pendingState.error).toBeNull();

    const fulfilledState = booksReducer(baseState, {
      type: loadBooks.fulfilled.type,
      payload: sampleBooks,
    });
    expect(fulfilledState.loading).toBe(false);
    expect(fulfilledState.items).toEqual(sampleBooks);
  });

  it('xử lý trạng thái lỗi khi loadBooks.rejected', () => {
    const errorState = booksReducer(baseState, {
      type: loadBooks.rejected.type,
      payload: 'Lỗi kết nối máy chủ',
    });
    expect(errorState.loading).toBe(false);
    expect(errorState.error).toBe('Lỗi kết nối máy chủ');
  });

  it('cập nhật và xoá thông báo cảnh báo qua setWarning và clearWarning', () => {
    const warned = booksReducer(baseState, setWarning('Cảnh báo mượn tối đa'));
    expect(warned.warning).toBe('Cảnh báo mượn tối đa');

    const cleared = booksReducer(warned, clearWarning());
    expect(cleared.warning).toBeNull();
  });
});
