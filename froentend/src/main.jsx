import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom'
import { UserDataAndAuthContextProvider } from './vendorDashboard/data/UserData.jsx';


const theme = createTheme({
  // Custom theme settings (if any)
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <UserDataAndAuthContextProvider>
        <App />
        </UserDataAndAuthContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
