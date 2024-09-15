import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListLesson, ListLessonParams } from './lesson.interface';

export const importLessons = async (lessons: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/lessons/importLessons', { lessons }, { withCredentials: true });
}



export const getListLesson = async ({params}: {params?: ListLessonParams}): Promise<AxiosResponse<DataListLesson>> => {
    return await requestWithJwt.get<DataListLesson>('/lessons', { params })
}