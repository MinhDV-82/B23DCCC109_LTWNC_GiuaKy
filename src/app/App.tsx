import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  ConfigProvider,
  theme as antdTheme,
  Layout,
  Spin,
} from 'antd';
import { useTheme } from '../features/theme/ThemeContext';
import { LibraryPage } from '../features/books';
import { Header } from '../components/Header';
import './App.css';

const { Content } = Layout;

const StatsPage = lazy(() => import('../features/stats/StatsPage'));

export default function App() {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: 'var(--bg-page, #f8fafc)' }}>
        <Header />
        <Content>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route
              path="/stats"
              element={
                <Suspense
                  fallback={
                    <div style={{ textAlign: 'center', padding: '100px 0' }}>
                      <Spin size="large" />
                    </div>
                  }
                >
                  <StatsPage />
                </Suspense>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
