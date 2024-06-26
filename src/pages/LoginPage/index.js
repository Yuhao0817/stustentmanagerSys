import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './index.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        navigate('/dashboard'); 
      }
    };

    checkToken();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = {
        username,
        password,
      };
      const response = await axios.get('http://118.31.112.47:30001/api/token/generate', {
        params: user,
      });
      console.log('Login response:', response);
      const { accessToken, refreshToken } = response.data;
      // 更新token
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/dashboard'); // 登录成功后跳转到主界面
    } catch (error) {
      console.error('Login failed:', error);
      // 显示错误消息给用户
    }
  };

  return (
    <div className="login-page">
      <h1>Logining Page</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="login-button">Login</button>
        <button onClick={() => navigate('/register')} className="register-button">Don't have an account? Sign up!</button>
      </form>
    </div>
  );
};

export default LoginPage;
