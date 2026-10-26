import { create } from 'zustand';
import type { Category } from '../books/types';

interface FilterState {
  query: string;
  category: Category | 'Tất cả';
  setQuery: (query: string) => void;
  setCategory: (category: Category | 'Tất cả') => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  query: '',
  category: 'Tất cả',
  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
}));

