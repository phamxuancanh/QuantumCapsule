/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import axios, { AxiosError } from 'axios'
import { getFromLocalStorage, setToLocalStorage } from 'utils/functions'

import { IBaseErrorResponse } from './interfaces'

/**
 * Authenticated Request Interceptors config
 */
export const requestWithJwt = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 10000,
  withCredentials: true
})

requestWithJwt.interceptors.request.use(async (config) => {
  const { accessToken } = getFromLocalStorage<any>('tokens')

  let token = ''
  if (accessToken != null) {
    token = accessToken
  }
//   return {
//     ...config,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       ...config.headers
//     }
//   }
config.headers.Authorization = `Bearer ${token}`;
return config;
})

requestWithJwt.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<IBaseErrorResponse>) => {
    const originalRequest: any = error.config

    if (
      error.response?.status === 401
    ) {
      setToLocalStorage('tokens', '')
      return await requestWithJwt(originalRequest)
    }
    if ((error.response == null) || !error.response?.data) {
      return await Promise.reject({
        code: 'Unknown',
        status: 500,
        message: 'Server error'
      })
    }
    return await Promise.reject({
      ...error.response?.data
    })
  }
)

/**
 * Non-authenticated Request Interceptors config
 */
export const requestWithoutJwt = axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 10000,
  withCredentials: true
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
