import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, Switch, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../data/ApiPath';

const FormButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'orange',
    color: 'black',
    float: 'right',
    margin: '15px 0px'
}));

const ErrorMessage = styled('div')(({ theme }) => ({
    color: 'red',
    fontSize: '15px',
    padding: '10px 0px 7px 0px',
}));

const categoryOptions = [
    { label: 'Veg', value: 'veg' },
    { label: 'Non-Veg', value: 'Non-Veg' }
];

const AddProduct = ({ handleCloseDialog, firmId, firmName, fetchProductByFirmId, productData }) => {


    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');



    const [Productname, setProductname] = useState('');
    const [price, setPrice] = useState();
    const [image, setImage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [description, setDescription] = useState('');
    const [bestseller, setBestseller] = useState(false);
    const [OutofStock, setOutofStock] = useState(false);
    const [imageName, setImageName] = useState(''); // State to store the file name



    useEffect(() => {
        if (productData) {
            console.log(productData)
            setProductname(productData.Productname)
            setPrice(productData.price)
            setSelectedCategory(productData.category)
            setDescription(productData.description)
            setBestseller(productData.BestSeller)
            setOutofStock(productData.OutofStock)

        }
    }, [productData])


    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setImageName(file ? file.name : '');
    };

    const handleBestsellerChange = (event) => {
        setBestseller(event.target.checked);
    };

    const handleOutOfStockChange = (event) => {
        setOutofStock(event.target.checked)
    }


    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!Productname || !price || !selectedCategory) {
            //setError(true);
            setErrorMessage('All fields are required');
            return;
        }

        try {
            setErrorMessage('');
            const formData = new FormData();
            formData.append('Productname', Productname);
            formData.append('price', price);
            formData.append('image', image);
            formData.append('category', selectedCategory);
            formData.append('description', description);
            formData.append('BestSeller', bestseller);
            formData.append('OutofStock', OutofStock);

            //console.log(formData);

            const response = await fetch(productData ? `${API_URL}/product/update-product/${productData._id}` : `${API_URL}/product/add-product/${firmId}`, {
                method: productData ? 'PATCH' : 'POST',
                body: formData
            });
            const data = await response.json();

            if (response.ok) {
                //console.log(data)
                alert(productData ? 'Product Updated Succefully' : 'Product Add Successfully')
                handleCloseDialog();
                fetchProductByFirmId()
            } else {
                //console.log(data);
                setErrorMessage(data.message);
            }

        } catch (error) {
            console.log(error);
            //setError(true);
            setErrorMessage('Something went wrong. Please try again later.');
        }



        //setError(false);

        //console.log(firmId)
        //console.log(Productname, price, selectedCategory, image, description, bestseller);

    }

    return (
        <div className="AddformSection" style={{ width: '100%' }}>
            <Box sx={{ backgroundColor: 'rgb(249, 248, 248)', padding: '5px', borderRadius: '10px' }}>
                <h2 style={{ fontWeight: '600' }}>
                    {productData ? `Updating ${productData.Productname}` : (firmName ? `Adding Product To ${firmName}` : 'Adding Product')}
                </h2>

                <form onSubmit={(e) => handleAddProduct(e)}>
                    <TextField
                        value={Productname}
                        type='text'
                        error={error}
                        label="Product Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setProductname(e.target.value)}
                    />

                    <TextField
                        value={price}
                        type='text'
                        error={error}
                        label="Price"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <FormControl component="fieldset" sx={{ marginTop: '6px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '20px' }}>
                        <FormLabel component="legend" sx={{ fontWeight: '700', marginRight: '16px' }}>Category</FormLabel>
                        <RadioGroup
                            aria-label="category"
                            name="category"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            row
                        >
                            {categoryOptions.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>

                    <div style={{ display: 'flex' }}>

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <FormControlLabel
                                control={<Switch checked={bestseller} onChange={handleBestsellerChange} />}
                                label="Bestseller"
                            />
                        </FormControl>

                        <FormControl fullWidth variant="outlined" margin="normal">
                            <FormControlLabel
                                control={<Switch checked={OutofStock} onChange={handleOutOfStockChange} />}
                                label="Out Of Stock"
                            />
                        </FormControl>
                    </div>
                    <TextField
                        value={description}
                        type='text'
                        error={error}
                        label="Description"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <TextField
                        type="file"
                        error={error}
                        label="Upload Image"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleImageChange}
                    />
                    {imageName || productData?.image ? (
                        <Typography variant="body2" color="textSecondary">
                            Selected file: {imageName || productData.image}
                        </Typography>
                    ) : null}


                    <ErrorMessage>{errorMessage}</ErrorMessage>
                    <FormButton type='submit'>{productData ? 'Edit Product' : 'Add Product'}</FormButton>
                </form>
            </Box>
        </div>
    );
};

export default AddProduct;

