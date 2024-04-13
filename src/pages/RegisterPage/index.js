import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './index.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegisterAndLogin = async (e) => {
    e.preventDefault();
    try {
      const user = {
        username,
        password,
      };
      const response = await axios.get('http://118.31.112.47:30001/api/token/generate', {
        params: user,
      });
      console.log('Register response:', response);
      const { accessToken, refreshToken } = response.data;
      // 保存token到localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/login'); // 注册成功后跳转到登录页面
    } catch (error) {
      console.error('Registration failed:', error);
      // 显示错误消息给用户
    }
  };

  return (
    <div className="register-page">
      <h1>Registration page</h1>
      <form onSubmit={handleRegisterAndLogin}>
        <input
          type="text"
          className="register-page__input"
          placeholder="Please enter the account number:"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="register-page__input"
          placeholder="Please enter your password:"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="register-page__button">register</button>
      </form>
      <button onClick={() => navigate('/login')} className="register-page__login-link">Already have an account? Log in!</button>
    </div>
  );
};

export default RegisterPage;
