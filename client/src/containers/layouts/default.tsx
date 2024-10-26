import Footer from './footer/footer'
import Navbar from './navbar/navbar'
import { Outlet, useLocation } from 'react-router-dom'
import React from 'react'
import Pet from 'components/pet'
const Default = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/learning' && <Navbar />}
      <Outlet />
      <Footer />
      <Pet />
    </>
  )
}

export default Default