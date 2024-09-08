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
    const location = useLocation();
    const tokens = getFromLocalStorage<any>('persist:auth');
    const userRole = tokens?.key;
  
    const isAuthenticated = useMemo(() => {
      return !!tokens?.accessToken;
    }, [tokens?.accessToken]);
  
    const publicRoutes = [ROUTES.sign_in, ROUTES.sign_up, ROUTES.forgot_password, ROUTES.reset_password, ROUTES.email_verify, ROUTES.email_verify_send, ROUTES.email_verify_success];
  
    if (isAuthenticated && location.pathname === ROUTES.sign_in) {
      return <Navigate to={ROUTES.home} />;
    }
  
    if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
      return <Navigate to={ROUTES.sign_in} />;
    }
  
    return <>{children}</>;
  };
   export default AuthRoute
   