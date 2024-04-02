import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/index'; // 假设的API调用

import './index.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 检查用户是否已经登录
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/dashboard'); // 假设的主界面路由
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ username, password });
      // 登录成功后的处理，例如跳转到主界面
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // 显示错误消息给用户
    }
  };

  return (
    <div className="login-page"> 
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="login-input" 
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="login-input" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="login-button">
        Login
      </button>
    </form>
  </div>
  );
};

export default LoginPage;
