import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListTheory, ListTheoryParams } from './theory.interface';

export const importTheories = async (theories: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/theories/importTheories', { theories }, { withCredentials: true });
}

export const getListTheory = async ({params}: {params?: ListTheoryParams}): Promise<AxiosResponse<DataListTheory>> => {
    return await requestWithJwt.get<DataListTheory>('/theories', { params })
}
export const getTheoriesByLessonId = async (lessonId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/theories/getTheoriesByLessonId/${lessonId}`);
}