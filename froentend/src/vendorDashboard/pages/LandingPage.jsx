import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import VendorLogin from '../components/forms/VendorLogin';
import Slide from '@mui/material/Slide';
import { Close } from '@mui/icons-material';
import { UseUserDataAndAuth } from '../data/UserData';
import { Outlet } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const LandingPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const { token, setToken, vendorData } = UseUserDataAndAuth();

  useEffect(() => {
    setToken(localStorage.getItem('loginToken'));
  }, []);

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const switchToLogin = () => {
    handleCloseDialog();
    handleOpenDialog(<VendorLogin handleCloseDialog={handleCloseDialog} />);
  };

  return (
    <section className="landingsection">
      <NavBar handleOpenDialog={handleOpenDialog} switchToLogin={switchToLogin} handleCloseDialog={handleCloseDialog} />
      <div className="forms">
        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
          <DialogContent sx={{ backgroundColor: 'rgb(249, 248, 248)', overflow: 'hidden' }}>
            <IconButton sx={{ float: 'right' }} onClick={handleCloseDialog}>
              <Close />
            </IconButton>
            {dialogContent}
          </DialogContent>
        </Dialog>
      </div>
      <div className="collectionsection" style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: '250px' }}>
          <SideBar handleOpenDialog={handleOpenDialog} handleCloseDialog={handleCloseDialog} />
        </div>
        <div style={{ width: '75%', padding: '16px' }}>
          {token ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '500' }}>{vendorData.username ? `${vendorData.username} Dashboard` : 'Dashboard'}</h1>
              <div>
                <Outlet context={{ handleOpenDialog, handleCloseDialog }} />
              </div>
            </div>
          ) : (
            <p>Please Login</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
