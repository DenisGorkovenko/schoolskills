import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    grade: '',
    school: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/users/create_users/', formData);
      console.log(response.data);
      navigate ('/profile');
      // Handle successful registration (e.g., redirect to login)
    } catch (error) {
      console.error(error.response.data);
      // Handle error (e.g., show error message)
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
  <h2 style={styles.title}>Регистрация</h2>
  <form onSubmit={handleSubmit} style={styles.form}>
    <input
      name="first_name"
      onChange={handleChange}
      placeholder="First Name"
      required
      style={styles.input}
    />
    <input
      name="last_name"
      onChange={handleChange}
      placeholder="Last Name"
      required
      style={styles.input}
    />
    <input
      name="age"
      onChange={handleChange}
      placeholder="Age"
      required
      style={styles.input}
    />
    <input
      name="grade"
      onChange={handleChange}
      placeholder="Grade"
      required
      style={styles.input}
    />
    <input
      name="school"
      onChange={handleChange}
      placeholder="School"
      required
      style={styles.input}
    />
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
    <button type="submit" style={styles.button}>Зарегистрироваться</button>
  </form>
</div>
  );
};

export default Register;