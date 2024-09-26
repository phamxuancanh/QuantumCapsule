import Footer from './footer/footer'
import Navbar from './navbar/navbar'
import { Outlet, useLocation } from 'react-router-dom'
import React from 'react'

const Default = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/learning' && <Navbar />}
      <Outlet />
      <Footer />
    </>
  )
}

export default Default