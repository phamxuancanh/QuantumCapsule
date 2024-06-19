import { requestWithJwt, requestWithoutJwt } from '../request'

import { AxiosResponse } from 'axios'

export const signIn = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/signIn', { data: payload }, { withCredentials: true })
}

export const signUp = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/signUp', { data: payload }, { withCredentials: true })
}

export const refresh = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.post<any>('/auths/refreshToken', payload, { withCredentials: true });
}
export const signOut = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.post<any>('/auths/signOut', { data: payload }, { withCredentials: true } )
}
export const sendOTP = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/sendOTP', { data: payload }, { withCredentials: true } )
}
export const verifyEmail = async (token: string): Promise<AxiosResponse<any>> => {
  console.log(token);
  return await requestWithoutJwt.get<any>(`/auths/verifyEmail`, {
      params: { token }
  });
};
export const googleSignIn = () => {
  window.location.href = 'http://localhost:8000/api/v1/auths/google/callback'
};
export const facebookSignIn = () => {
  window.location.href = 'http://localhost:8000/api/v1/auths/facebook/callback'
};
