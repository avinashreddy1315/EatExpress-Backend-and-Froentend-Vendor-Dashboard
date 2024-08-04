import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { InputAdornment, IconButton, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from '@emotion/styled';
import { API_URL } from '../../data/ApiPath';
import { UseUserDataAndAuth } from '../../data/UserData';
import { Navigate, useNavigate } from 'react-router-dom';

const FormButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'orange',
  color: 'black',
  float: 'right',
  margin: '15px 0px',
  '&:hover': {
    backgroundColor: 'darkorange',
    color: 'white',
  },
}));

const ErrorMessage = styled('div')(({theme}) => ({
  color : 'red',
  fontSize : '15px',
  padding : '10px 0px 7px 0px',
}));

function VendorLogin({ handleCloseDialog }) {
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const { setToken } = UseUserDataAndAuth();

  let navigate = useNavigate()

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async(e) =>{
    e.preventDefault();
    const hasErrors = [email, password].some(field => field === '');
    setEmailError(email === '');
    setPasswordError(password === '');

    if (hasErrors) {
      return setErrorMessage('All fields must be entered');
    }

    setErrorMessage('');
    try {
      const response = await fetch(`${API_URL}/vendor/login`, {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });
      const data = await response.json();
      //console.log(data);
      if(response.ok){
        setEmail('');
        setPassword('');
        alert(data.succes);
        localStorage.setItem('loginToken' , data.token)  // is to set the localstorage for loginToken
        setToken(localStorage.getItem('loginToken')); //is to set the token for user data
        handleCloseDialog(); 
        navigate('/')
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.log('login failed', error);
      setErrorMessage('Login failed, please try again.');
    }
  };

  return (
    <div className="formSection" style={{height : '300px'}}>
      <Box sx={{ backgroundColor: 'rgb(249, 248, 248)', padding : '20px', borderRadius : '10px' }}>
        <h2 style={{fontWeight : '600'}}>Vendor Login</h2>
        <form onSubmit={handleLogin}>
          <TextField
            type='text'
            error={emailError}
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            error={passwordError}
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <FormButton type='submit'>Login</FormButton>
        </form>
      </Box>
    </div>
  );
}

export default VendorLogin;
