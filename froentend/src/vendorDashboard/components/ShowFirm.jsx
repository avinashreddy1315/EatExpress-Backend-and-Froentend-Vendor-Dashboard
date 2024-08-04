import React, { useEffect, useState } from 'react';
import { UseUserDataAndAuth } from '../data/UserData';
import { Card, CardContent, CardMedia, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from '@emotion/styled';
import { API_URL } from '../data/ApiPath';
import { useOutletContext } from 'react-router-dom';
import AddFirm from './forms/AddFirm';
import { Close } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';

const FirmCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  '&:hover .deleteButton': {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(0)',
  },
}));

const EditButton = styled(IconButton)(({ theme}) =>({
  backgroundColor: 'lightgray',
  width : '40px',
  height : '40px',
  lineHeight : '40px',
  position: 'relative',
  float: 'right',
  right: '10px',
  top: '10px',
  '&:hover' :{
    backgroundColor : 'lightblue'
  }
}))

const Dot = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ category }) => (category === 'non-veg' ? 'red' : 'green')};
  margin-right: 5px;
`;

const DeleteButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'lightgray',
  width: '40px',
  height: '40px',
  opacity: 0,
  visibility: 'hidden',
  position: 'absolute',
  bottom: '15px',
  right: '10px',
  transition: 'opacity 0.3s ease-in, transform 0.3s ease-in, visibility 0.3s ease-in',
  transform: 'translateY(50px)',
  '&:hover': {
    backgroundColor: 'lightgray',
  },
}));

function ShowFirm() {
  const { vendorData, fetchUserData } = UseUserDataAndAuth();
  const { handleOpenDialog, handleCloseDialog } = useOutletContext();
  let navigate = useNavigate();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFirmId, setSelectedFirmId] = useState(null);

  const firmClick = (firmId) => {
    console.log(firmId);
    navigate(`/product/${firmId}`);
  };

  useEffect(() =>{
    console.log(vendorData)
  },[])

  const handleDelete = async () => {
    console.log(`Delete firm with ID: ${selectedFirmId}`);

    try {
      const response = await fetch(`${API_URL}/firm/${selectedFirmId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`Firm deleted successfully`);
        alert('Firm deleted successfully');
        console.log(data);
        fetchUserData();
      } else {
        console.log(`Error: ${data}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpenDeleteDialog(false);
      setSelectedFirmId(null);
    }
  };

  const handleOpenDeleteDialog = (firmId) => {
    setSelectedFirmId(firmId);
    setOpenDeleteDialog(true);
  };

  const handleEditFirmId = (firmData) =>{
    handleOpenDialog(<AddFirm handleCloseDialog={handleCloseDialog} firmData={firmData}/>)
    //console.log(firmId)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2>Firms</h2>
        <Button className='addpfbutton' variant="contained" color="primary" onClick={() => handleOpenDialog(<AddFirm handleCloseDialog={handleCloseDialog} />)}>Add Firm</Button>
      </div>
      
      <div className='showfirm'>
        {vendorData.firm && vendorData.firm.length > 0 ? vendorData.firm.map((item) => (
          <div className='firmcard' key={item._id}>
            <FirmCard onClick={() => firmClick(item._id)}>
              <EditButton>
                <EditIcon onClick={(e) => {e.stopPropagation(), handleEditFirmId(item)}}/>
              </EditButton>
              <CardMedia
                sx={{ height: 120, width: '100%', objectFit: 'cover' }}
                image="images/noimage.jpeg"
                title={item.firmName}
              />
              <CardContent>
                <Typography variant="h5" component="div">{item.firmName}</Typography>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  {item.Category.map((cat, index) =>(
                    <p key={index}>
                    <Dot category={cat} />
                    {cat}
                  </p>
                  )
                  )}
                </div>
                
              </CardContent>
              
              <DeleteButton className="deleteButton" onClick={(e) => { e.stopPropagation(); handleOpenDeleteDialog(item._id); }}>
                <DeleteIcon sx={{ color: 'red' }} />
              </DeleteButton>
            </FirmCard>
          </div>
        )) : <p>No firms available please Add</p>}
      </div>
      
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this firm?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
         <Close/>
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
          <DeleteIcon sx={{ color: 'red' }} />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ShowFirm;
