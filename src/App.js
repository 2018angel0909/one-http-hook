import React, { useEffect, useState } from "react";

import Tasks from "./components/Tasks/Tasks";
import NewTask from "./components/NewTask/NewTask";
import useHttp from "./components/hook/use-http";

//没有用hook的时候
// function App() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [tasks, setTasks] = useState([]);

//   const fetchTasks = async (taskText) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(
//         'https://react-http-6b4a6.firebaseio.com/tasks.json'
//       );

//       if (!response.ok) {
//         throw new Error('Request failed!');
//       }

//       const data = await response.json();

//       const loadedTasks = [];

//       for (const taskKey in data) {
//         loadedTasks.push({ id: taskKey, text: data[taskKey].text });
//       }

//       setTasks(loadedTasks);
//     } catch (err) {
//       setError(err.message || 'Something went wrong!');
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const taskAddHandler = (task) => {
//     setTasks((prevTasks) => prevTasks.concat(task));
//   };

//   return (
//     <React.Fragment>
//       <NewTask onAddTask={taskAddHandler} />
//       <Tasks
//         items={tasks}
//         loading={isLoading}
//         error={error}
//         onFetch={fetchTasks}
//       />
//     </React.Fragment>
//   );
// }

function App() {
  const { isLoading, error, sendHttp: fetchTasks } = useHttp();

  const [tasks, setTasks] = useState([]);

  //这个函数就是use-http里apply函数，接收data的值传递到这里taskData
  //注意这taskData传入的形参要跟下面保持一致
  const addDataApply = (taskData) => {
    const loadedTasks = [];

    for (const taskKey in taskData) {
      loadedTasks.push({ id: taskKey, text: taskData[taskKey].text });
    }

    setTasks(loadedTasks);
  };

  //use-hook里面发送请求的函数sendHttp=fetchTasks有state状态，这里的函数组件就会重新执行，useEffect里的函数会生成新的函数，又回重新执行发送请函数。函数是js对象，内存生成新的对象，就是新的函数，所以发送请求函数要用useCallback，每次都是同一个函数，这里传递url和函数，作为参数，给发送请求函数，
  //转换数据的函数传递发送请求里面
  useEffect(() => {
    fetchTasks(
      { url: "https://react-http-6b4a6.firebaseio.com/tasks.json" },
      addDataApply
    );
  }, [fetchTasks]);

  //NewTask把用户写的form表单，发送请求到post保存数据，从后端拿到数据的时候，我们在重新用对象的形式重新设置 const createdTask = { id: generatedId, text: taskText }，
  //然后加到数据onAddTask这个 函数，，传入实参createdTask，这里函数接收一个形参，就是传入的值。concat是把对象加到新数组里，跟之前的数组没关系，新的数组，
  const taskAddHandler = (task) => {
    setTasks((prevTasks) => prevTasks.concat(task));
  };

  return (
    <React.Fragment>
      <NewTask onAddTask={taskAddHandler} />
      <Tasks
        items={tasks}
        loading={isLoading}
        error={error}
        onFetch={fetchTasks}
      />
    </React.Fragment>
  );
}

export default App;
