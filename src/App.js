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
  const addDataApply = (taskData) => {
    const loadedTasks = [];

    for (const taskKey in taskData) {
      loadedTasks.push({ id: taskKey, text: taskData[taskKey].text });
    }

    setTasks(loadedTasks);
  };

  //use-hook里面发送请求的函数sendHttp=fetchTasks有state状态，这里的函数组件就会重新执行，useEffect里的函数会生成新的函数，又回重新执行发送请函数。函数是js对象，内存生成新的对象，就是新的函数，所以发送请求函数要用useCallback，每次都是同一个函数，这里传递url和函数，作为参数，给发送请求函数，
  useEffect(() => {
    fetchTasks(
      { url: "https://react-http-6b4a6.firebaseio.com/tasks.json" },
      addDataApply
    );
  }, [fetchTasks]);

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
