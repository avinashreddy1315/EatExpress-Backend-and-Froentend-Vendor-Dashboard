import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { UseUserDataAndAuth } from '../data/UserData';
import { API_URL } from '../data/ApiPath';
import AddProduct from './forms/AddProduct';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from '@emotion/styled';
import { Card, CardContent, CardMedia, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import noimage from '../../../public/images/noimage.jpeg';
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

const EditButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'lightgray',
  width: '40px',
  height: '40px',
  lineHeight: '40px',
  position: 'relative',
  float: 'right',
  right: '10px',
  top: '10px',
  '&:hover': {
    backgroundColor: 'lightblue'
  }
}));

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

const Dot = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ category }) => (category === 'Non-Veg' ? 'red' : 'green')};
  margin-right: 5px;
`;

function Products() {
  const { firmId } = useParams();
  const { token } = UseUserDataAndAuth();
  const [productData, setProductData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { handleOpenDialog, handleCloseDialog } = useOutletContext();
  const [editproduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (token) {
      fetchProductByFirmId();
    }
  }, [token]);

  const fetchProductByFirmId = async () => {
    try {
      const response = await fetch(`${API_URL}/product/get-products/${firmId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProductData(data);
        //console.log(data.products);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/product/${selectedProductId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`Product deleted successfully`);
        alert('Product deleted successfully');
        console.log(data);
        fetchProductByFirmId(); // Refetch products after deletion
      } else {
        console.log(`Error: ${data}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpenDialog(false);
      setSelectedProductId(null);
    }
  };

  const handleOpenDeleteDialog = (productId) => {
    setSelectedProductId(productId);
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
  };

  const handleEditProduct = (product) => {
    handleOpenDialog( <AddProduct 
      handleCloseDialog={handleCloseDialog} 
      firmId={firmId} 
      firmName={productData.resturentName} 
      fetchProductByFirmId={fetchProductByFirmId}
      productData = {product} />)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>{productData.resturentName ? `${productData.resturentName} Products` : 'Products'}</h1>
        <Button className='addpfbutton' variant="contained" color="primary" onClick={() => handleOpenDialog(<AddProduct handleCloseDialog={handleCloseDialog} firmId={firmId} firmName={productData.resturentName} fetchProductByFirmId={fetchProductByFirmId} />)}>
          Add Product
        </Button>
      </div>
      <div className='showProduct'>
        {productData.products && productData.products.length > 0 ? (
          productData.products.map((item) => (
            <div className='productcard' key={item._id}>
              <FirmCard>
                <EditButton>
                  <EditIcon onClick={(e) => { e.stopPropagation(), handleEditProduct(item) }} />
                </EditButton>
                <CardMedia
                  sx={{ height: 130, width: '100%', objectFit: 'fill' }}
                  image={noimage}
                  title={item.Productname}
                />
                <CardContent>
                  <Typography variant="h6" component="div">{item.Productname}</Typography>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Dot category={item.category} />
                    <p>{item.category}</p>
                  </div>
                </CardContent>
                <DeleteButton className="deleteButton" onClick={(e) => { e.stopPropagation(); handleOpenDeleteDialog(item._id); }}>
                  <DeleteIcon sx={{ color: 'red' }} />
                </DeleteButton>
              </FirmCard>
            </div>
          ))
        ) : (
          <p>No Products available for this firm</p>
        )}
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            <Close />
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            <DeleteIcon sx={{ color: 'red' }} />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Products;