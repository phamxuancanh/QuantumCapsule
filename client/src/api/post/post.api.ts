import { requestWithJwt, requestWithoutJwt } from '../request'

import { AxiosResponse } from 'axios'

export const signIn = async (payload: any): Promise<AxiosResponse<any>> => {
    return await requestWithoutJwt.post<any>('/auths/signIn', { data: payload })
  }
  
  export const signUp = async (payload: any): Promise<AxiosResponse<any>> => {
    return await requestWithoutJwt.post<any>('/auths/signUp', { data: payload })
  }
  
  export const refresh = async (payload: any): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/auths/refresh', { data: payload })
  }