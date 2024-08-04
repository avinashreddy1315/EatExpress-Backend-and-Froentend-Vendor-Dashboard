import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './vendorDashboard/pages/LandingPage';
import './App.css';
import NotFound from './vendorDashboard/components/errorPages/NotFound';
import Welcome from './vendorDashboard/components/Welcome';
import ShowFirm from './vendorDashboard/components/ShowFirm';
import Products from './vendorDashboard/components/Products';
import Profile from './vendorDashboard/components/Profile';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage />}>
          <Route index element={<Welcome />} /> {/* Default route */}
          <Route path='firms' element={<ShowFirm />} />
          <Route path='product/:firmId' element={<Products />} />
          <Route path= 'profile' element={<Profile />}/>
        </Route>
        <Route path='*' element={<NotFound />} /> {/* Handle all other unmatched routes */}
      </Routes>
    </div>
  );
}

export default App;
