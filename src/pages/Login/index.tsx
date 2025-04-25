import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

interface LoginForm {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 模拟登录验证
      if (values.username === 'admin' && values.password === 'admin') {
        // 保存用户信息和登录状态
        localStorage.setItem('user', JSON.stringify({
          username: values.username,
          role: 'admin'
        }));
        localStorage.setItem('isLoggedIn', 'true');
        message.success('登录成功');
        navigate('/request-list');
      } else if (values.username === 'user' && values.password === 'user') {
        localStorage.setItem('user', JSON.stringify({
          username: values.username,
          role: 'user'
        }));
        localStorage.setItem('isLoggedIn', 'true');
        message.success('登录成功');
        navigate('/request-list');
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 检查是否已登录
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/request-list');
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <Card title="用车申请系统" className="login-card">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 