import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'

export const importLessons = async (lessons: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/lessons/importLessons', { lessons }, { withCredentials: true });
}
