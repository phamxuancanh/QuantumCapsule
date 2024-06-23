/* eslint-disable @typescript-eslint/no-unused-vars */

import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import ROUTES from 'routes/constant';
import { getFromLocalStorage, removeAllLocalStorage, setToLocalStorage } from 'utils/functions';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Sửa lại import từ 'jwt-decode'
import { refresh } from 'api/post/post.api';
import Cookies from 'js-cookie';
import { PacmanLoader } from 'react-spinners';

interface IAuthRouteProps {
  children: JSX.Element;
}

/**
 * A wrapper around the element which checks if the user is authenticated
 * If authenticated, renders the passed element
 * If not authenticated, redirects the user to Login page.
 */
const AuthRoute = ({ children }: IAuthRouteProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  /**
   * Authentication logic
   * Feel free to modify authentication logic by saving JWT in cookie or localStorage
   */
  const checkTokenValidity = (token: string) => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  const handleTokenRefresh = async () => {
    const tokens = getFromLocalStorage<any>('tokens');
    if (tokens?.accessToken && checkTokenValidity(tokens.accessToken)) {
      return tokens.accessToken;
    }
    try {
      console.log('Refreshing token');
      const response = await refresh({});
      console.log(response)
      const newAccessToken = response.data.accessToken;
      setToLocalStorage('tokens', JSON.stringify({ accessToken: newAccessToken })); // Convert object to JSON string
      return newAccessToken;
    } catch (error) {
      removeAllLocalStorage();
      Cookies.remove('refreshToken'); // Sử dụng Cookies.remove thay vì document.cookie
      return null;
    }
  };

  useEffect(() => {
    const verifyAuthentication = async () => {
      const validAccessToken = await handleTokenRefresh()
      setIsAuthenticated(!!validAccessToken)
      setLoading(false)
    }
    if (location.pathname !== ROUTES.sign_in) {
      verifyAuthentication()
    } else {
      setLoading(false)
    }
  }, [location])

  // Kiểm tra và lưu accessToken từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const accessToken = params.get('accessToken')
    if (accessToken) {
      setToLocalStorage('tokens', JSON.stringify({ accessToken }))
      setIsAuthenticated(true)
      navigate(ROUTES.home)
    }
  }, [location])

  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-140 tw-mt-20">
        <PacmanLoader
          className='tw-flex tw-justify-center tw-items-center tw-w-full tw-mt-20'
          color='#5EEAD4'
          cssOverride={{
            display: 'block',
            margin: '0 auto',
            borderColor: 'blue'
          }}
          loading
          margin={10}
          speedMultiplier={3}
          size={40}
        />
      </div>
    );
  }

  if (isAuthenticated && location.pathname === ROUTES.sign_in) {
    return <Navigate to={ROUTES.home} />;
  }

  if (!isAuthenticated && location.pathname !== ROUTES.sign_in && location.pathname !== ROUTES.forgot_password && location.pathname !== ROUTES.email_verify && location.pathname !== ROUTES.email_verify_success && location.pathname !== ROUTES.email_verify_send && location.pathname !== ROUTES.sign_up && location.pathname !== ROUTES.reset_password) {
    return <Navigate to={ROUTES.sign_in} />;
  }

  return children;
};

export default AuthRoute;
