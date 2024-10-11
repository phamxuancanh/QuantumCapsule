import { requestWithJwt } from '../request'
import { AxiosResponse } from 'axios'

export const createNotification = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.post<any>('/notifications/createNotification', { data: payload })
}
export const getNotifications = async (limit: number, offset: number): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.get<any>('/notifications/getNotificationByUserId', {
    params: {
      limit,
      offset
    }
  })
}
export const readNotification = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.put<any>('/notifications/readNotification', { data: payload })
}
export const readAllNotification = async (): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.put<any>('/notifications/readAllNotifications')
}
export const markUnread = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.put<any>('/notifications/markAsUnread', { data: payload })
}
export const markAllUnread = async (): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.put<any>('/notifications/markAllAsUnread')
}
export const removeNotification = async (payload: any): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.delete<any>('/notifications/removeNotification', { data: payload })
}
export const removeAllNotification = async (): Promise<AxiosResponse<any>> => {
  return await requestWithJwt.delete<any>('/notifications/removeAllNotifications')
}