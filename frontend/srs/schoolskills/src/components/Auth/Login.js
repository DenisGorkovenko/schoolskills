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

      navigate ('/profile');
    } catch (error) {
      console.error(error.response.data);
      setError('Ошибка входа. Проверьте свои учетные данные.');
    }
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
    form: {
      display: 'flex',
      flexDirection: 'column',
      width: '300px', // Ширина формы
    },
    input: {
      marginBottom: '10px',
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    error: {
      color: 'red',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Вход в Аккаунт</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Войти</button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default Login;