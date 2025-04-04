import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/users/token/login_user/', credentials);
      const { auth_token, token_type } = response.data;
      console.log('Auth Token:', auth_token);
      console.log('Token Type:', token_type);

      
      localStorage.setItem('token', `${token_type} ${auth_token}`);
      console.log('Saved token:', localStorage.getItem('token')); // Логируем сохраненный токен

     
      axios.defaults.headers.common['Authorization'] = `${token_type} ${auth_token}`;

      // Перенаправьте пользователя на другую страницу
      navigate ('/profile'); // Замените на нужный маршрут
    } catch (error) {
      console.error(error.response.data);
      setError('Ошибка входа. Проверьте свои учетные данные.'); // Установите сообщение об ошибке
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображение сообщения об ошибке */}
    </div>
  );
};

export default Login;