import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'

export const importChapters = async (chapters: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/chapters/importChapters', { chapters }, { withCredentials: true });
}
