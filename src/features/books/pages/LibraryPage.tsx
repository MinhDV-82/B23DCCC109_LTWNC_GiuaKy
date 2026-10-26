import { useEffect, useMemo, useCallback } from 'react';
import {
  Input,
  Row,
  Col,
  Alert,
  Spin,
  Empty,
  Button,
  Typography,
  Radio,
  message,
} from 'antd';
import { useDebounce } from '../hooks/useDebounce';
import { useFilterStore } from '../../filters/filterStore';
import {
  borrowBook,
  loadBooks,
  returnBook,
  clearWarning,
} from '../booksSlice';
import { BookCard } from '../components/BookCard';
import { BOOK_CATEGORIES } from '../constants/books';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

const { Title, Paragraph, Text } = Typography;

export function LibraryPage() {
  const dispatch = useAppDispatch();
  const { items, borrowedIds, loading, error, warning } = useAppSelector((state) => state.books);
  const { query, category, setQuery, setCategory } = useFilterStore();
  const debouncedQuery = useDebounce(query, 300);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!items.length && !loading) {
      const searchParams = new URLSearchParams(window.location.search);
      const shouldFail = searchParams.get('fail') === 'true' || searchParams.get('error') === 'true';
      dispatch(loadBooks(shouldFail));
    }
  }, [dispatch, items.length, loading]);

  useEffect(() => {
    if (warning) {
      dispatch(clearWarning());
    }
  }, [warning, dispatch]);

  const handleBorrow = useCallback(
    (id: string) => {
      if (borrowedIds.length >= 3) {
        messageApi.destroy();
        messageApi.warning('Mỗi sinh viên chỉ được mượn tối đa 3 cuốn sách cùng lúc! Vui lòng trả bớt sách trước khi mượn tiếp.');
        dispatch(borrowBook(id));
        return;
      }
      dispatch(borrowBook(id));
    },
    [borrowedIds.length, dispatch, messageApi]
  );

  const handleReturn = useCallback(
    (id: string) => {
      dispatch(returnBook(id));
    },
    [dispatch]
  );

  const handleRetry = useCallback(() => {
    dispatch(loadBooks(false));
  }, [dispatch]);

  const handleSimulateApiError = useCallback(() => {
    dispatch(loadBooks(true));
  }, [dispatch]);

  const visible = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return items.filter(
      (book) =>
        (!q ||
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q)) &&
        (category === 'Tất cả' || book.category === category)
    );
  }, [items, debouncedQuery, category]);

  const borrowedBooks = useMemo(() => {
    return items.filter((book) => borrowedIds.includes(book.id));
  }, [items, borrowedIds]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      {contextHolder}

      <div
        style={{
          background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.08) 0%, rgba(22, 119, 255, 0.02) 100%)',
          borderRadius: 16,
          padding: '36px 32px',
          marginBottom: 32,
          border: '1px solid rgba(22, 119, 255, 0.15)',
        }}
      >
        <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, fontSize: 12 }}>
          THƯ VIỆN KHOA CNTT
        </Text>
        <Title level={1} style={{ margin: '8px 0 6px 0', fontSize: '2.2rem' }}>
          Tra cứu và Mượn trả sách
        </Title>
        <Paragraph type="secondary" style={{ margin: 0, fontSize: 15, maxWidth: 600 }}>
          Hệ thống quản lý sách chuyên ngành thông minh, hỗ trợ sinh viên tra cứu tài liệu, theo dõi tình trạng sách và quản lý số lượng mượn tiện lợi.
        </Paragraph>
      </div>

      {borrowedBooks.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <Title level={3} style={{ marginBottom: 16 }}>
            Sách bạn đang mượn ({borrowedIds.length}/3)
          </Title>
          <Row gutter={[20, 20]}>
            {borrowedBooks.map((book) => {
              const count = borrowedIds.filter((bId) => bId === book.id).length;
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={`borrowed-${book.id}`}>
                  <BookCard
                    book={book}
                    borrowedCount={count}
                    isBorrowed={true}
                    onBorrow={handleBorrow}
                    onReturn={handleReturn}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      <div
        style={{
          background: 'var(--bg-surface, #ffffff)',
          padding: '16px 20px',
          borderRadius: 12,
          border: '1px solid #e8e8e8',
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        }}
      >
        <Input.Search
          allowClear
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên sách hoặc tác giả…"
          style={{ maxWidth: 380, width: '100%' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Radio.Group
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            buttonStyle="solid"
          >
            {BOOK_CATEGORIES.map((cat) => (
              <Radio.Button key={cat} value={cat}>
                {cat}
              </Radio.Button>
            ))}
          </Radio.Group>

          <Button
            size="middle"
            onClick={handleSimulateApiError}
            title="Giả lập API thất bại để kiểm tra AC-03"
          >
            Giả lập lỗi API
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={handleRetry}>
              Thử lại
            </Button>
          }
          style={{ marginBottom: 24, borderRadius: 8 }}
        />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16, color: '#8c8c8c', fontSize: 16 }}>Đang tải...</p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              Danh mục sách ({visible.length} cuốn)
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            {visible.map((book) => {
              const count = borrowedIds.filter((bId) => bId === book.id).length;
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                  <BookCard
                    book={book}
                    borrowedCount={count}
                    isBorrowed={false}
                    onBorrow={handleBorrow}
                    onReturn={handleReturn}
                  />
                </Col>
              );
            })}
          </Row>

          {!visible.length && !error && (
            <Empty
              description="Không tìm thấy sách nào phù hợp với điều kiện tìm kiếm."
              style={{ padding: '48px 0' }}
            />
          )}
        </div>
      )}
    </div>
  );
}
