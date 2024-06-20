
import { requestWithJwt, requestWithoutJwt } from '../request'

import { AxiosResponse } from 'axios'
import { IGetTableData } from './get.interface';
// import {IGrid} from 'utils/interfaces'

export const getTableData = async (params: IGetTableData): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.get<any>(`/${params.tableName}/findAll`)
}

export const getGridData = async (tableName: string): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.get<any>('/grids/filterByTableName', { params: { tableName: tableName } })
}

export const getDirections = async (dataSource: string): Promise<AxiosResponse<any>> => {
  return await requestWithoutJwt.get<any>(dataSource)
}