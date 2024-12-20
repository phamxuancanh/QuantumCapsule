import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'
import { DataListLessonandExam, DataListLesson, ILesson, ListLessonandExamParams, ListLessonParams } from './lesson.interface';
import { IChapterFilter } from 'QCComponents/QCChapterFilter.tsx/ChapterFilter';

export const importLessons = async (lessons: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/lessons/importLessons', { lessons }, { withCredentials: true });
}
export const getLessonById = async (lessonId: string): Promise<AxiosResponse<ILesson>> => {
    return await requestWithJwt.get<ILesson>(`/lessons/getLessonById/${lessonId}`);
}
export const getListLesson = async ({params}: {params?: ListLessonParams}): Promise<AxiosResponse<DataListLesson>> => {
    return await requestWithJwt.get<DataListLesson>('/lessons', { params })
}
export const getLessonByChapterId = async (chapterId: string): Promise<AxiosResponse<any>> => {
    console.log(chapterId);
    return await requestWithJwt.get<any>(`/lessons/chapter/${chapterId}`);
}
export const getLessonsandExams = async ({params}: {params?: ListLessonandExamParams}): Promise<AxiosResponse<DataListLessonandExam>> => {
    return await requestWithJwt.get<DataListLessonandExam>('/lessons/getLessonsandExams', { params })
}
export const getSuggestions = async (search: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>('/lessons/getSuggestions', { params: { search } });
}
export const getListLessonByChapterId = async (chapterId: string): Promise<AxiosResponse<DataListLesson>> => {
    return await requestWithJwt.get<DataListLesson>(`/lessons/getListLessonByChapterId/${chapterId}`);
}
export const getFirstLessonByChapterId = async (chapterId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/lessons/getFirstLessonByChapterId/${chapterId}`);
}
export const insertLesson = async (lesson: ILesson): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/lessons', lesson);
}
export const updateLesson = async (lessonId: string, lesson: ILesson): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.put<any>(`/lessons/${lessonId}`, lesson);
}
export const deleteLesson = async (lessonId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.delete<any>(`/lessons/${lessonId}`);
}

export const getListLessonByFilterParams= async (params: IChapterFilter): Promise<AxiosResponse<DataListLesson>> => {
    return await requestWithJwt.get<DataListLesson>('/lessons/getListLessonByFilterParams', { params: params })
}