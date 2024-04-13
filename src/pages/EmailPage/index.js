import React, { useState } from 'react';
import axios from 'axios';

const EmailPage = () => {
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [receiver, setReceiver] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiver); if (!isValidEmail) {
      setError('Please enter a valid email address');
      return;
    }
    // 开始加载，设置 isLoading 为 true
    setIsLoading(true);
    try {
      // 构建查询字符串    
      const queryParams = new URLSearchParams();
      queryParams.append('subject', subject);
      queryParams.append('htmlContent', htmlContent);
      queryParams.append('receiver', receiver);
      // 将查询字符串附加到URL后面    
      const url = 'http://118.31.112.47:30001/api/email?' + queryParams.toString();
      const response = await axios.post(url);
      console.log(response);
      setError('The email was sent successfully');
      // 清空原先的内容    
      setSubject('');
      setHtmlContent('');
      setReceiver('');
      // 设置 isLoading 为 false
      setIsLoading(false);

      // 3秒后隐藏成功消息
      setTimeout(() => {
        setError('');
      }, 3000);

    } catch (err) {
      console.error(err);
      setError('The message failed to be sent');
      // 设置 isLoading 为 false
      setIsLoading(false);

      // 3秒后隐藏失败消息
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };
  return (
    <div id="email-page" style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '30px auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#fff'
    }}>
      <h1 style={{ 
        color: '#333',
        textAlign: 'center',
        marginBottom: '15px'
      }}>Email sending page</h1>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>The subject of the message:</label>
          <input 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              fontSize: '16px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>The content of the message:</label>
          <textarea 
            value={htmlContent} 
            onChange={(e) => setHtmlContent(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              height: '120px', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              fontSize: '16px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Recipient's email address:</label>
          <input 
            type="email" 
            value={receiver} 
            onChange={(e) => setReceiver(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              fontSize: '16px'
            }}
          />
          {isLoading && <div style={{ textAlign: 'center', marginTop: '10px' }}>Loading...</div>}
          {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
        </div>
        <button type="submit" style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#5cb85c', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer', 
          fontSize: '18px',
          marginTop: '15px'
        }}>{isLoading ? 'Sending...' : 'Send an email'}</button>
      </form>
    </div>
  );
};
export default EmailPage;
