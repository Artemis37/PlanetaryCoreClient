'use client';

import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../../store/userSlice';
import authService from '../../services/AuthService';
import { LoginRequest } from '../../models/auth';

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
  const router = useRouter();

  const onFinish = async (values: LoginRequest) => {
    dispatch(loginStart());
    try {
      const response = await authService.login(values);
      
      dispatch(loginSuccess({
        user: {
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          userType: response.userType,
          expiresAt: response.expiresAt,
        },
        token: response.token,
      }));
      
      message.success(`Welcome back, ${response.firstName}!`);
      router.push('/');
    } catch (error: any) {
      dispatch(loginFailure());
      message.error(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            Welcome Back
          </Title>
          <Text type="secondary">
            Sign in to ExoPlanet Life Predictor
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters!' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#aaa' }} />}
              placeholder="Enter your username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 5, message: 'Password must be at least 5 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#aaa' }} />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              style={{
                width: '100%',
                height: '48px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical" size="small">
            <Button type="link" onClick={() => router.push('/')}>
              ← Back to Home
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Login;
