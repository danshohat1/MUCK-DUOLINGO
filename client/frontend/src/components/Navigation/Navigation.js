import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import { AccountCircle, PersonAdd } from '@mui/icons-material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useAuth } from '../../AuthContext';

function Navigation() {
  const [anchorEl, setAnchorEl] = useState(null);
  const {isLoggedIn, logout} = useAuth();

  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
  }
  const open = Boolean(anchorEl);



  return (
    <AppBar id = "navbar" position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          <TranslateIcon /> Muck
        </Typography>
        {isLoggedIn ? (
          <div>
            <IconButton
              color="inherit"
              aria-label="account"
              aria-controls="account-menu"
              aria-haspopup="true"
              onClick={handleAccountClick}
            >
              <AccountCircle />
            </IconButton>
            <Popover
              id="account-menu"
              open={open}
              anchorEl={anchorEl}
              onClose={handleAccountClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Button color="inherit" component={Link} to="/edit-account" onClick = {() =>  setAnchorEl(null)}>
                Edit Account
              </Button>
              <Button color="inherit" component={Link} to="/login" onClick={handleLogout}>
                Logout
              </Button>
            </Popover>
          </div>
        ) : (
          <div>
            <Button color="inherit" component={Link} to="/login" startIcon={<AccountCircle />}>
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup" startIcon={<PersonAdd />}>
              Signup
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
