import { requestWithJwt, requestWithoutJwt } from '../request'

import { AxiosResponse } from 'axios'

export const signIn = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/signIn', { data: payload }, { withCredentials: true })
}

export const signUp = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/signUp', { data: payload }, { withCredentials: true })
}

// export const refresh = async (payload: any): Promise<AxiosResponse<any>> => {
//   return await requestWithJwt.post<any>('/auths/refreshToken', payload, { withCredentials: true });
// }
export const refresh = async (): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.post<any>('/auths/refreshToken', {}, { withCredentials: true })
}
export const signOut = async (): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.post<any>('/auths/signOut', {}, { withCredentials: true } )
}
export const checkEmail = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.post<any>('/auths/checkEmail', { data: payload }, { withCredentials: true } )
}

export const sendOTP = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/sendOTP', { data: payload }, { withCredentials: true } )
}
export const resetPassword = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/resetPassword', { data: payload }, { withCredentials: true } )
}
export const verifyEmail = async (token: string): Promise<AxiosResponse<any>> => {
  console.log(token);
  return await requestWithoutJwt.get<any>(`/auths/verifyEmail`, {
      params: { token }
  });
};
export const verifyOTP = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.post<any>('/auths/verifyOTP', { data: payload }, { withCredentials: true })
}
export const googleSignIn = () => {
  window.location.href = 'http://localhost:8000/api/v1/auths/google/callback'
};
export const facebookSignIn = () => {
  window.location.href = 'http://localhost:8000/api/v1/auths/facebook/callback'
};
export const findUserById = async (id: string): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.get<any>(`/users/${id}`)
}
export const updateUser = async (id: string, payload: any): Promise<AxiosResponse<any>> => {
  console.log(payload, 'payload');
  return await requestWithJwt.put<any>(`/users/${id}`, { data: payload })
}
export const changeAVT = async (id: string, payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.put<any>(`/users/${id}/changeAVT`, payload);
}