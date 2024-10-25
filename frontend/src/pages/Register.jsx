import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Card, CardContent, Box, Alert } from '@mui/material';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message on submit

    // Validate password length
    if (password.length < 7) {
      setErrorMessage('Password should be at least 7 characters or digits "Thala for a reason😎".');
      return; // Stop form submission if validation fails
    }

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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw', // Take up full width of the screen to avoid black sides
        backgroundColor: '#f0f2f5', // Light background for the whole page
        padding: '0', // Reset padding and margins
        margin: '0', 
      }}
    >
      <Card
        elevation={5}
        style={{
          padding: '30px',
          borderRadius: '15px',
          width: '100%',
          maxWidth: '450px', // Ensure the card stays centered and responsive
          backgroundColor: '#ffffff', // Card background color
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
            Register
          </Typography>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            style={{ marginBottom: '20px', color: 'gray' }}
          >
            Create your account to manage the inventory
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
                Register
              </Button>
            </Box>
          </form>
          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: '15px' }}
          >
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
