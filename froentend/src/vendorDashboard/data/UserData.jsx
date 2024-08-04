import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from './ApiPath';

// Create the context
const UserDataAndAuthContext = createContext();

// Context provider component
export const UserDataAndAuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [vendorData, setVendorData] = useState({})

  useEffect(() =>{
    const t = localStorage.getItem('loginToken');
    setToken(t);
  },[])


  const fetchUserData = async () =>{
    try {
      const response = await fetch(`${API_URL}/vendor/get-vendor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': `${token}`, // Pass token in the Authorization header
        },
      });

      const data = await response.json();

      if (response.ok) {
        setVendorData(data.vendorData);
        console.log(data.vendorData)
      }else{
        alert('please login again')
        setToken('')
        console.log(data);
      }
    } catch (error) {
      console.log('login failed', error);
    }
  }



  useEffect(() =>{
    if(token){
      fetchUserData()
    }
  }, [token])



  

  const contextValue = { token, setToken, vendorData, fetchUserData};

  return (
    <UserDataAndAuthContext.Provider value={contextValue}>
      {props.children}
    </UserDataAndAuthContext.Provider>
  );
};

// Custom hook to use the context
export const UseUserDataAndAuth = () => useContext(UserDataAndAuthContext);
