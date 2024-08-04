import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, FormControl, FormLabel, FormControlLabel, Checkbox, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { API_URL } from '../../data/ApiPath';
import { UseUserDataAndAuth } from '../../data/UserData';

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
    { label: 'Non-Veg', value: 'non-veg' }
];

const regionOptions = [
    { label: 'South India', value: 'south-india' },
    { label: 'North India', value: 'north-india' },
    { label: 'Chinese', value: 'chinese' },
    { label: 'Bakery', value: 'bakery' }
];

const AddFirm = ({handleCloseDialog, firmData}) => {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const {vendorData, fetchUserData} = UseUserDataAndAuth();

    // data
    const [firmName, setFirmName] = useState('');
    const [Area, setArea] = useState('');
    const [offer, setOffer] = useState('');
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState([]);
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState(''); // State to store the file name


    useEffect(() =>{
        if(firmData){
            console.log('firmData Exsits ' , firmData)
            setFirmName(firmData.firmName)
            setArea(firmData.Area)
            setOffer(firmData.Offer);
            setSelectedCategory(firmData.Category);
            setSelectedRegion(firmData.Region)
        }
    }, [firmData])

    const handleCategoryChange = (event) => {
        const value = event.target.name;
        setSelectedCategory((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleRegionChange = (event) => {
        const value = event.target.name;
        setSelectedRegion((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setImageName(file ? file.name : '');
    };

    const handleAddFirm = async (e) => {
        e.preventDefault();

        // Validation
        if (!firmName || !Area || selectedCategory.length === 0 || selectedRegion.length === 0) {
            //setError(true);
            setErrorMessage('All fields are required');
            return;
        }

        //setError(false);
        setErrorMessage('');

        //console.log(firmName, Area, offer, selectedCategory, selectedRegion, image);

        try {
            const logintoken = localStorage.getItem('loginToken');
            //console.log(logintoken)
            if (!logintoken) {
                console.error('User not Authenticated');
                //setError(true);
                setErrorMessage('User not Authenticated');
                return;
            }

            const formData = new FormData();
            formData.append('firmName', firmName);
            formData.append('Area', Area);
            formData.append('Offer', offer);
            formData.append('Category',selectedCategory);
            formData.append('Region', selectedRegion);
            formData.append('image', image);

            const response = await fetch(firmData ? `${API_URL}/firm/update-firm/${firmData._id}` : `${API_URL}/firm/add-firm`, {
                method: firmData ? 'PATCH' :  'POST',
                headers: {
                    'token': `${logintoken}`, // Pass token in the Authorization header
                  },
                body: formData
            });
            const data = await response.json();
            
            if (response.ok) {
                console.log(data)
                alert(firmData ? 'Firm Updated Successfully' : 'Firm Add Successfully')
                handleCloseDialog();
                fetchUserData()
            }else{
                console.log(data);
                setErrorMessage(data.message);
            }

        } catch (error) {
            console.log(error);
            //setError(true);
            setErrorMessage('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="AddformSection">
            <Box sx={{ backgroundColor: 'rgb(249, 248, 248)', padding: '5px', borderRadius: '10px' }}>
                <h2 style={{ fontWeight: '600' }}>{firmData ? `Updating ${firmData.firmName}` :(vendorData.username ? `Add Firm to ${vendorData.username}` : 'Add Firm')}</h2>
                <form onSubmit={handleAddFirm}>
                    <TextField
                    value={firmName}
                        type='text'
                        error={error}
                        label="Firm Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setFirmName(e.target.value)}
                    />

                    <TextField
                        value={Area}
                        type='text'
                        error={error}
                        label="Area"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setArea(e.target.value)}
                    />

                    <FormControl component="fieldset" sx={{ marginTop: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '20px' }}>
                        <FormLabel component="legend" sx={{ fontWeight: '700', marginRight: '16px' }}>Category</FormLabel>
                        {categoryOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                control={
                                    <Checkbox
                                        checked={selectedCategory.includes(option.value)}
                                        onChange={handleCategoryChange}
                                        name={option.value}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    </FormControl>

                    <FormControl component="fieldset" sx={{ marginTop: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '20px' }}>
                        <FormLabel component="legend" sx={{ fontWeight: '700', marginRight: '16px' }}>Region</FormLabel>
                        {regionOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                control={
                                    <Checkbox
                                        checked={selectedRegion.includes(option.value)}
                                        onChange={handleRegionChange}
                                        name={option.value}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    </FormControl>

                    <TextField
                    value={offer}
                        error={error}
                        label="Offer"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setOffer(e.target.value)}
                    />

                    <TextField
                        type="file"
                        error={error}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={handleImageChange}
                    />
                    {imageName || firmData?.image ? (
                        <Typography variant="body2" color="textSecondary">
                            Selected file: {imageName || firmData.image}
                        </Typography>
                    ) : null}

                    <ErrorMessage>{errorMessage}</ErrorMessage>
                    <FormButton type='submit'>{firmData ? 'Update Firm' : 'Add Firm'}</FormButton>
                </form>
            </Box>
        </div>
    );
};

export default AddFirm;
