import React, { useState } from 'react';

// 假数据
const initialCourses = [
  { id: 1, name: '数学', teacher: '张老师' },
  { id: 2, name: '英语', teacher: '李老师' },
  { id: 3, name: '物理', teacher: '王老师' },
  { id: 4, name: '化学', teacher: '赵老师' },
];

// 课程信息组件
const CourseInfo = ({ course, onUpdate, onDelete }) => {
  return (
    <tr>
      <td>{course.id}</td>
      <td>{course.name}</td>
      <td>{course.teacher}</td>
      <td>
        <button onClick={() => onUpdate(course)}>修改</button>
        <button onClick={() => onDelete(course.id)}>删除</button>
      </td>
    </tr>
  );
};

// 课程列表组件
const CoursesList = ({ courses, onAdd, onUpdate, onDelete, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input type="text" placeholder="搜索课程..." onChange={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>课程名称</th>
            <th>授课教师</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map(course => (
            <CourseInfo key={course.id} course={course} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 添加/修改课程弹框组件
const CourseModal = ({ isOpen, onClose, onAdd, onUpdate, course }) => {
  const [name, setName] = useState(course ? course.name : '');
  const [teacher, setTeacher] = useState(course ? course.teacher : '');

  const handleSubmit = () => {
    if (course) {
      // 更新课程
      onUpdate({ ...course, name, teacher });
    } else {
      // 添加课程
      onAdd({ id: Date.now(), name, teacher });
    }
    onClose();
  };

  return (
    <div className="modal" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{course ? '修改' : '添加'}课程</h2>
        <form onSubmit={handleSubmit}>
          <label>课程名称:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          <label>授课教师:</label>
          <input type="text" value={teacher} onChange={e => setTeacher(e.target.value)} required />
          <button type="submit">{course ? '保存' : '添加'}</button>
        </form>
      </div>
    </div>
  );
};

// 主组件
const CoursePage = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);
  const openEditModal = course => {
    setCurrentCourse(course);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentCourse(null);
  };

  const addCourse = newCourse => {
    setCourses([...courses, newCourse]);
  };

  const updateCourse = updatedCourse => {
    setCourses(courses.map(course => course.id === updatedCourse.id ? updatedCourse : course));
  };

  const deleteCourse = id => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const submitCourses = () => {
    // 在实际应用中，这里应该调用后端接口提交课程列表
    console.log('提交的课程列表:', courses);
  };

  return (
    <div>
     
      <CoursesList courses={courses} onAdd={addCourse} onUpdate={openEditModal} onDelete={deleteCourse} />
      {addModalOpen && <CourseModal isOpen={addModalOpen} onClose={closeAddModal} onAdd={addCourse} onUpdate={updateCourse} course={null} />}
      {editModalOpen && <CourseModal isOpen={editModalOpen} onClose={closeEditModal} onAdd={addCourse} onUpdate={updateCourse} course={currentCourse} />}
      <button onClick={openAddModal}>添加课程</button>
      <button onClick={submitCourses}>提交课程</button>
    </div>
  );
};

export default CoursePage;
