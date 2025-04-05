import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/users/me/', {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
        setAvatar(response.data.avatar);
      } catch (error) {
        console.error(error.response.data);
      }
    };

    fetchUser();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      const avatarData = { avatar: reader.result };
      try {
        await axios.put('http://localhost:8000/api/users/me/avatar/', avatarData, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        setAvatar(reader.result);
        alert('Аватар успешно изменен!');
      } catch (error) {
        console.error(error.response.data);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarDelete = async () => {
    try {
      await axios.delete('http://localhost:8000/api/users/me/avatar/', {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      alert('Аватар удален!');
      setAvatar(null);
      setUser({ ...user, avatar: null });
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/users/token/logout_user/', {}, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error.response.data);
    }
  };

  const handleNavigateToMathTasks = () => {
    navigate('/tasks'); 
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh', // Занять всю высоту экрана
      backgroundColor: '#f0f0f0', // Цвет фона
      paddingTop: '20px',
    },
    title: {
      marginBottom: '20px',
    },
    profile: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      width: '300px', // Ширина контейнера
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%', // Круглая форма аватара
      marginBottom: '10px', // Отступ снизу
    },
    button: {
      marginTop: '20px',
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    fileInput: {
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
  {user && (
    <div style={styles.profile}>
      <h2 style={styles.title}>Профиль пользователя</h2>
      <p>Имя: {user.first_name}</p>
      <p>Фамилия: {user.last_name}</p>
      <p>Класс: {user.grade}</p>
      <p>Школа: {user.school}</p>
      <p>Email: {user.email}</p>
      <p>Рейтинг: {user.rating}</p>
      {avatar ? (
        <div>
          <img src={avatar} alt="Avatar" style={styles.avatar} />
          <button onClick={handleAvatarDelete} style={styles.button}>Удалить аватар</button>
        </div>
      ) : (
        <div>
          <input type="file" onChange={handleAvatarChange} style={styles.fileInput} />
          <p>Добавить аватар</p>
        </div>
      )}
      <button onClick={handleNavigateToMathTasks} style={styles.button}>Перейти к заданиям</button>
      <button onClick={handleLogout} style={styles.button}>Выйти</button>
    </div>
  )}
</div>
  );
};

export default Profile;