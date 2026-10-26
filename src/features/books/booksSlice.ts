import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchBooks } from './api/booksApi';
import { isApiSuccess, type Book } from './types';

export interface BooksState {
  items: Book[];
  borrowedIds: string[];
  loading: boolean;
  error: string | null;
  warning: string | null;
}

const initialState: BooksState = {
  items: [],
  borrowedIds: [],
  loading: false,
  error: null,
  warning: null,
};

export const loadBooks = createAsyncThunk<Book[], boolean | undefined, { rejectValue: string }>(
  'books/load',
  async (shouldFail = false, { rejectWithValue }) => {
    const result = await fetchBooks(shouldFail);
    if (isApiSuccess(result)) {
      return result.data;
    }
    return rejectWithValue(result.error);
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook(state, action: PayloadAction<string>) {
      const bookId = action.payload;
      if (state.borrowedIds.length >= 3) {
        state.warning = 'Mỗi sinh viên chỉ được mượn tối đa 3 cuốn sách cùng lúc! Vui lòng trả bớt sách trước khi mượn tiếp.';
        return;
      }
      const book = state.items.find((item) => item.id === bookId);
      if (book && book.availableCopies > 0) {
        book.availableCopies -= 1;
        state.borrowedIds.push(bookId);
        state.warning = null;
      }
    },
    returnBook(state, action: PayloadAction<string>) {
      const bookId = action.payload;
      const index = state.borrowedIds.indexOf(bookId);
      if (index === -1) {
        return;
      }
      const book = state.items.find((item) => item.id === bookId);
      if (book) {
        book.availableCopies += 1;
        state.borrowedIds.splice(index, 1);
        state.warning = null;
      }
    },
    setWarning(state, action: PayloadAction<string>) {
      state.warning = action.payload;
    },
    clearWarning(state) {
      state.warning = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(loadBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? 'Không thể tải danh sách sách.');
      });
  },
});

export const { borrowBook, returnBook, setWarning, clearWarning } = booksSlice.actions;
export default booksSlice.reducer;
