import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { ISubject } from './subject.interface'

export const getListSubject = async (): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<ISubject>('/subjects/')
  }
export const getSubjectById = async (id: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<ISubject>(`/subjects/${id}`)
  }