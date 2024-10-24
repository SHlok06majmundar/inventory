// frontend/src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message on submit

    try {
      await axios.post('http://localhost:5000/api/users/register', { name, email, password });
      // Redirect to the dashboard after successful registration
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        if (error.response.data.message === 'User already exists') {
          setErrorMessage('This email is already registered. Please use a different email or log in.');
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
        console.error('Error response data:', error.response.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Register</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}

export default Register;
