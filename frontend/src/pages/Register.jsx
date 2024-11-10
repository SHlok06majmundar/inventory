
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Card, CardContent, Box, Alert } from '@mui/material';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message on submit
    setSuccessMessage(''); // Reset success message

    // Validate input fields
    if (!name || !email || !username || password.length < 7) {
      setErrorMessage('Please fill in all fields and ensure the password is at least 7 characters.(Thala For a Reason😎)');
      return; // Stop form submission if validation fails
    }

    try {
      const response = await axios.post('https://inventory-1jqm.onrender.com/api/users/register', {
        name,
        email,
        username,
        password,
      });

      // Assuming your registration returns a token
      const token = response.data.token; // Ensure the response includes a token
      localStorage.setItem('token', token); // Store the token in localStorage
      
      setSuccessMessage('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard'); // Redirect after a delay to show success message
      }, 2000);
      
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        setErrorMessage(error.response.data.message || 'An error occurred. Please try again.');
      } else {
        // Network or other error
        console.error('Unexpected error:', error);
        setErrorMessage('Network error. Please try again.');
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
          <Typography variant="h4" component="h1" gutterBottom align="center" style={{ fontWeight: 'bold', color: '#1976d2' }}>
            Register
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2} mb={3}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ padding: '12px', fontWeight: 'bold' }}
              >
                Register
              </Button>
            </Box>
          </form>
          <Typography variant="body2" align="center" style={{ marginTop: '15px' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Login here
            </a>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
