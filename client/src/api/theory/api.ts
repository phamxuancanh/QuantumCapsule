import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'

export const importTheories = async (theories: any[]): Promise<AxiosResponse<any>> => {
    return await requestWithJwt.post<any>('/theories/importTheories', { theories }, { withCredentials: true });
}
