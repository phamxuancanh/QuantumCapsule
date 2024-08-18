/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PRIVATE ROUTE: AUTHENTICATION
   ========================================================================== */

   import { Navigate, useLocation, useNavigate } from 'react-router-dom'
   import ROUTES from 'routes/constant'
   import { getFromLocalStorage } from 'utils/functions'
   import { useMemo, useState, useEffect } from 'react'
  //  import CryptoJS from 'crypto-js'
   
   interface IAuthRouteProps {
     children: JSX.Element
     allowedRoles?: string[]
   }
   
   const AuthRoute = ({ children, allowedRoles }: IAuthRouteProps) => {
     const location = useLocation()
     const tokens = getFromLocalStorage<any>('persist:auth')
     const userRole = tokens?.key
     let data
    //  if (userRole) {
    //    try {
    //      const giaiMa = CryptoJS.AES.decrypt(userRole, 'Access_Token_Secret_#$%_ExpressJS_Authentication')
    //      data = giaiMa.toString(CryptoJS.enc.Utf8)
    //    } catch (error) {
    //      console.error('Decryption error:', error)
    //    }
    //  }
     const isAuthenticated = useMemo(() => {
       return !!tokens?.accessToken
     }, [tokens?.accessToken])
     if (isAuthenticated && location.pathname === ROUTES.sign_in) {
       return <Navigate to={ROUTES.home} />
     }
     if (!isAuthenticated && location.pathname !== ROUTES.sign_in && location.pathname !== ROUTES.sign_up) {
       return <Navigate to={ROUTES.sign_in} />
     }
    //  if (allowedRoles && data && !allowedRoles.includes(data)) {
    //    return <Navigate to={ROUTES.notfound} />
    //  }
   
     return (
          <>
            {children}
          </>
     )
   }
   export default AuthRoute
   