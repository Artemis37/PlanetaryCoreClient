'use client';

import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined, GlobalOutlined, SettingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/userSlice';
import authService from '../services/AuthService';

const { Header } = Layout;

const CustomHeader = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  const router = useRouter();
  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    router.push('/');
  };

  // Check if user is SuperAdmin
  const isSuperAdmin = user?.userType === 'SuperAdmin';

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
      key: 'planets',
      label: 'Planets',
      icon: <GlobalOutlined />,
      onClick: () => router.push('/planets'),
    },
    // Only show Criteria menu item for SuperAdmins
    ...(isSuperAdmin ? [{
      key: 'criteria',
      label: 'Criteria',
      icon: <SettingOutlined />,
      onClick: () => router.push('/criteria'),
    }] : []),
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
    <Header style={{ 
      position: 'fixed', 
      zIndex: 1, 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 50px'
    }}>      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ 
          color: 'white', 
          fontSize: '18px', 
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'color 0.3s ease'
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
              <span>{user?.username}</span>
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
    </Header>
  );
};

export default CustomHeader;
