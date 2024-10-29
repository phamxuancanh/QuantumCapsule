import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
// import { IPet } from './pet.interface'

export const getListPet = async (): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>('/pets/')
  }
export const getPetById = async (id: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/pets/${id}`)
}