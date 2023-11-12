import React, { useState } from 'react';
import { Button, Container, CssBaseline, TextField, Typography, Grid, Link as MuiLink, Box, Avatar, Paper, Alert, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoading(true); // Set isLoading to true when the request starts

    axios.post("http://localhost:8003/login", JSON.stringify({ username, password }))
      .then((data) => {
        console.log("here")
        if (data.data !== "Logged in successfully") {
          setError(data.data);
        } else {
          login(username);
          navigate("/main");
        }
      })
      .catch((error) => {
        setError("Error during login.");
        console.error("Error during login:", error);
      })
      .finally(() => {
        setIsLoading(false); // Set isLoading to false when the request is complete
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '8px',
        }}
      >
        <Avatar
          style={{
            margin: '8px',
            backgroundColor: '#1976D2',
          }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <Paper
          elevation={3}
          style={{
            padding: '24px',
            width: '100%',
            marginTop: '24px',
          }}
        >
          {error && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}
          <form>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="text"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              style={{
                margin: '24px 0',
              }}
              onClick={handleLogin}
              disabled={isLoading} // Disable the button when isLoading is true
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" /> // Show loading indicator
              ) : (
                'Login'
              )}
            </Button>
            <Grid container>
              <Grid item>
                <MuiLink href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
      <Box mt={5}>
        <Typography variant="body2" color="textSecondary" align="center">
          Property Of Muck Inc.
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
