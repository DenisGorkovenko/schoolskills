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

  const handleNavigateToMathTasks = () => {
    navigate('/tasks'); 
  };

  return (
    <div>
      {user && (
        <div>
          <h2>Профиль пользователя</h2>
          <p>Имя: {user.first_name}</p>
          <p>Фамилия: {user.last_name}</p>
          <p>Email: {user.email}</p>
          <input type="file" onChange={handleAvatarChange} />
          <button onClick={handleAvatarDelete}>Удалить аватар</button>
          {avatar && <img src={avatar} alt="Avatar" style={{ width: '100px', height: '100px' }} />}
          <button onClick={handleNavigateToMathTasks}>Перейти к заданиям</button>
        </div>
      )}
    </div>
  );
};

export default Profile;