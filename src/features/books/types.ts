export type Category = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  publishYear: number;
  availableCopies: number;
  totalCopies: number;
  coverUrl?: string;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export function isApiSuccess<T>(result: ApiResult<T>): result is ApiSuccess<T> {
  return result.ok;
}

export type CategoryStatsMap = Record<Category, number>;

export type BookCardData = Pick<
  Book,
  'id' | 'title' | 'author' | 'category' | 'publishYear' | 'availableCopies' | 'coverUrl'
>;

export type ReadonlyBook = Readonly<Book>;

