import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Typography } from 'antd';
import type { BookCardData } from '../types';
import { getBookCover } from '../utils/bookCovers';

const { Title, Text, Paragraph } = Typography;

export interface BookCardProps {
  book: BookCardData;
  borrowedCount?: number;
  isBorrowed?: boolean;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  CNTT: 'blue',
  'Kinh tế': 'gold',
  'Ngoại ngữ': 'green',
};

export const BookCard: React.FC<BookCardProps> = React.memo(
  ({ book, borrowedCount, isBorrowed, onBorrow, onReturn }) => {
    const isOutOfStock = book.availableCopies <= 0;
    const initialCover = getBookCover(book.id, book.coverUrl);
    const [imgSrc, setImgSrc] = useState(initialCover);

    useEffect(() => {
      setImgSrc(getBookCover(book.id, book.coverUrl));
    }, [book.id, book.coverUrl]);

    return (
      <Card
        hoverable
        className="book-card"
        data-testid={`book-card-${book.id}`}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
        cover={
          <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: '#f0f2f5' }}>
            <img
              src={imgSrc}
              alt={book.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => {
                if (book.coverUrl && imgSrc !== book.coverUrl) {
                  setImgSrc(book.coverUrl);
                }
              }}
            />
            <Tag
              color={CATEGORY_COLORS[book.category] || 'default'}
              className="cover-badge"
              style={{
                position: 'absolute',
                top: 10,
                right: 6,
                fontWeight: 600,
              }}
            >
              {book.category}
            </Tag>
          </div>
        }
      >
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>
          {book.category} · Năm XB: {book.publishYear}
        </Text>

        <Title level={4} style={{ margin: '0 0 6px 0', fontSize: '1.05rem', lineHeight: 1.35 }}>
          {book.title}
        </Title>

        <Paragraph type="secondary" style={{ marginBottom: 12, fontSize: '0.88rem' }}>
          Tác giả: {book.author}
        </Paragraph>

        <div style={{ marginBottom: 12, fontSize: '0.9rem' }}>
          Số bản còn lại:{' '}
          <strong style={{ color: isOutOfStock ? '#ff4d4f' : '#52c41a' }}>
            {book.availableCopies}
          </strong>
        </div>

        {borrowedCount && borrowedCount > 0 ? (
          <div style={{ marginBottom: 14 }}>
            <Tag color="geekblue" style={{ fontWeight: 600 }}>
              Đang mượn: {borrowedCount} cuốn
            </Tag>
          </div>
        ) : null}

        <div style={{ marginTop: 'auto' }}>
          {isBorrowed ? (
            <Button
              danger
              block
              onClick={() => onReturn(book.id)}
            >
              Trả sách
            </Button>
          ) : (
            <Button
              type="primary"
              block
              disabled={isOutOfStock}
              onClick={() => onBorrow(book.id)}
            >
              {isOutOfStock ? 'Hết sách' : 'Mượn sách'}
            </Button>
          )}
        </div>
      </Card>
    );
  }
);

BookCard.displayName = 'BookCard';
