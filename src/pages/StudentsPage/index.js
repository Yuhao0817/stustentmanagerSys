import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // 确保CSS文件路径正确

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ lastName: '', credits: '', title: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

// 假数据
// const initialStudents = [];

  useEffect(() => {
    fetchData();
    
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get('http://118.31.112.47:30001/api/student', {
        headers: {
          'mode': 'no-cors'
        }
      });
      
      const { data } = response; 
      console.log(data); 

      setStudents(data); // 更新状态以使用获取的数据

    } catch (error) {
      console.error('获取数据有误:', error);
    }
  };

  // 显示提示信息并自动消失
  const showNotification = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      setMessage('');
    }, 2000); // 2秒后隐藏提示信息
  };

  // 搜索学生信息
  const filteredStudents = students.filter(student =>
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 添加学生信息
  const addStudent = () => {
    if (validateStudent(currentStudent)) {
      const newStudent = {
        id: students.length + 1,
        lastName: currentStudent.lastName.trim(),
        credits: parseInt(currentStudent.credits, 10),
        title: currentStudent.title.trim(),
      };
      setStudents([...students, newStudent]);
      setShowModal(false); // 关闭模态框
      setCurrentStudent({ lastName: '', credits: '', title: '' }); // 重置当前学生信息
    }
};

  // 编辑学生信息
  const editStudent = () => {
    if (validateStudent(currentStudent)) {
      const updatedStudentIndex = students.findIndex(student => student.id === currentStudent.id);
      if (updatedStudentIndex !== -1) {
        const updatedStudents = [
          ...students.slice(0, updatedStudentIndex),
          { ...currentStudent },
          ...students.slice(updatedStudentIndex + 1),
        ];
        setStudents(updatedStudents);
      }
      setShowModal(false); // 关闭模态框
      setCurrentStudent({ lastName: '', credits: '', title: '' }); // 重置当前学生信息
    }
};

  // 删除学生信息
  const deleteStudent = (studentId) => {
    setStudents(students.filter(student => student.id !== studentId));
  };

  // 打开模态框以添加或编辑学生信息
  const openModal = (student) => {
    setShowModal(true);
    if (student) {
      // 如果有传入的学生信息，则用于编辑
      setCurrentStudent({ ...student });
    } else {
      // 否则，用于添加新学生
      setCurrentStudent({ lastName: '', credits: '', title: '' });
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
      errors.push('姓名不能为空。');
    }
    if (!student.credits || isNaN(student.credits) || student.credits < 0 || student.credits > 100) {
      errors.push('学分必须在0到100之间。');
    }
    if (!student.title.trim()) {
      errors.push('专业不能为空。');
    }
    if (errors.length > 0) {
      showNotification(errors.join('\n')); // 显示错误信息
      return false;
    }
    return true;
  };

  return (
    <div>
      {/* 搜索栏 */}
      <input type="text" placeholder="输入姓名搜索学生信息" value={searchTerm} onChange={handleSearchChange} />

      {/* 错误提示 */}
      {showMessage && <div className="notification">{message}</div>}


      {/* 学生信息表格 */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>学分</th>
            <th>学科</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.lastName}</td>
              <td>{student.credits}</td>
              <td>{student.title}</td>
              <td>
                <button onClick={() => openModal(student)}>编辑</button>
                <button onClick={() => deleteStudent(student.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 添加/编辑学生的模态框 */}
      {showModal && (
        <div className="modal">
          <h2>{currentStudent.id ? '编辑' : '添加'} 学生信息</h2>
          <form>
            <div>
              <label>姓名:</label>
              <input type="text" value={currentStudent.lastName} onChange={(e) => setCurrentStudent({ ...currentStudent, lastName: e.target.value })} />
            </div>
            <div>
              <label>学分:</label>
              <input type="number" value={currentStudent.credits} onChange={(e) => setCurrentStudent({ ...currentStudent, credits: e.target.value })} />
            </div>
            <div>
              <label>专业:</label>
              <input type="text" value={currentStudent.title} onChange={(e) => setCurrentStudent({ ...currentStudent, title: e.target.value })} />
            </div>
            <button type="button" onClick={closeModal}>取消</button>
            <button type="button" onClick={currentStudent.id ? editStudent : addStudent}>
              {currentStudent.id ? '更新' : '添加'}
            </button>
          </form>
        </div>
      )}

      {/* 添加按钮 */}
      <button onClick={() => openModal(null)}>添加学生</button>
    </div>
  );
}

export default StudentPage;
