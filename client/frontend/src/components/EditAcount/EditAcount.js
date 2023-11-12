import React, { useState } from 'react';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  Tab,
  Tabs,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  paper: {
    display: 'flex',
    gap: theme.spacing(2),
    padding: theme.spacing(4),
    alignItems: 'center',
  },
  tabs: {
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  forms: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  errorText: {
    color: 'red',
  },
}));

function EditAccount() {
  

  const navigate = useNavigate();
  const classes = useStyles();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  // State for input fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [confirmNewUsername, setConfirmNewUsername] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationOpen, setVerificationOpen] = useState(false);
  
  // Error states
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [verificationError, setVerificationError] = useState('');

  if (sessionStorage.getItem("loggedIn") !== "true"){
    return (
      <Navigate to = "/login"/>
    )
  }


  const deleteAccount = () => {

    axios.delete("http://localhost:8003/update_user?username=" + sessionStorage.getItem("username")).then((data) => {
      if (data.data === "User deleted successfully") {
        sessionStorage.clear();
        navigate("/login");
      } else {
        console.error("Error deleting user:", data.data);
      }
    })
  }

  
  // Constants for verification code

  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    // Clear errors when switching tabs
    setPasswordError('');
    setUsernameError('');
    setVerificationError('');
  };

  const handlePasswordSubmit = () => {
    if (newPassword === confirmNewPassword) {
      // Prompt for password change verification code
      setVerificationOpen(true);
    } else {
      // Show an error that the passwords do not match
      setPasswordError('Passwords do not match. Please try again.');
    }
  };

  const handleUsernameSubmit = () => {
    if (newUsername === confirmNewUsername) {
      // Prompt for username change verification code
      setVerificationOpen(true);
    } else {
      // Show an error that the usernames do not match
      setUsernameError('Usernames do not match. Please try again.');
    }
  };

  const handleVerificationSubmit = async () => {
    // Clear any previous errors
    setPasswordError('');
    setUsernameError('');
    setVerificationError('');

    // Check which section is currently selected
    if (currentTab === 0) {
      // Password change verification
      if (verificationInput === sessionStorage.getItem("username")) {

        axios.put(`http://localhost:8003/update_user?oldUsername=${sessionStorage.getItem("username")}&username=${sessionStorage.getItem("username")}&newPassword=${newPassword}`).then((data)=>{
          setVerificationOpen(false);

          navigate("/main")
       })
        // Proceed with password change here
      } else {
        // Show an error that verification failed in the alert dialog
        setVerificationError('Verification code is incorrect. Please try again.');
      }
    } else if (currentTab === 1) {
      // Username change verification
      await axios.get(`http://localhost:8003/password?username=${sessionStorage.getItem("username")}`).then((data)=>{
        if (data.data[0] !== verificationInput){
          setVerificationError('Verification code is incorrect. Please try again.');
          return;
        }
        axios.put(`http://localhost:8003/update_user?oldUsername=${sessionStorage.getItem("username")}&username=${newUsername}&newPassword=${data.data[0]}`).then((data)=>{
          setVerificationOpen(false);
          sessionStorage.setItem("username", newUsername);

          navigate("/main")
       })
      })



    }
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <div className={classes.forms}>
          {currentTab === 0 && (
            <>
              <Typography variant="h6">Change Password</Typography>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                variant="outlined"
                margin="normal"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                error={!!passwordError}
              />
              {passwordError && (
                <Typography variant="body2" className={classes.errorText}>
                  {passwordError}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handlePasswordSubmit}
              >
                Submit
              </Button>
            </>
          )}

          {currentTab === 1 && (
            <>
              <Typography variant="h6">Change Username</Typography>
              <TextField
                label="New Username"
                fullWidth
                variant="outlined"
                margin="normal"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <TextField
                label="Confirm New Username"
                fullWidth
                variant="outlined"
                margin="normal"
                value={confirmNewUsername}
                onChange={(e) => setConfirmNewUsername(e.target.value)}
                error={!!usernameError}
              />
              {usernameError && (
                <Typography variant="body2" className={classes.errorText}>
                  {usernameError}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleUsernameSubmit}
              >
                Submit
              </Button>
            </>
          )}

          {/* Verification Dialog */}
          <Dialog
            open={verificationOpen}
            onClose={() => setVerificationOpen(false)}
          >
            <DialogTitle>Verify</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {currentTab === 0
                  ? 'Please enter the username to verify your action.'
                  : 'Please enter the password to verify your action.'}
              </DialogContentText>
              <TextField
                label={currentTab === 0 ? 'Username' : 'Password'}
                fullWidth
                variant="outlined"
                margin="normal"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
              />
              {verificationError && (
                <Typography variant="body2" className={classes.errorText}>
                  {verificationError}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setVerificationOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerificationSubmit}
                color="primary"
              >
                Verify
              </Button>
            </DialogActions>
          </Dialog>
        </div>

        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          orientation="vertical"
          indicatorColor="primary"
          textColor="primary"
          className={classes.tabs}
        >
          <Tab label="Change Password" />
          <Tab label="Change Username" />
        </Tabs>
      </Paper>

      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={handleDeleteDialogOpen}
      >
        Delete Account
      </Button>

      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => deleteAccount()}
            color="secondary"
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EditAccount;
