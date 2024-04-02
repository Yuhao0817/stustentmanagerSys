import React, { useState, useEffect } from 'react';
import './index.css'; // 确保CSS文件路径正确

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ name: '', age: '', grade: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initialStudents = [
      { id: 1, name: '张三', age: 20, grade: '计算机科学与技术' },
      { id: 2, name: '李四', age: 19, grade: '软件工程' },
      { id: 3, name: '王五', age: 21, grade: '信息安全' },
    ];
    setStudents(initialStudents);
  }, []);

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
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 添加学生信息
  const addStudent = () => {
    if (validateStudent(currentStudent)) {
      const newStudent = {
        id: students.length + 1,
        name: currentStudent.name.trim(),
        age: parseInt(currentStudent.age, 10),
        grade: currentStudent.grade.trim(),
      };
      setStudents([...students, newStudent]);
      setShowModal(false); // 关闭模态框
      setCurrentStudent({ name: '', age: '', grade: '' }); // 重置当前学生信息
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
      setCurrentStudent({ name: '', age: '', grade: '' }); // 重置当前学生信息
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
      setCurrentStudent({ name: '', age: '', grade: '' });
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
    if (!student.name.trim()) {
      errors.push('姓名不能为空。');
    }
    if (!student.age || isNaN(student.age) || student.age < 0 || student.age > 100) {
      errors.push('年龄必须在0到100之间。');
    }
    if (!student.grade.trim()) {
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
            <th>年龄</th>
            <th>专业</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map(student => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.grade}</td>
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
              <input type="text" value={currentStudent.name} onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })} />
            </div>
            <div>
              <label>年龄:</label>
              <input type="number" value={currentStudent.age} onChange={(e) => setCurrentStudent({ ...currentStudent, age: e.target.value })} />
            </div>
            <div>
              <label>专业:</label>
              <input type="text" value={currentStudent.grade} onChange={(e) => setCurrentStudent({ ...currentStudent, grade: e.target.value })} />
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
