import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Добро пожаловать на SchoolSkills</h1>
      <button onClick={handleLogin} style={{ margin: '10px', padding: '10px 20px' }}>
        Войти
      </button>
      <button onClick={handleRegister} style={{ margin: '10px', padding: '10px 20px' }}>
        Регистрация
      </button>
    </div>
  );
};

export default HomePage;