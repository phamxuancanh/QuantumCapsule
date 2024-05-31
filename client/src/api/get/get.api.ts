import { get } from 'http'
import { requestWithJwt, requestWithoutJwt } from '../request'

import { AxiosResponse } from 'axios'
import { IGetTableData } from './get.interface';

export const getTableData = async (params: IGetTableData): Promise<AxiosResponse<any>> => {    
  return await requestWithoutJwt.get<any>(`/${params.tableName}/findAll`)
}

export const getGridData = async (tableName : String): Promise<AxiosResponse<any>> => {
    return await requestWithoutJwt.get<any>('/grids/filterByTableName', {params: {tableName: tableName}})
  }