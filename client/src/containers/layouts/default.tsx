import Footer from './footer/footer'
import Navbar from './navbar/navbar'
import { Outlet } from 'react-router-dom'
import React from 'react'

const Default = () => {
  return (
    <>
      <Navbar />
        <Outlet />
      <Footer />
    </>
  )
}

export default Default
