import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    lastName: '',
    firstMidName: '',
    enrollmentDate: '',
    courseId: null,
    grade: 0,
    id: null
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
      const courses = response.data;
      setCourseOptions(courses.map(item => ({ value: item.courseID, label: item.courseID })));
    } catch (error) {
      console.error('Failed to get course list:', error);
      setMessage('Failed to get course list, please try again.');
    }
  };

  useEffect(() => {
    fetchData();
    fetchCourses();
  }, []);

  // 获取学生数据
  const fetchData = async () => {
    try {
      const response = await axios.get('http://118.31.112.47:30001/api/student');
      setStudents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to get student data:', error);
      setMessage('Failed to get student data, please try again.');
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

  // 搜索学生信息
  const filteredStudents = students.filter(student => {
    if (student && student.lastName) {
      return student.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  // 添加学生信息
  const addStudent = async () => {
    if (validateStudent(currentStudent)) {
      const newstudent = {
        lastName: currentStudent.lastName.trim(),
        firstMidName: currentStudent.firstMidName.trim(),
        enrollmentDate: currentStudent.enrollmentDate,
        courseId: currentStudent.courseId,
        grade: currentStudent.grade,
      };
      try {
        console.log(newstudent);
        const response = await axios.post('http://118.31.112.47:30001/api/student', newstudent, {
          headers: {
            'Content-Type': 'application/json',
            'mode': 'no-cors'
          }
        });
        console.log(response.data);
        // setStudents([...students, response.data]);
        fetchData();
          setShowModal(false);
          setCurrentStudent({
            lastName: '',
            firstMidName: '',
            enrollmentDate: '',
            courseId: null,
            grade: 0,
            id: null
          });
        
      } catch (error) {
        console.error('Failed to send data:', error);
        showNotification('Failed to send data, please try again.');
      }
    }
  };

  // 编辑学生信息
  const editStudent = async () => {
    if (validateStudent(currentStudent)) {
      try {
        const updateCourse={
          lastName: currentStudent.lastName.trim(),
          firstMidName: currentStudent.firstMidName.trim(),
          enrollmentDate: currentStudent.enrollmentDate,
        }
        const response = await axios.put(`http://118.31.112.47:30001/api/student/${currentStudent.id}`, updateCourse);
        
        console.log(response);
          // const updatedStudents = students.map((student) => {
          //   if (student.id === currentStudent.id) {
          //     console.log(response.data);
          //     return response.data;
          //   }
          //   return student;
          // });
        // setStudents(updatedStudents);
        fetchData();
          setShowModal(false);
          setCurrentStudent({
            lastName: '',
            firstMidName: '',
            enrollmentDate: '',
            courseId: null,
            grade: 0,
            id: null
          });
      } catch (error) {
        console.error('Failed to update data:', error);
        showNotification('Failed to update data, please try again.');
      }
    }
  };

  // 删除学生信息
  const deleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://118.31.112.47:30001/api/student/${studentId}`, {
        headers: {
          'mode': 'no-cors'
        }
      });
      setStudents(students.filter(student => student.id !== studentId));
    } catch (error) {
      console.error('Failed to delete student information:', error);
      showNotification('Failed to delete student information, please try again.');
    }
  };

  // 打开模态框以添加或编辑学生信息
  const openModal = (student) => {
    setShowModal(true);
    if (student) {
      setCurrentStudent({ ...student });
    } else {
      setCurrentStudent({
        lastName: '',
        firstMidName: '',
        enrollmentDate: '',
        courseId: null,
        grade: 0,
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

  // 学生信息验证函数
  const validateStudent = (student) => {
    const errors = [];
    if (!student.lastName.trim()) {
      errors.push('The lastName cannot be empty.');
    }
    if (!student.firstMidName.trim()) {
      errors.push('The firstMidName cannot be empty.');
    }
    if (!student.enrollmentDate) {
      errors.push('The enrollmentDate cannot be empty.');
    }
    // if (!student.courseId) {
    //   errors.push('课程ID不能为空。');
    // }
    // if (!student.grade || ![1, 2, 3, 4].includes(student.grade)) {
    //   errors.push('年级必须是1, 2, 3, 或4中的一个。');
    // }
    if (errors.length > 0) {
      showNotification(errors.join('\n'));
      return false;
    }
    return true;
  };

  // 渲染课程下拉选择框
  const renderCourseSelect = () => (
    <select defaultValue={currentStudent.courseId} value={currentStudent.courseId} onChange={(e) => setCurrentStudent({ ...currentStudent, courseId: parseInt(e.target.value, 10) })}>
      <option value="">Please select a course</option>
      {courseOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  // 渲染学生信息表格
  const renderStudentTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>lastName</th>
            <th>firstMidName</th>
            <th>enrollmentDate</th>
            <th>grade</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.index}>
              <td>{student.id}</td>
              <td>{student.lastName}</td>
              <td>{student.firstMidName}</td>
              <td>{student.enrollmentDate}</td>
              <td>{student.grade}</td>
              <td>
                <button onClick={() => openModal(student)}>modify</button>
                <button onClick={() => deleteStudent(student.id)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <input type="text" placeholder="Enter a name to search for student information..." value={searchTerm} onChange={handleSearchChange} />
      {showMessage && <div className="notification">{message}</div>}
      {renderStudentTable()}
      {showModal && (
        <div className="modal">
          <h2>{currentStudent.id ? 'modify' : 'add'} Student Information</h2>
          <form>
            <div>
              <label>lastName:</label>
              <input type="text" value={currentStudent.lastName} onChange={(e) => setCurrentStudent({ ...currentStudent, lastName: e.target.value })} />
            </div>
            <div>
              <label>firstMidName:</label>
              <input type="text" value={currentStudent.firstMidName} onChange={(e) => setCurrentStudent({ ...currentStudent, firstMidName: e.target.value })} />
            </div>
            <div>
              <label>enrollmentDate:</label>
              <input type="date" value={currentStudent.enrollmentDate} onChange={(e) => setCurrentStudent({ ...currentStudent, enrollmentDate: e.target.value })} />
            </div>
            {!currentStudent.id && (
              <>
              <div>
              <label>courseID:</label>
              {renderCourseSelect()}
            </div>
            <div>
              <label>grade:</label>
              <select value={currentStudent.grade} onChange={(e) => setCurrentStudent({ ...currentStudent, grade: parseInt(e.target.value, 10) })}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
              </>
            )}
            <button type="button" onClick={closeModal}>cancel</button>
            <button type="button" onClick={currentStudent.id ? editStudent : addStudent}>
              {currentStudent.id ? 'update' : 'add'}
            </button>
          </form>
        </div>
      )}
      <button onClick={() => openModal(null)}>Add students</button>
    </div>
  );
}
export default StudentPage;
