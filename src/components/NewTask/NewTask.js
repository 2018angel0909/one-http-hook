import { useState } from "react";

import Section from "../UI/Section";
import TaskForm from "./TaskForm";
import useHttp from "../hook/use-http";

const NewTask = (props) => {
  const { isLoading, error, sendHttp } = useHttp();

  //传递数据转换的函数给发送请求的函数sendHttp
  const addValue = (taskText, data) => {
    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdTask = { id: generatedId, text: taskText };

    props.onAddTask(createdTask);
  };

  //enterTaskHandler函数只有提交from表单的函数，才会触发发请求post保存用户信息、
  //taskText是用户提交from表单的数据
  //发送请求函数传递配置和数据转换函数
  //也可以把addValue函数放在enterTaskHandler这个函数里面，sendHttp上面，这样就需要bind指向，但是嵌套函数，用到外层函数会形成闭包，占内存。对性能不好
  //body因为use-http已经转换了，json字符串了，这里直接传对象
  const enterTaskHandler = async (taskText) => {
    sendHttp(
      {
        url: "https://react-http-6b4a6.firebaseio.com/tasks.json",
        method: "POST",
        body: { text: taskText },
        headers: {
          "Content-Type": "application/json",
        },
      },

      //因为addValue 里需要text: taskText，taskText的值，所以bind预配置，在这里获取到 enterTaskHandler传的taskText传递到addValue这个函数里
      //bind第一个值是this指向，我们不需要，第二个是预配置
      addValue.bind(null, taskText)
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
