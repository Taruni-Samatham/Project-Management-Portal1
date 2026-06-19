import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography, Avatar } from 'antd';
import { 
  FolderOutlined, 
  LogoutOutlined, 
  PlusOutlined, 
  DashboardOutlined,
  UserOutlined 
} from '@ant-design/icons';
import authService from '../services/authService';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return null;

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/create-task',
      icon: <PlusOutlined />,
      label: <Link to="/create-task">New Task</Link>,
    },
  ];

  return (
    <Header className="custom-header">
      <div className="header-logo">
        <FolderOutlined className="logo-icon" />
        <span className="logo-text">TaskSphere</span>
      </div>
      <Menu 
        theme="dark" 
        mode="horizontal" 
        selectedKeys={[location.pathname]} 
        items={menuItems}
        className="header-menu"
      />
      <div className="header-user">
        <Space size="middle">
          <Avatar 
            icon={<UserOutlined />} 
            className="user-avatar"
          />
          <Text className="user-name">{user.name}</Text>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </Button>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;
