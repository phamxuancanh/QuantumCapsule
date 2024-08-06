/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import axios, { AxiosError } from 'axios'
import { getFromLocalStorage, setToLocalStorage, removeAllLocalStorage, reload } from 'utils/functions'
import { refresh } from 'api/user/api'
// import { useTranslation } from 'services/i18n'
// import Swal from 'sweetalert2'
// import { t } from 'i18next'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom'
// import ROUTES from 'routes/constant'
// import { useNavigate } from 'react-router-dom'
// import ROUTES from 'routes/constant'
// const navigate = useNavigate()
interface IBaseErrorResponse {
  code: string
  status: number
  message: string
}
// const navigate = useNavigate()
/**
 * Authenticated Request Interceptors config
 */
export const requestWithJwt = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 10000,
  withCredentials: false
})

const checkTokenValidity = (token: string) => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token)
    console.log(exp*1000 > Date.now(), 'exp')
    return exp * 1000 > Date.now()
  } catch (error) {
    return false
  }
}

requestWithJwt.interceptors.response.use(
  (response) => {
    console.log('Request successful');
    return response;
  },
  async (error: AxiosError<IBaseErrorResponse>) => {
    const originalRequest: any = error.config;

    // If the request fails with a 401 and it hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // Set the retry flag

      try {
        const newAccessToken = await handleTokenRefresh();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return requestWithJwt(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        alert('Session expired. Please login again');
        toast.error('Session expired. Please login again');
        removeAllLocalStorage();
        reload();
        return Promise.reject(refreshError);
      }
    }

    if (!error.response?.data) {
      console.error('Unknown server error');
      return Promise.reject({
        code: 'Unknown',
        status: 500,
        message: 'Server error',
      });
    }

    return Promise.reject(error.response.data);
  }
);

const handleTokenRefresh = async () => {
  console.log('handleTokenRefresh');
  const tokens = getFromLocalStorage<any>('persist:auth');
  
  if (!tokens) {
    console.warn('No tokens found in local storage');
    return null;
  }

  if (tokens.accessToken && checkTokenValidity(tokens.accessToken)) {
    return tokens.accessToken;
  }

  try {
    const response = await refresh();
    const newAccessToken = response.data.accessToken;
    console.log('New access token:', newAccessToken);

    const persistAuth = getFromLocalStorage<any>('persist:auth');
    if (persistAuth) {
      persistAuth.accessToken = newAccessToken;
      const currentUser = {
        accessToken: persistAuth.accessToken,
        currentUser: persistAuth.currentUser,
      };
      setToLocalStorage('persist:auth', JSON.stringify(currentUser));
    }
    
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    alert('Session expired. Please login again');
    toast.error('Session expired. Please login again');
    removeAllLocalStorage();
    reload();
    return null;
  }
};
requestWithJwt.interceptors.request.use(async (config) => {
  const { accessToken } = getFromLocalStorage<any>('persist:auth');
  if (accessToken != null) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  
  return config
})

export const requestWithoutJwt = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 10000,
  withCredentials: false
})

requestWithoutJwt.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<IBaseErrorResponse>) => {
    alert('requestWithoutJwt.interceptors.response.use')
    return await Promise.reject({
      ...error.response?.data
    })
  }
)
