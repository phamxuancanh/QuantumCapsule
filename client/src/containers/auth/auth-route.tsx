/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* PRIVATE ROUTE: AUTHENTICATION
   ========================================================================== */
  import { Navigate, useLocation } from 'react-router-dom';
  import ROUTES from 'routes/constant';
  import { getFromLocalStorage, removeAllLocalStorage } from 'utils/functions';
  import { useMemo } from 'react';
  import { jwtDecode } from 'jwt-decode';
  import CryptoJS from 'crypto-js'

  interface IAuthRouteProps {
    children: JSX.Element;
    allowedRoles?: string[];
  }
  
  const AuthRoute = ({ children, allowedRoles }: IAuthRouteProps) => {
    const location = useLocation();
    const tokens = getFromLocalStorage<any>('persist:auth');
    const accessToken = tokens?.accessToken;
  
    // const isAuthenticated = useMemo(() => {
    //   if (!accessToken) return false;
    //   try {
    //     const decodedToken: any = jwtDecode(accessToken);
    //     const currentTime = Date.now() / 1000;
  
    //     if (decodedToken.exp < currentTime) {
    //       alert('Token expired');
    //       removeAllLocalStorage();
    //       return false;
    //     }
  
    //     if (allowedRoles && !allowedRoles.includes(decodedToken.role)) {
    //       alert('Unauthorized');
    //       removeAllLocalStorage();
    //       return false;
    //     }
  
    //     return true;
    //   } catch (error) {
    //     console.error('Invalid token:', error);
    //     alert('Invalid token');
    //     removeAllLocalStorage();
    //     return false;
    //   }
    // }, [accessToken, allowedRoles]);
    const isAuthenticated = useMemo(() => {
      return !!tokens?.accessToken
    }, [tokens?.accessToken])
    
    const publicRoutes = [
      ROUTES.sign_in,
      ROUTES.sign_up,
      ROUTES.forgot_password,
      ROUTES.reset_password,
      ROUTES.email_verify,
      ROUTES.email_verify_send,
      ROUTES.email_verify_success,
      ROUTES.grade_choose,
    ];
  
    if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
      return <Navigate to={ROUTES.sign_in} />;
    }
  
    if (isAuthenticated) {
      const userRoleEncrypted = tokens.currentUser?.key;
      console.log('User role encrypted:', userRoleEncrypted);
      let userRole: string | undefined;
  
      if (userRoleEncrypted) {
        try {
          const decrypted = CryptoJS.AES.decrypt(
            userRoleEncrypted,
            'Access_Token_Secret_#$%_ExpressJS_Authentication'
          );
          userRole = decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          console.error('Decryption error:', error);
        }
      }
  
      console.log('User role:', userRole);
  
      if ((userRole === 'R1' || userRole === 'R2') && location.pathname !== ROUTES.admin) {
        return <Navigate to={ROUTES.admin} />
      }
  
      if (userRole !== 'R1' && userRole !== 'R2' && location.pathname === ROUTES.admin) {
        return <Navigate to={ROUTES.home} />
      }
  
      if (userRole !== 'R1' && userRole !== 'R2' && !tokens.currentUser?.grade && location.pathname !== ROUTES.grade_choose) {
        return <Navigate to={ROUTES.grade_choose} />
      }
    }
    return <>{children}</>;
  };
  
  export default AuthRoute;