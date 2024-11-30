import { IGetResultByUserIdFilterParams } from 'api/result/result.interface';
import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'

export const addProgress = async (theoryId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/progress/addProgress', { theoryId }, { withCredentials: true });
}
export const findProgressByGradeAndSubject = async (grade: number, subject: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/progress/findProgressByGradeAndSubject?grade=${grade}&subjectId=${subject}`);
}
export const findProgressByChapter = async (chapterId: string, filter?: IGetResultByUserIdFilterParams): Promise<AxiosResponse<any>> => {
    const params = filter ? { ...filter, chapterId } : { chapterId };
    return await requestWithJwt.get<any>('/progress/findProgressByChapter', { params, withCredentials: true });
};
export const findProgressByLesson = async (lessonId: string, filter?: IGetResultByUserIdFilterParams): Promise<AxiosResponse<any>> => {
    const params = filter ? { ...filter, lessonId } : { lessonId };
    return await requestWithJwt.get<any>('/progress/findProgressByLesson', { params, withCredentials: true });
};