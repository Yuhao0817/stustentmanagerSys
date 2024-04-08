import React, { useState, useEffect } from 'react';
import axios from 'axios';


function MentorPage() {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentMentor, setCurrentMentor] = useState({
    lastName: '',
    firstMidName: '',
    hireDate: '',
    courseID: '',
    id: null,
    title: ''
  });
  const [courseOptions, setCourseOptions] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  // 获取课程数据
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://118.31.112.47:30001/api/course', {
        headers: {
          'mode': 'no-cors'
        }
      });
      const courses = response.data.map(course => ({ value: course.courseID, label: course.courseID }));
      console.log(courses);
      setCourseOptions(courses);
    } catch (error) {
      console.error('获取课程列表失败:', error);
      setMessage('获取课程列表失败，请重试。');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchData();
  }, []);

  // 获取导师数据
  const fetchData = async () => {
    try {
      const response = await axios.get('http://118.31.112.47:30001/api/instructor');
      setMentors(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('获取导师数据失败:', error);
      setMessage('获取导师数据失败，请重试。');
    }
  };

  // 显示提示信息并自动消失
  const showNotification = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage('');
    }, 2000);
  };

  // 搜索导师信息
  const filteredMentors = mentors.filter(mentor => {
    if (mentor && mentor.lastName) {
      return mentor.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  // 添加导师信息
  const addMentor = async () => {
    if (validateMentor(currentMentor)) {
      try {
        const newMentor = {
          lastName: currentMentor.lastName.trim(),
          firstMidName: currentMentor.firstMidName.trim(),
          hireDate: currentMentor.hireDate,
          courseID: currentMentor.courseID,
          title: currentMentor.title
        };
        const response = await axios.post('http://118.31.112.47:30001/api/instructor', newMentor, {
          headers: {
            'Content-Type': 'application/json',
            'mode': 'no-cors'
          }
        });
        console.log(response);
        fetchData();
        setShowModal(false);
        setCurrentMentor({
          lastName: '',
          firstMidName: '',
          hireDate: '',
          courseID: '',
          title: '',
          id: null
        });
      } catch (error) {
        console.error('发送数据失败:', error);
        showNotification('发送数据失败，请重试。');
      }
    }
  };

  // 编辑导师信息
  const editMentor = async () => {
    if (validateMentor(currentMentor)) {
      try {
        const updatedMentor = {
          lastName: currentMentor.lastName.trim(),
          firstMidName: currentMentor.firstMidName.trim(),
          hireDate: currentMentor.hireDate,
          courseID: currentMentor.courseID,
          title: currentMentor.title
        };
        const response = await axios.put(`http://118.31.112.47:30001/api/instructor/${currentMentor.id}`, updatedMentor);
        console.log(response);
        fetchData();
        setShowModal(false);
        setCurrentMentor({ lastName: '', firstMidName: '', hireDate: '', courseID: '', title: '', credits:0, id: null });
      } catch (error) {
        console.error('更新数据失败:', error);
        showNotification('更新数据失败，请重试。');
      }
    }
  };
  // 删除导师信息  
  const deleteMentor = async (mentorId) => {
    try {
      await axios.delete(`http://118.31.112.47:30001/api/instructor/${mentorId}`, {
        headers: {
          'mode': 'no-cors'
        }
      });
      setMentors(mentors.filter(mentor => mentor.id !== mentorId));
    } catch (error) {
      console.error('删除导师信息失败:', error);
      showNotification('删除导师信息失败，请重试。');
    }
  };

  // 打开模态框以添加或编辑导师信息
  const openModal = (mentor) => {
    setShowModal(true);
    if (mentor) {
      setCurrentMentor({ ...mentor });
    } else {
      setCurrentMentor({
        lastName: '',
        firstMidName: '',
        hireDate: '',
        courseID: '',
        title: '',
        credits:0,
        id: null
      });
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setShowModal(false);
  };

  // 处理搜索框变化
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // 导师信息验证函数
  const validateMentor = (mentor) => {
    const errors = [];
    if (!mentor.lastName.trim()) {
      errors.push('姓不能为空。');
    }
    if (!mentor.firstMidName.trim()) {
      errors.push('名称不能为空。');
    }
    if (!mentor.hireDate) {
      errors.push('聘用日期不能为空。');
    }
    // if (!mentor.courseID) {
    //   errors.push('课程ID不能为空。');
    // }
    if (errors.length > 0) {
      showNotification(errors.join('\n'));
      return false;
    }
    return true;
  };

  // 渲染课程下拉选择框
  const renderCourseSelect = () => (
    <select value={currentMentor.courseID} onChange={(e) => setCurrentMentor({ ...currentMentor, courseID: e.target.value })}>
      <option value="">请选择课程</option>
      {courseOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  // 渲染导师信息表格
  const renderMentorTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓</th>
            <th>名称</th>
            <th>聘用日期</th>
            <th>课程</th>
            <th>学分</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredMentors.map(mentor => (
            <tr key={mentor.id}>
              <td>{mentor.id}</td>
              <td>{mentor.lastName}</td>
              <td>{mentor.firstMidName}</td>
              <td>{mentor.hireDate}</td>
              <td>{mentor.title}</td>
              <td>{mentor.credits}</td>
              <td>
                <button onClick={() => openModal(mentor)}>编辑</button>
                <button onClick={() => deleteMentor(mentor.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <input type="text" placeholder="输入姓名搜索导师信息" value={searchTerm} onChange={handleSearchChange} />
      {showMessage && <div className="notification">{message}</div>}
      {renderMentorTable()}
      {showModal && (
        <div className="modal">
          <h2>{currentMentor.id ? '编辑' : '添加'} 导师信息</h2>
          <form>
            <div>
              <label>姓:</label>
              <input type="text" value={currentMentor.lastName} onChange={(e) => setCurrentMentor({ ...currentMentor, lastName: e.target.value })} />
            </div>
            <div>
              <label>名称:</label>
              <input type="text" value={currentMentor.firstMidName} onChange={(e) => setCurrentMentor({ ...currentMentor, firstMidName: e.target.value })} />
            </div>
            <div>
              <label>聘用日期:</label>
              <input type="date" value={currentMentor.hireDate} onChange={(e) => setCurrentMentor({ ...currentMentor, hireDate: e.target.value })} />
            </div>
            { !currentMentor.id && (
              <>
                <div>
                  <label>课程:</label>
                  {renderCourseSelect()}
                </div>
                <div>
                  <label>课程标题:</label>
                  <input type="text" value={currentMentor.title} onChange={(e) => setCurrentMentor({ ...currentMentor, title: e.target.value })} />
              </div>
              </>
            )}
            <button type="button" onClick={closeModal}>取消</button>
            <button type="button" onClick={currentMentor.id ? editMentor : addMentor}>
            {currentMentor.id ? '更新' : '添加'}
            </button>
          </form>
        </div>                         
      )}
      <button onClick={() => openModal(null)}>添加导师</button>
</div>
);
}

export default MentorPage;
