import Footer from './footer/footer'
import Navbar from './navbar/navbar'
import { Outlet, useLocation } from 'react-router-dom'
import React from 'react'
import Pet from 'components/pet'
import { Box } from '@mui/material'
const Default = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/learning' && <Navbar />}
      <Box minHeight={"85vh"}>
        <Outlet />  
      </Box>
      <Footer />
      <Pet />
    </>
  )
}

export default Default