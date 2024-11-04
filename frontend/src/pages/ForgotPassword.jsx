// frontend/src/pages/ForgotPassword.jsx
import { useState } from 'react';
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

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setMessage(res.data.message); // Assuming the server sends a success message
    } catch (error) {
      if (error.response) {
        setErrorMessage('Failed to send reset email. Please try again.');
      } else {
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
            Forgot Password
          </Typography>
          <Typography
            variant="body1"
            align="center"
            gutterBottom
            style={{ marginBottom: '20px', color: 'gray' }}
          >
            Enter your email address and we'll send you a link to reset your password.
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
              {errorMessage && (
                <Alert severity="error">
                  {errorMessage}
                </Alert>
              )}
              {message && (
                <Alert severity="success">
                  {message}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ padding: '12px', fontWeight: 'bold' }}
              >
                Send Reset Link
              </Button>
            </Box>
          </form>
          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: '15px' }}
          >
            Remembered your password?{' '}
            <Button
              onClick={() => navigate('/login')}
              style={{ color: '#1976d2', textDecoration: 'none' }}
            >
              Login here
            </Button>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPassword;
