import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'

export const addProgress = async (theoryId: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/progress/addProgress', { theoryId }, { withCredentials: true });
}
export const findProgressByGradeAndSubject = async (grade: number, subject: string): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.get<any>(`/progress/findProgressByGradeAndSubject?grade=${grade}&subjectId=${subject}`);
}