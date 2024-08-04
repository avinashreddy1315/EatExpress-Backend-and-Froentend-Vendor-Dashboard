import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { InputAdornment, IconButton, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from '@emotion/styled';
import { API_URL } from '../../data/ApiPath';

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

const ErrorMessage = styled('div')(({ theme }) => ({
  color: 'red',
  fontSize: '15px',
  padding: '10px 0px 7px 0px',
}));

const VendorRegister = ({ switchToLogin}) => {
  const [usernameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const userRegister = async (e) => {
    e.preventDefault();

    const hasErrors = [username, email, password].some(field => field === '');

    setUserNameError(username === '');
    setEmailError(email === '');
    setPasswordError(password === '');

    if (hasErrors) {
      return setErrorMessage('All fields must be entered');
    }

    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/vendor/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      //console.log(response, data)

        setErrorMessage(data.message)
        setEmailError(true)
      if (response.ok) {
        setEmail('');
        setUserName('');
        setPassword('');
        alert('Vendor Registered Successfully');
        
        switchToLogin();
      } else {
        // Handle error message
        if (data.message) {
          setErrorMessage(data.message);
          setEmailError(true);
        } 
      }

    } catch (error) {
      console.log('Registration Failed', error);
      setErrorMessage('Registration failed');
    }
  };

  return (
    <div className="formSection">
      <Box
        sx={{ backgroundColor: 'rgb(249, 248, 248)', padding: '20px', borderRadius: '10px' }}
      >
        <h2 style={{ fontWeight: '600' }}>Vendor Register</h2>
        <form onSubmit={userRegister}>
          <TextField
            type="text"
            error={usernameError}
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setUserName(e.target.value)}
          />

          <TextField
            type="text"
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
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <FormButton type="submit">Register</FormButton>
        </form>
      </Box>
    </div>
  );
};

export default VendorRegister;
