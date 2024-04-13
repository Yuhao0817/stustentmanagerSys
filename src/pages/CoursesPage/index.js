import React, { useState ,useEffect} from 'react';
import axios from 'axios';
// 定义前置URL
// const BASE_URL = 'https://340b-43-243-192-92.ngrok-free.app/api';

// 假数据
const initialCourses = [];

// 课程信息组件
const CourseInfo = ({ course, onUpdate, onDelete }) => {
  return (
    <tr>
      <td>{course.courseID}</td>
      <td>{course.title}</td>
      <td>{course.credits}</td>
      <td>
        <button onClick={() => onUpdate(course)}>modify</button>
        <button onClick={() => onDelete(course.courseID)}>delete</button>
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
      <input type="text" placeholder="Search for courses..." onChange={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Course Credits</th>
            <th>Action</th>
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
        <h2>{course ? 'Modify' : 'Add'}Course</h2>
        <form onSubmit={handleSubmit}>
          <label>Course Name:</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
          <label>Course Credits:</label>
          <input type="text" value={credits} onChange={e => setCredits(e.target.value)} required />
          <button type="submit">{course ? 'Save' : 'Add'}</button>
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
      const response = await axios.get('http://118.31.112.47:30001/api/course', {
        headers: {
          'mode': 'no-cors'
        }
      });
      
      const {data} = response; 
      setCourses(data); // 更新状态以使用获取的数据
      console.log(data); 
    } catch (error) {
      console.error('The data was obtained incorrectly:', error);
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

  // 新增课程
  const addCourse = async (newCourse) => {
    try {
      const course = {
        "title": newCourse.title,
        "credits": newCourse.credits,
      };
      console.log(111,course);
      const response = await axios.post('http://118.31.112.47:30001/api/course', course);
      console.log('The new course was successful:', response);
      
    } catch (error) {
      console.log('Failed to add a new course:', error);
    }
    fetchData();
  };

  const updateCourse = async (updatedCourse) => {
    // 更新课程
    try {
      console.log(updatedCourse.courseID);
      const course = {
        "title": updatedCourse.title,
        "credits": updatedCourse.credits,
      }
      const response = await axios.put(`http://118.31.112.47:30001/api/course/${updatedCourse.courseID}`, course);
      console.log(response);
    } catch (error) {
      console.log('Failed to update the course:', error);      
    }


    setCourses(courses.map(course => course.courseID === updatedCourse.courseID ? updatedCourse : course));
  };

  const deleteCourse = async (courseID) => {
    try {
      console.log(courseID);

      const response = await axios.delete(`http://118.31.112.47:30001/api/course/${courseID}`);
      console.log(response);
      
    } catch (error) {
      console.log('Deleting the course failed:', error);
    }


    setCourses(courses.filter(course => course.courseID !== courseID));
  };

  // const submitCourses = () => {
  //   // 在实际应用中，这里应该调用后端接口提交课程列表
  //   console.log('提交的课程列表:', courses);
  // };

  return (
    <div>
     
      <CoursesList courses={courses} onAdd={addCourse} onUpdate={openEditModal} onDelete={deleteCourse} />
      {addModalOpen && <CourseModal isOpen={addModalOpen} onClose={closeAddModal} onAdd={addCourse} onUpdate={updateCourse} course={null} />}
      {editModalOpen && <CourseModal isOpen={editModalOpen} onClose={closeEditModal} onAdd={addCourse} onUpdate={updateCourse} course={currentCourse} />}
      <button onClick={openAddModal}>Add Course</button>
      {/* <button onClick={submitCourses}>提交课程</button> */}
    </div>
  );
};

export default CoursePage;
