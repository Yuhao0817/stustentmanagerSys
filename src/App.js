import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DashboardDefaultPage from '../src/pages/DashboardPage/defalutPage';
import StudentsPage from './pages/StudentsPage';
import CoursesPage from './pages/CoursesPage';
import MentorsPage from './pages/MentorsPage';
import EmailPage from './pages/EmailPage';
import PrivateRoute from './components/PrivateRoute';


const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<DashboardDefaultPage />} />
          <Route path="students" element={<PrivateRoute element={StudentsPage}/>} />
          <Route path="courses" element={<PrivateRoute element={CoursesPage}/>} />
          <Route path="mentors" element={<PrivateRoute element={MentorsPage}/>} />
          <Route path="email" element={<PrivateRoute element={EmailPage}/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
