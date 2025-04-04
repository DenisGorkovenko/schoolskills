import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/random_task/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Список заданий</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id}>
            <p>{task.question}</p>
            {/* Здесь можно добавить кнопку для проверки ответа */}
          </div>
        ))
      ) : (
        <p>Задания не найдены.</p>
      )}
    </div>
  );
};

export default TaskList;