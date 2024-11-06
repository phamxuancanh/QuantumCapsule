import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListTheory, ITheory, ListTheoryParams } from './theory.interface';

export const importTheories = async (theories: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/theories/importTheories', { theories }, { withCredentials: true });
}

export const getListTheory = async ({params}: {params?: ListTheoryParams}): Promise<AxiosResponse<DataListTheory>> => {
    return await requestWithJwt.get<DataListTheory>('/theories', { params })
}

export const addTheory = async (theory: any): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/theories', theory, { withCredentials: true });
}

export const updateTheory = async (id: string, theory: ITheory): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.put<any>('/theories', theory, { withCredentials: true });
}

export const deleteTheory = async (id: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.delete<any>(`/theories/${id}`, { withCredentials: true });
}

export const getTheoryById = async (id: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/theories/getTheoryById/${id}`);
}

export const getTheoriesByLessonId = async (lessonId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/theories/getTheoriesByLessonId/${lessonId}`);
}