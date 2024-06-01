/* eslint-disable @typescript-eslint/no-unused-vars */

import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import ROUTES from 'routes/constant'
import { getFromLocalStorage, removeAllLocalStorage, setToLocalStorage } from 'utils/functions'
import { useMemo, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { refresh, signOut } from 'api/post/post.api'
import Cookies from 'js-cookie'
import { PacmanLoader } from 'react-spinners'
interface IAuthRouteProps {
  children: JSX.Element
}

/**
 * A wrapper around the element which checks if the user is authenticated
 * If authenticated, renders the passed element
 * If not authenticated, redirects the user to Login page.
 */
const AuthRoute = ({ children }: IAuthRouteProps) => {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  /**
   * Authentication logic
   * Feel free to modify authentication logic by saving JWT in cookie or localStorage
   */
  const checkTokenValidity = (token: string) => {
    console.log("check")
    try {
      const { exp } = jwtDecode<{ exp: number }>(token)
      console.log(exp * 1000, "token validity")
      console.log(Date.now(), "current time")
      return exp * 1000 > Date.now()
    } catch (error) {
      return false
    }
  }

  const handleTokenRefresh = async () => {
    const tokens = getFromLocalStorage<any>('tokens');
    console.log(tokens, 'tokens')
    if (tokens?.accessToken && checkTokenValidity(tokens.accessToken)) {
      return tokens.accessToken;
    }
    try {
      const response = await refresh({});
      console.log(response, 'refresh response')
      const newAccessToken = response.data.accessToken;
      setToLocalStorage('tokens', JSON.stringify({ accessToken: newAccessToken }));
      return newAccessToken;
    } catch (error) {
      // if (tokens) {
      //   alert('Login session expired. Please login again.');
      // }
      removeAllLocalStorage()
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log('Failed to refresh access token:', error);
      return null;
    }
  };

  useEffect(() => {
    const verifyAuthentication = async () => {
      const validAccessToken = await handleTokenRefresh()
      console.log(validAccessToken)
      setIsAuthenticated(!!validAccessToken)
      setLoading(false)
    }
    if (location.pathname !== ROUTES.login) {
      verifyAuthentication()
    } else {
      setLoading(false)
    }
  }, [location]);

  if (loading) {
    return <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-h-140 tw-mt-20">
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
    /></div>
  }

  if (isAuthenticated && location.pathname === ROUTES.login) {
    return <Navigate to={ROUTES.home} />
  }

  if (!isAuthenticated && location.pathname !== ROUTES.login) {
    return <Navigate to={ROUTES.login} />
  }

  return children
}

export default AuthRoute
