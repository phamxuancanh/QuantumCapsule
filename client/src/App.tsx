import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom'
import routes from 'routes'


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
    </>
  )
}

export default App;
