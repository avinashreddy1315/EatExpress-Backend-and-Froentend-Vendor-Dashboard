import React, { useEffect, useState } from 'react';
import VendorLogin from './forms/VendorLogin';
import VendorRegistor from './forms/VendorRegistor';
import { UseUserDataAndAuth } from '../data/UserData';
import { useNavigate } from 'react-router-dom';

function NavBar({ handleOpenDialog, switchToLogin, handleCloseDialog }) {
  //const [token, setToken] = useState('')

  const { token, setToken } = UseUserDataAndAuth();
  let navigate = useNavigate();
 


  const handleLogout = () =>{
    console.log('logged out')
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
      {token ? <div className='userauth'><button onClick={handleLogout}>Logout</button> </div> : <div className="userauth">
        <button onClick={() => handleOpenDialog(<VendorLogin handleCloseDialog={handleCloseDialog} />)}>Login</button>
        <span> / </span>
        <button onClick={() => handleOpenDialog(<VendorRegistor switchToLogin={switchToLogin} />)}>Registor</button>
      </div>
      }
      
    </div>
  );
}

export default NavBar;
