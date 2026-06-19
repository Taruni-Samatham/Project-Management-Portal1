import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskFormPage from './pages/TaskFormPage';
import authService from './services/authService';

const { Content, Footer } = Layout;

// Protected Route Guard Component
const ProtectedRoute = ({ children }) => {
  const isAuth = authService.isAuthenticated();
  return isAuth ? children : <Navigate to="/login" replace />;
};

// Global Theme Configuration for Ant Design
const themeConfig = {
  token: {
    colorPrimary: '#4f46e5', // Elegant Indigo
    colorSuccess: '#10b981', // Clean Emerald
    colorWarning: '#f59e0b', // Amber
    colorError: '#ef4444', // Rose
    borderRadius: 8,
    fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      bodyBg: '#f8fafc', // Modern off-white background
      headerBg: '#0f172a', // Slate 900 for dark premium header
      headerHeight: 64,
    },
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: '#312e81',
      darkItemColor: '#94a3b8',
      darkItemSelectedColor: '#ffffff',
    },
    Card: {
      boxShadowTertiary: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
    Table: {
      headerBg: '#f1f5f9',
      headerColor: '#475569',
    }
  }
};

const App = () => {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Navbar />
          <Content style={{ padding: '0px', width: '100%' }}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-task"
                element={
                  <ProtectedRoute>
                    <TaskFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-task/:id"
                element={
                  <ProtectedRoute>
                    <TaskFormPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback routing */}
              <Route
                path="*"
                element={
                  authService.isAuthenticated() ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </Content>
          {authService.isAuthenticated() && (
            <Footer style={{ textAlign: 'center', background: '#f8fafc', color: '#64748b' }}>
              TaskSphere ©2026 Created with Ant Design & Node.js
            </Footer>
          )}
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
