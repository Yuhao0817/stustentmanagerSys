import React, { useState } from 'react';

// 假数据，模拟从后端获取的导师信息
const fakeMentorsData = [
  { id: 1, course: 'Math', name: 'Alice', title: 'Teacher' },
  { id: 2, course: 'Physics', name: 'Bob', title: 'Professor' },
  { id: 3, course: 'Chemistry', name: 'Charlie', title: 'Instructor' },
  { id: 4, course: 'Biology', name: 'Diana', title: 'Lecturer' },
  { id: 5, course: 'History', name: 'Eva', title: 'Professor' },
  // ... 更多假数据
];

const MentorsPage = () => {
  // 存储所有导师信息
  const [mentors, setMentors] = useState(fakeMentorsData);
  // 存储选中的导师信息
  const [selectedMentors, setSelectedMentors] = useState([]);

  // 根据搜索关键词过滤导师数据
  const handleSearch = (searchTerm) => {
    if (searchTerm === '') {
      setMentors(fakeMentorsData); // 清空搜索框时恢复所有数据
    } else {
      const filteredMentors = fakeMentorsData.filter(mentor =>
        mentor.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMentors(filteredMentors);
    }
  };

  // 处理导师选择
  const handleSelect = (mentor) => {
    const mentorIndex = selectedMentors.findIndex(m => m.id === mentor.id);
    if (mentorIndex === -1) {
      setSelectedMentors([...selectedMentors, mentor]);
    } else {
      setSelectedMentors(selectedMentors.filter(m => m.id !== mentor.id));
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="根据课程名称或导师名称选择导师..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>课程名称</th>
            <th>导师名称</th>
            <th>教师职称</th>
            <th>选择</th>
          </tr>
        </thead>
        <tbody>
          {mentors.map((mentor) => (
            <tr key={mentor.id}>
              <td>{mentor.id}</td>
              <td>{mentor.course}</td>
              <td>{mentor.name}</td>
              <td>{mentor.title}</td>
              <td>
                <input
                  type="checkbox"
                  checked={selectedMentors.some(selectedMentor => selectedMentor.id === mentor.id)}
                  onChange={(e) => handleSelect(mentor)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => console.log('Selected Mentors:', selectedMentors)}>提交选择信息</button>
    </div>
  );
};

export default MentorsPage;
