const fakeData = {
  students: [
    { id: 1, name: 'Alice', age: 20 },
    { id: 2, name: 'Bob', age: 22 },
    { id: 3, name: 'Charlie', age: 21 },
  ],
  courses: [
    { id: 1, name: 'Math', teacher: 'Alice' },
    { id: 2, name: 'Science', teacher: 'Bob' },
    { id: 3, name: 'Literature', teacher: 'Charlie' },
  ],
  mentors: [
    { id: 1, name: 'David', specialty: 'Programming' },
    { id: 2, name: 'Eve', specialty: 'Design' },
  ],
};

// 模拟API调用的函数
export const fetchStudents = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fakeData.students), 1000); // 模拟网络延迟
  });
};

export const fetchCourses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fakeData.courses), 1000); // 模拟网络延迟
  });
};

export const fetchMentors = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fakeData.mentors), 1000); // 模拟网络延迟
  });
};


// 这里是一个模拟的登录函数，实际应用中应该向服务器发送请求
export const loginUser = async ({ username, password }) => {
  // 模拟的用户数据和验证逻辑
  const user = {
    username: 'admin',
    password: 'password123', // 假设这是哈希后的密码
  };

  // 这里我们简单地检查用户名和密码是否匹配
  // 实际应用中，您需要与后端进行交互，并处理哈希密码的比较
  if (username === user.username && password === user.password) {
    // 登录成功，设置登录状态并重定向到主界面
    localStorage.setItem('isLoggedIn', 'true');
    return Promise.resolve(); // 返回一个解析的Promise以模拟成功的异步操作
  } else {
    // 登录失败，抛出错误
    return Promise.reject(new Error('Invalid credentials'));
  }
};



// 模拟的注册函数
export const registerUser = async ({ username, password }) => {
  // 这里我们只是模拟注册成功的情况
  // 实际应用中，你需要在这里添加与后端交互的代码
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('用户注册成功！');
    }, 1000); // 模拟网络延迟
  });
};
