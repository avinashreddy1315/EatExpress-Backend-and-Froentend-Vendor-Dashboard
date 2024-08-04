import React, { useEffect, useState } from 'react'
import { UseUserDataAndAuth } from '../data/UserData';
import { DeleteForever } from '@mui/icons-material';
import {TextField, Tooltip, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Alert} from '@mui/material';
import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useNavigate} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { Close } from '@mui/icons-material';
import { API_URL } from '../data/ApiPath';
import SaveIcon from '@mui/icons-material/Save';

const DeleteButton = styled(Button)(({ theme }) => ({
  '&: hover': {
    backgroundColor: 'transparent'
  }

}));

const ErrorMessage = styled('div')(({ theme }) => ({
  color: 'red',
  fontSize: '15px',
  padding: '10px 0px 7px 0px',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  fontSize: '22px',
  marginLeft: '20px',
}));


const EditButton = styled(Button)(({ theme }) => ({
  '&: hover': {
    backgroundColor: 'transparent'
  }

}));

const SaveButton = styled(Button)(({ theme }) => ({
  '&: hover': {
    backgroundColor: 'transparent'
  },
  display: 'flex',
  gap: '5px'

}));

const FieldsDiv = styled.div`
  display: flex;
  align-items: center;
  gap : 15px;
  padding: 10px;
`;

const FirmDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: '300px';
  overflowY: 'scroll';
`

const Heading = styled(Typography)(({ theme}) => ({
  fontSize : '20px',
  color : 'gray',
  
}));

const Data = styled(Typography)(({ theme}) => ({
  fontSize : '20px'
}));



function Profile() {

  const [edit, setEdit] = useState(false)
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  let navigate = useNavigate
  


  const { vendorData, token, setToken, fetchUserData  } = UseUserDataAndAuth();

  useEffect(() =>{
    if(vendorData){
      setEmail(vendorData.email);
      setUserName(vendorData.username)
    }
  }, [vendorData])

  const handleVendorDelete = async () =>{
    console.log(vendorData._id)
    try {
      const response = await fetch(`${API_URL}/vendor/delete-vendor/${vendorData._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`Vendor deleted successfully`);
        alert('Vendor deleted successfully');
        console.log(data);
        localStorage.removeItem('loginToken')
        setToken('') // to set back the token to empty
        navigate('/')
        //fetchProductByFirmId(); // Refetch products after deletion
      } else {
        console.log(`Error: ${data}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpenDialog(false);
    }
  }
  
  const handleVendorSave = async () => {
    if (!userName || !email) {
      setErrorMessage('All fields are required');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email && !emailPattern.test(email)){
      setErrorMessage('Invalid Emil formate');
      return;
    }

    try {
      setErrorMessage('');
      const response = await fetch(`${API_URL}/vendor/vendor-update/${vendorData._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert('Vendor Details Updated Successfully');
        setToken(localStorage.getItem('loginToken'));
        fetchUserData();
        setEdit(false);
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };



  const handleOpenDeleteDialog = () => {
    //setSelectedProductId(productId);
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Profile</h2>
        {edit ? (
          <div>
            <SaveButton onClick={() => handleVendorSave()}><SaveIcon/> <span>Save</span></SaveButton>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: '' }}>
            <EditButton onClick={() => setEdit(true)}>
              <Tooltip title={<span style={{fontSize : '16px', padding : '5px'}}>Edit</span>} arrow>
                <EditIcon />
              </Tooltip >
            </EditButton>
            <DeleteButton  onClick={() => handleOpenDeleteDialog()}>
              <Tooltip title={<span style={{fontSize : '16px', padding : '5px'}}>Delete</span>} arrow>
                <DeleteForever sx={{ color: 'red', fontSize: '35px' }} />
              </Tooltip>
            </DeleteButton>
          </div>
        )}

      </div>

        <FieldsDiv>
          <Heading>Email :</Heading>
          {edit ? <div>
            <TextField 
              value={email} 
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{width : '300px'}}
              onChange={(e) => setEmail(e.target.value)}/>

          </div> : <Data>{vendorData?.email ? `${vendorData.email}` : `N/A` }</Data>}
          
        </FieldsDiv>

        <FieldsDiv>
          <Heading>UserName :</Heading>
          {edit ? <div>
            <TextField 
              value={userName} 
              label="userName"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{width : '300px'}}
              onChange={(e) => setUserName(e.target.value)}/>

          </div> : <Data>{vendorData?.username ? `${vendorData.username}` : 'N/A'}</Data>}
          <ErrorMessage>{errorMessage}</ErrorMessage>
          
        </FieldsDiv>

        <h3 style={{color : 'black'}}>Your Firms</h3>

        <FirmDiv>
            {vendorData.firm ? vendorData.firm.map((item, index) =>
          <StyledLink to={`/product/${item._id}`} >{`${index + 1}. ${item.firmName}`} </StyledLink>) : 'No firms'}
        </FirmDiv>

        <Dialog
        open={openDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete all your details?
         <Alert severity="warning">
            This action is irreversible and will permanently delete all your data.
            <p>All your firms and products will be removed.</p>
          </Alert>
        </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            <Close />
          </Button>
          <Button onClick={handleVendorDelete} color="primary" autoFocus>
            <DeleteIcon sx={{ color: 'red' }} />
          </Button>
        </DialogActions>
      </Dialog>
        
    </div>
  )
}

export default Profile
