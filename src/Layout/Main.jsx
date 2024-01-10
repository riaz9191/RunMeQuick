import React from 'react';
import Navbar from '../Pages/Shared/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Pages/Shared/Footer';
// import { ToastContainer } from 'react-toastify';

const Main = () => {
  return (
    <div >
      <Navbar/>
      <Outlet/>
      {/* <ToastContainer /> */}
      <Footer/>
    </div>
  );
};

export default Main;