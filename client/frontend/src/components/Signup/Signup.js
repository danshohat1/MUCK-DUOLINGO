import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import { Button, Container, CssBaseline, TextField, Typography, Grid, Link as MuiLink, Box, Avatar, Paper, Alert} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  const handleSignUp = () => {

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }
    
    axios.post("http://localhost:8002/signup" , JSON.stringify({username: username, password: password})).then((data) =>{
      if(data.data !== "user created"){
        setError(data.data)
      }
      else{
        sessionStorage.setItem("username", username);
        navigate("/login")
      }
    })
    
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
          Sign Up
        </Typography>
        <Paper
          elevation={3} // Add elevation to create a frame
          style={{
            padding: '24px', // Adjust padding as needed
            width: '100%',
            marginTop: '24px',
          }}
        >
          {error && ( // Render error message if error is not null
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              style={{
                margin: '24px 0',
              }}
              onClick={handleSignUp}
            >
              Sign In
            </Button>
            <Grid container>

              <Grid item>
                <MuiLink href="/login" variant="body2">
                  {"Already Have An Acount? Log In"}
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
