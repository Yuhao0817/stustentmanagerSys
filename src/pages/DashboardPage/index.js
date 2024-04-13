

import React from 'react';
import { useNavigate,Outlet} from 'react-router-dom';
import './index.css';
// 假设的头像图片路径
import userAvatar from '../../images/user-avatar.png'; // 替换为实际的头像图片路径

const DashboardPage = () => {
  const navigate = useNavigate();
  const handleNavigation = (page) => {
    navigate(page);
  };
  return (
    <div className="dashboard-container">
      {/* 顶部标题栏 */}
      <header className="dashboard-header">
        <h1>Student Management System</h1>
        <img src={userAvatar} alt="User Avatar" className="dashboard-avatar" />
      </header>

      {/* 两栏式内容区域 */}
      <div className="dashboard-content">
        {/* 左侧导航栏 */}
        <nav className="dashboard-nav">
          <ul>
          <li onClick={() => handleNavigation('/dashboard/students')}>Student management</li>
            <li onClick={() => handleNavigation('/dashboard/courses')}>Course management</li>
            <li onClick={() => handleNavigation('/dashboard/mentors')}>Mentor management</li>
            <li onClick={() => handleNavigation('/dashboard/email')}>Send email</li>
          </ul>
        </nav>

        {/* 右侧主内容区域 */}
        <main className="dashboard-main">
        <Outlet />
          {/* 这里可以添加更多的内容 */}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
