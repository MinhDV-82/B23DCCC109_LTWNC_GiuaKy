import '@testing-library/jest-dom/jest-globals';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { ThemeProvider } from '../features/theme/ThemeContext';
import { store } from './store';

describe('Mini Library App E2E Flow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('tải danh sách sách sau 500ms và tìm kiếm có debounce 300ms', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText(/Đang tải danh sách sách…/i)).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    expect(await screen.findByText('Clean Code: A Handbook of Agile Software Craftsmanship')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/Tìm theo tên sách hoặc tác giả…/i), 'mankiw');

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText('Kinh Tế Học Vi Mô')).toBeInTheDocument();
    expect(screen.queryByText('Clean Code: A Handbook of Agile Software Craftsmanship')).not.toBeInTheDocument();
  });
});
