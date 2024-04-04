import React, { useState ,useEffect} from 'react';
import axios from 'axios';
// 定义前置URL
// const BASE_URL = 'https://340b-43-243-192-92.ngrok-free.app/api';

// 假数据
const initialCourses = [
  { courseID: 1, title: '数学', credits: '张老师' },
  { courseID: 2, title: '英语', credits: '李老师' },
  { courseID: 3, title: '物理', credits: '王老师' },
  { courseID: 4, title: '化学', credits: '赵老师' },
];

// 课程信息组件
const CourseInfo = ({ course, onUpdate, onDelete }) => {
  return (
    <tr>
      <td>{course.courseID}</td>
      <td>{course.title}</td>
      <td>{course.credits}</td>
      <td>
        <button onClick={() => onUpdate(course)}>修改</button>
        <button onClick={() => onDelete(course.courseID)}>删除</button>
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
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
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
            <CourseInfo key={course.courseID} course={course} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 添加/修改课程弹框组件
const CourseModal = ({ isOpen, onClose, onAdd, onUpdate, course }) => {
  const [title, setTitle] = useState(course ? course.title : '');
  const [credits, setCredits] = useState(course ? course.credits : '');

  const handleSubmit = () => {
    if (course) {
      // 更新课程
      onUpdate({ ...course, title, credits });
    } else {
      // 添加课程
      onAdd({ courseID: Date.now(), title, credits });
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
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          <label>授课教师:</label>
          <input type="text" value={credits} onChange={e => setCredits(e.target.value)} required />
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


  // 组件挂载后就调用接口获取数据
  useEffect(() => {
    fetchData(); 
  }, []); 
  
  const fetchData = async () => {
    try {
      const response = await axios.get('https://340b-43-243-192-92.ngrok-free.app/api/course', {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = response; 
      // setCourses(data); // 更新状态以使用获取的数据
      console.log(data); 
    } catch (error) {
      console.error('获取数据有误:', error);
    }
  };

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
    setCourses(courses.map(course => course.courseID === updatedCourse.courseID ? updatedCourse : course));
  };

  const deleteCourse = courseID => {
    setCourses(courses.filter(course => course.courseID !== courseID));
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
