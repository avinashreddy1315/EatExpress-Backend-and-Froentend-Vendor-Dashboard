import React, { useEffect, useState } from 'react';
import VendorLogin from './forms/VendorLogin';
import VendorRegistor from './forms/VendorRegistor';
import { UseUserDataAndAuth } from '../data/UserData';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Close } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';

function NavBar({ handleOpenDialog, switchToLogin, handleCloseDialog }) {
  //const [token, setToken] = useState('')

  const { token, setToken } = UseUserDataAndAuth();
  let navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };
 


  const handleLogout = () =>{
    console.log('logged out')
    setOpenDeleteDialog(false)
    localStorage.removeItem('loginToken')  // to remove the logintoken from localstorage
    //console.log(localStorage.getItem('loginToken'))
    setToken('') // to set back the token to empty
    navigate('/');
  }
  return (
    <div className="navSection">
      <div className="company">
        <img id='eatexpress_logo' src='/images/eatexpress.jpg' alt="EatExpress" />
      </div>
      {token ? <div className='userauth'><button onClick={handleOpenDeleteDialog}>Logout</button> </div> : <div className="userauth">
        <button onClick={() => handleOpenDialog(<VendorLogin handleCloseDialog={handleCloseDialog} />)}>Login</button>
        <span> / </span>
        <button onClick={() => handleOpenDialog(<VendorRegistor switchToLogin={switchToLogin} />)}>Registor</button>
      </div>
      }
      <Dialog
      open={openDeleteDialog}
      onClose={() => setOpenDeleteDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
         <Close/>
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
          <LogoutIcon sx={{ color: 'red' }} />
          </Button>
        </DialogActions>

      </Dialog>
      
    </div>
  );
}

export default NavBar;
