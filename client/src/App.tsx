import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom'
import routes from 'routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'services/i18n'

const Main = () => {
  const element = useRoutes(routes)
  return element
}

const App = () => {
  return (
    <>
        <BrowserRouter>
            <Main />
        </BrowserRouter>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App;
