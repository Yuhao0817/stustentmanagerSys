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
      console.error('Failed to get course list:', error);
      setMessage('Failed to get course list, please try again.');
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
      console.error('Failed to get tutor data:', error);
      setMessage('Failed to get tutor data, please try again.');
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
        console.error('Failed to send data:', error);
        showNotification('Failed to send data, please try again.');
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
        console.error('Failed to update data:', error);
        showNotification('Failed to update data, please try again.');
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
      console.error('Failed to delete tutor information:', error);
      showNotification('Failed to delete tutor information, please try again.');
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
      errors.push('The lastName cannot be empty.');
    }
    if (!mentor.firstMidName.trim()) {
      errors.push('The firstMidName cannot be empty.');
    }
    if (!mentor.hireDate) {
      errors.push('The hireDate cannot be empty.');
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
      <option value="">Please select a course</option>
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
            <th>lastname</th>
            <th>firstMidName</th>
            <th>hireDate</th>
            <th>course</th>
            <th>credits</th>
            <th>action</th>
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
                <button onClick={() => openModal(mentor)}>modify</button>
                <button onClick={() => deleteMentor(mentor.id)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <input type="text" placeholder="Enter your name to search for tutor information" value={searchTerm} onChange={handleSearchChange} />
      {showMessage && <div className="notification">{message}</div>}
      {renderMentorTable()}
      {showModal && (
        <div className="modal">
          <h2>{currentMentor.id ? 'modify' : 'add'} Tutor information</h2>
          <form>
            <div>
              <label>lastName:</label>
              <input type="text" value={currentMentor.lastName} onChange={(e) => setCurrentMentor({ ...currentMentor, lastName: e.target.value })} />
            </div>
            <div>
              <label>firstMidName:</label>
              <input type="text" value={currentMentor.firstMidName} onChange={(e) => setCurrentMentor({ ...currentMentor, firstMidName: e.target.value })} />
            </div>
            <div>
              <label>hireDate:</label>
              <input type="date" value={currentMentor.hireDate} onChange={(e) => setCurrentMentor({ ...currentMentor, hireDate: e.target.value })} />
            </div>
            { !currentMentor.id && (
              <>
                <div>
                  <label>course:</label>
                  {renderCourseSelect()}
                </div>
                <div>
                  <label>title:</label>
                  <input type="text" value={currentMentor.title} onChange={(e) => setCurrentMentor({ ...currentMentor, title: e.target.value })} />
              </div>
              </>
            )}
            <button type="button" onClick={closeModal}>cancel</button>
            <button type="button" onClick={currentMentor.id ? editMentor : addMentor}>
            {currentMentor.id ? 'modify' : 'add'}
            </button>
          </form>
        </div>                         
      )}
      <button onClick={() => openModal(null)}>Add Mentor</button>
</div>
);
}

export default MentorPage;
