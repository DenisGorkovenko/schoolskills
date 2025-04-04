import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MathTask = () => {
  const [task, setTask] = useState(null);
  const [subtractionTask, setSubtractionTask] = useState(null); // Состояние для второго задания
  const [hundredTask, setHundredTask] = useState(null); // Состояние для третьего задания
  const [userAnswer, setUserAnswer] = useState('');
  const [subtractionUserAnswer, setSubtractionUserAnswer] = useState(''); // Состояние для ответа на второе задание
  const [hundredUserAnswer, setHundredUserAnswer] = useState(''); // Состояние для ответа на третье задание
  const [message, setMessage] = useState('');
  const [subtractionMessage, setSubtractionMessage] = useState(''); // Сообщение для второго задания
  const [hundredMessage, setHundredMessage] = useState(''); // Сообщение для второго задания

  // Функция для получения задания на таблицы умножения
  const fetchTask = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/multiplication_table_gen/', {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setTask(response.data);
      setMessage('');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  // Функция для получения задания на сложение и вычитание до 20
  const fetchSubtractionTask = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/add_subtrac_twenty_gen/', {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setSubtractionTask(response.data);
      setSubtractionMessage('');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  // Функция для получения задания на сложение и вычитание до 100
  const fetchHundredTask = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/add_subtrac_one_hundred_gen/', {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setHundredTask(response.data);
      setHundredMessage('');
    } catch (error) {
      console.error(error.response.data);
    }
  };

  // Функция для обработки отправки ответа на таблицу умножения
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/multiplication_table_answer/', {
        question: task.question,
        answer: Number(userAnswer),
      }, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setMessage(response.data.message);
      setUserAnswer('');
    } catch (error) {
      console.error(error.response.data);
      setMessage(error.response.data.detail);
    }
  };

  // Функция для обработки отправки ответа на сложение и вычитание до 20
  const handleSubtractionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/add_subtrac_twenty_answer/', {
        question: subtractionTask.question,
        answer: Number(subtractionUserAnswer),
      }, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setSubtractionMessage(response.data.message);
      setSubtractionUserAnswer('');
    } catch (error) {
      console.error(error.response.data);
      setSubtractionMessage(error.response.data.detail);
    }
  };

  // Функция для обработки отправки ответа на сложение и вычитание до 20
  const handleHundredSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/add_subtrac_one_hundred_answer/', {
        question: hundredTask.question,
        answer: Number(hundredUserAnswer),
      }, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setHundredMessage(response.data.message);
      setHundredUserAnswer('');
    } catch (error) {
      console.error(error.response.data);
      setHundredMessage(error.response.data.detail);
    }
  };

  // Используем useEffect для получения заданий при монтировании компонента
  useEffect(() => {
    fetchTask();
    fetchSubtractionTask();
    fetchHundredTask(); 
  }, []);

  const handleFetchNewTask = async () => {
    await fetchTask(); 
  };

  const handleFetchNewSubtractionTask = async () => {
    await fetchSubtractionTask(); 
  };

  const handleFetchNewHundredTask = async () => {
    await fetchHundredTask(); 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Тренировка таблицы умножения</h2>
      {task && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
          <p style={{ marginBottom: '10px' }}>{task.question}</p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Ваш ответ"
            required
            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
          />
          <button type="submit" style={{ padding: '10px', marginBottom: '10px' }}>Проверить ответ</button>
        </form>
      )}
      <button onClick={handleFetchNewTask} style={{ padding: '10px', marginTop: '10px' }}>Получить новое задание</button>
      {message && <p style={{ marginTop: '20px', marginBottom: '0' }}>{message}</p>} {/* Сообщение будет оставаться на экране */}

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Тренировка сложения и вычитания до 20</h2>
      {subtractionTask && (
        <form onSubmit={handleSubtractionSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
          <p style={{ marginBottom: '10px' }}>{subtractionTask.question}</p>
          <input
            type="number"
            value={subtractionUserAnswer}
            onChange={(e) => setSubtractionUserAnswer(e.target.value)}
            placeholder="Ваш ответ"
            required
            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
          />
          <button type="submit" style={{ padding: '10px', marginBottom: '10px' }}>Проверить ответ</button>
        </form>
      )}
      <button onClick={handleFetchNewSubtractionTask} style={{ padding: '10px', marginTop: '10px' }}>Получить новое задание</button>
      {subtractionMessage && <p style={{ marginTop: '20px', marginBottom: '0' }}>{subtractionMessage}</p>} {/* Сообщение для вычитания */}

      <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>Тренировка сложения и вычитания до 100</h2>
      {hundredTask && (
        <form onSubmit={handleHundredSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '300px' }}>
          <p style={{ marginBottom: '10px' }}>{hundredTask.question}</p>
          <input
            type="number"
            value={hundredUserAnswer}
            onChange={(e) => setHundredUserAnswer(e.target.value)}
            placeholder="Ваш ответ"
            required
            style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
          />
          <button type="submit" style={{ padding: '10px', marginBottom: '10px' }}>Проверить ответ</button>
        </form>
      )}
      <button onClick={handleFetchNewHundredTask} style={{ padding: '10px', marginTop: '10px' }}>Получить новое задание</button>
      {hundredMessage && <p style={{ marginTop: '20px', marginBottom: '0' }}>{hundredMessage}</p>} {/* Сообщение для вычитания */}
    </div>
  );
};

export default MathTask;