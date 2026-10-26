import { Link } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Button, Typography, Space, Tag, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadBooks } from '../books/booksSlice';
import type { Category, CategoryStatsMap } from '../books/types';

const { Title, Paragraph, Text } = Typography;
const CATEGORIES: Category[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

const CATEGORY_COLORS: Record<Category, string> = {
  CNTT: '#1677ff',
  'Kinh tế': '#faad14',
  'Ngoại ngữ': '#52c41a',
};

export default function StatsPage() {
  const dispatch = useAppDispatch();
  const { items, borrowedIds, loading } = useAppSelector((state) => state.books);

  useEffect(() => {
    if (!items.length && !loading) {
      dispatch(loadBooks());
    }
  }, [dispatch, items.length, loading]);

  const categoryStats: CategoryStatsMap = useMemo(() => {
    const stats: CategoryStatsMap = {
      CNTT: 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };
    items.forEach((book) => {
      if (stats[book.category] !== undefined) {
        stats[book.category] += 1;
      }
    });
    return stats;
  }, [items]);

  const totalCopies = useMemo(() => {
    return items.reduce((sum, book) => sum + book.availableCopies, 0);
  }, [items]);

  const borrowedBooks = useMemo(() => {
    return items.filter((book) => borrowedIds.includes(book.id));
  }, [items, borrowedIds]);

  if (loading && !items.length) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <Spin size="large" tip="Đang tải dữ liệu thống kê..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, fontSize: 12 }}>
            DỮ LIỆU THƯ VIỆN
          </Text>
          <Title level={2} style={{ margin: '8px 0 6px 0' }}>
            Thống kê Thư viện
          </Title>
          <Paragraph type="secondary" style={{ fontSize: 15 }}>
            Tổng hợp số lượng đầu sách chuyên ngành và tình trạng mượn sách của sinh viên.
          </Paragraph>
        </div>

        <Row gutter={[20, 20]}>
          <Col xs={24} sm={8}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 12 }}>
              <Statistic
                title="Tổng số đầu sách"
                value={items.length}
                valueStyle={{ color: '#1677ff', fontWeight: 800, fontSize: 38 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 12 }}>
              <Statistic
                title="Sách bạn đang mượn"
                value={`${borrowedIds.length}/3`}
                valueStyle={{ color: '#0284c7', fontWeight: 800, fontSize: 38 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 12 }}>
              <Statistic
                title="Tổng bản sách khả dụng"
                value={totalCopies}
                valueStyle={{ color: '#52c41a', fontWeight: 800, fontSize: 38 }}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Số đầu sách theo từng thể loại" style={{ borderRadius: 12 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {CATEGORIES.map((cat) => {
              const count = categoryStats[cat];
              const percent = items.length ? Math.round((count / items.length) * 100) : 0;
              return (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text strong>{cat}</Text>
                    <Text type="secondary">
                      {count} đầu sách ({percent}%)
                    </Text>
                  </div>
                  <Progress
                    percent={percent}
                    strokeColor={CATEGORY_COLORS[cat]}
                    showInfo={false}
                  />
                </div>
              );
            })}
          </Space>
        </Card>

        {borrowedBooks.length > 0 && (
          <Card title={`Sách bạn đang mượn (${borrowedBooks.length})`} style={{ borderRadius: 12 }}>
            <List
              itemLayout="horizontal"
              dataSource={borrowedBooks}
              renderItem={(book) => (
                <List.Item key={book.id}>
                  <List.Item.Meta
                    title={book.title}
                    description={`Tác giả: ${book.author} · Năm XB: ${book.publishYear}`}
                  />
                  <Tag color={CATEGORY_COLORS[book.category]}>{book.category}</Tag>
                </List.Item>
              )}
            />
          </Card>
        )}

        <div>
          <Link to="/">
            <Button type="link" style={{ paddingLeft: 0, fontSize: 15 }}>
              ← Quay lại trang tra cứu
            </Button>
          </Link>
        </div>
      </Space>
    </div>
  );
}
