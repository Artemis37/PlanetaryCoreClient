'use client';

import { useState, useEffect } from 'react';
import { Layout, Button, Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import authService from '../services/AuthService';

const { Header: AntHeader } = Layout;

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUser(authService.getUser());
      }
    };

    checkAuth();
    // Check auth status on storage change (for cross-tab sync)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div>
          <div style={{ fontWeight: 'bold' }}>{user?.firstName} {user?.lastName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{user?.email}</div>
        </div>
      ),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader style={{ 
      position: 'fixed', 
      zIndex: 1, 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 50px',
      backgroundColor: '#001529'
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ 
          color: 'white', 
          fontSize: '18px', 
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          ExoPlanet Life Predictor
        </div>
      </Link>
      
      <div>
        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer', color: 'white' }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <span>{user?.firstName || 'User'}</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        ) : (
          <Link href="/login">
            <Button 
              type="primary" 
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;