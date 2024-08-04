import React, { useState } from 'react';
import { ListItemButton, ListItemText, List, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import styled from '@emotion/styled';
import AddProduct from '../components/forms/AddProduct';  // Ensure you have the correct path
import AddFirm from './forms/AddFirm';
import { UseUserDataAndAuth } from '../data/UserData';
import { Link, useNavigate } from 'react-router-dom';


const SideBar = ({ handleOpenDialog, handleCloseDialog }) => {
  const [open, setOpen] = useState(false);
  const {token} = UseUserDataAndAuth();

  let navigate = useNavigate()

  const handleopen = () => {
    setOpen(!open);
  };

  const CollapseListButton = styled(ListItemButton)(({ theme }) => ({
    paddingLeft: theme.spacing(10),
  }));

  const CollapseList = styled(Collapse)(({ theme }) => ({
    height: '200px',
    overflowY: 'auto',
  }));
  const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
  }));

  const ListButton = styled(ListItemButton)(({ theme }) => ({
    paddingLeft: theme.spacing(5),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '18px',
  }));

  const ListText = styled(ListItemText)(({ theme }) => ({
    '& .MuiTypography-root': {
      fontSize: '25px',
      fontWeight: '500',
    },
    marginBottom: '18px',
  }));

  const CollapswListText = styled(ListItemText)(({ theme }) => ({
    '& .MuiTypography-root': {
      fontSize: '20px',
      fontWeight: '1.5rem',
      color: 'gray',
    },
    marginBottom: '7px',
  }));


  const openDialog = (e) =>{
    if(token){
      handleOpenDialog(e);
    }else{
      alert('please login')
    }
  }

  return (
    <div>
      <div className="sidebarSection">
     
          
        <List sx={{ paddingTop: '25px' }}>
        <ListButton onClick={() => navigate('/')}>
            <ListText primary="Home" />
        </ListButton>
          <ListButton onClick={() => openDialog(<AddFirm handleCloseDialog={handleCloseDialog}/>) }>
            <ListText primary="Add Firm" />
        </ListButton>
          {/*<ListButton onClick={() => openDialog(<AddProduct/>)}>
            <ListText primary="Add Product" />
  </ListButton> */}
          <StyledLink to='firms'><ListButton onClick={handleopen}>
            <ListText primary="Show Firms" />
            {/*{open ? <ExpandLess /> : <ExpandMore />} */}
          </ListButton></StyledLink>
          {/*<CollapseList in={open} timeout="auto" unmountOnExit>
            <List component="div">
              <CollapseListButton>
                <CollapswListText primary="first firm" />
              </CollapseListButton>
              <CollapseListButton>
                <CollapswListText primary="second firm" />
              </CollapseListButton>
              <CollapseListButton>
                <CollapswListText primary="third firm" />
              </CollapseListButton>
              <CollapseListButton>
                <CollapswListText primary="third firm" />
              </CollapseListButton>
              <CollapseListButton>
                <CollapswListText primary="third firm" />
              </CollapseListButton>
            </List>
  </CollapseList> */}
          <StyledLink to={'profile'}><ListButton >
            <ListText primary="Profile" />
          </ListButton></StyledLink>
        </List>
      </div>
    </div>
  );
};

export default SideBar;
