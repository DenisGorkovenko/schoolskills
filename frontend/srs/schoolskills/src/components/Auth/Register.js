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

  return (
    <form onSubmit={handleSubmit}>
      <input name="first_name" onChange={handleChange} placeholder="First Name" required />
      <input name="last_name" onChange={handleChange} placeholder="Last Name" required />
      <input name="age" onChange={handleChange} placeholder="Age" required />
      <input name="grade" onChange={handleChange} placeholder="Grade" required />
      <input name="school" onChange={handleChange} placeholder="School" required />
      <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;