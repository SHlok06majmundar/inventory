// frontend/src/pages/Login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Alert
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message on submit

    try {
      const res = await axios.post('https://inventory-1jqm.onrender.com/api/users/login', { email, password });
      const token = res.data.token;
      login(token); // Call the login function to set the token in AuthContext

      localStorage.setItem('token', token); // Store the token

      navigate('/dashboard'); // Redirect to the dashboard after login
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Invalid credentials. Please try again.');
        } else {
          setErrorMessage('Login failed. Please try again.');
        }
      } else {
        console.error('Unexpected error:', error);
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f0f2f5',
        padding: '0',
        margin: '0',
      }}
    >
      <Card
        elevation={5}
        style={{
          padding: '30px',
          borderRadius: '15px',
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#ffffff',
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            style={{ fontWeight: 'bold', color: '#1976d2' }}
          >
            Login
          </Typography>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            style={{ marginBottom: '20px', color: 'gray' }}
          >
            Welcome back! Please log in to your account.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2} mb={3}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errorMessage && (
                <Alert severity="error">
                  {errorMessage}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ padding: '12px', fontWeight: 'bold' }}
              >
                Login
              </Button>
            </Box>
          </form>
          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: '15px' }}
          >
            Don't have an account?{' '}
            <a href="/" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Register here
            </a>
          </Typography>
          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: '15px' }}
          >
            <a
              onClick={() => navigate('/forgot-password')}
              style={{ color: '#1976d2', textDecoration: 'none', cursor: 'pointer' }}
            >
              Forgot Password?
            </a>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
