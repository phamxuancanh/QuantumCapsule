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
import { refresh } from 'api/user/user.api'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
interface IBaseErrorResponse {
  code: string
  status: number
  message: string
}
export const requestWithJwt = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 10000,
  withCredentials: true
})


const checkTokenValidity = (token: string) => {
  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token is invalid:', error);
    return false
  }
};


const handleTokenRefresh = async () => {
  try {
    console.log('Refreshing token');
    const response = await refresh();
    const newAccessToken = response.data.accessToken;
    console.log('New access token:', newAccessToken);
    const persistAuthKey = 'persist:auth';
    const persistAuthData = localStorage.getItem(persistAuthKey);

    if (persistAuthData) {
      console.log('Persist auth data:', persistAuthData);
      const parsedData = JSON.parse(persistAuthData);
      parsedData.accessToken = newAccessToken;
      localStorage.setItem(persistAuthKey, JSON.stringify(parsedData));
    } else {
      console.log('Persist auth data not found');
      const newData = { accessToken: newAccessToken };
      localStorage.setItem(persistAuthKey, JSON.stringify(newData));
    }

    return newAccessToken;
  } catch (error) {
    Swal.fire({
      title: 'Warning',
      text: 'Your session has expired. Please log in again.',
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        removeAllLocalStorage();
        reload();
      }
    });
  }
};
// const handleTokenRefresh = async () => {
//   try {
//     console.log('Refreshing token')
//     const response = await refresh()
//     const newAccessToken = response.data.accessToken
//     console.log('New access token:', newAccessToken)
//     setToLocalStorage('persist:auth', JSON.stringify(response.data))
//     return newAccessToken
//   } catch (error) {
//     Swal.fire({
//       title: 'Warning',
//       text: 'Your session has expired. Please log in again.',
//       icon: 'warning',
//       confirmButtonText: 'OK',
//       allowOutsideClick: false
//     }).then((result) => {
//       if (result.isConfirmed) {
//         removeAllLocalStorage()
//         reload()
//       }
//     })
//     return null
//   }
// }


requestWithJwt.interceptors.request.use(async (config) => {
  const { accessToken } = getFromLocalStorage<any>('persist:auth');
  if (accessToken != null) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  
  return config
})
requestWithJwt.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<IBaseErrorResponse>) => {
    const originalRequest: any = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('401 error')
      originalRequest._retry = true

      try {
        const newAccessToken = await handleTokenRefresh()
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return requestWithJwt(originalRequest)
        }
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    if (!error.response?.data) {
      console.error('Unknown server error')
      return Promise.reject({
        code: 'Unknown',
        status: 500,
        message: 'Server error'
      })
    }
    return Promise.reject(error.response?.data)
  }
)
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
    return await Promise.reject({
      ...error.response?.data
    })
  }
)
