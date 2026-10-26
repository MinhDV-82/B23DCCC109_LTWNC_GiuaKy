import '@testing-library/jest-dom/jest-globals';
import { describe, it, expect, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from './BookCard';
import type { BookCardData } from '../types';

const mockBook: BookCardData = {
  id: 'b1',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  category: 'CNTT',
  publishYear: 2008,
  availableCopies: 3,
};

const mockOutOfStockBook: BookCardData = {
  id: 'b2',
  title: 'Algorithms',
  author: 'CLRS',
  category: 'CNTT',
  publishYear: 2009,
  availableCopies: 0,
};

describe('BookCard component', () => {
  it('hiển thị đúng thông tin sách: tên sách, tác giả, thể loại, năm XB và số bản còn lại', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={mockBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText(/Robert C. Martin/)).toBeInTheDocument();
    expect(screen.getByText('CNTT', { selector: '.cover-badge' })).toBeInTheDocument();
    expect(screen.getByText(/2008/)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('nhấn nút Mượn sách gọi đúng hàm với id của sách', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={mockBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowBtn = screen.getByRole('button', { name: /mượn sách/i });
    await user.click(borrowBtn);

    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('b1');
  });

  it('nút Mượn bị vô hiệu hoá khi số bản còn lại bằng 0', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={mockOutOfStockBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowBtn = screen.getByRole('button', { name: /hết sách/i });
    expect(borrowBtn).toBeDisabled();
  });
});

