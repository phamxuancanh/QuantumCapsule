import { AxiosResponse } from 'axios';
import { requestWithJwt, requestWithoutJwt } from './request'


export interface IInventory {
    id: string;
    name: string;
    price: number;
    quantity: number;
    storage: string;
    category: string;
    unit: string;
    createdDate: string;
    updatedDate: string;
    status: string;
}
export class InProgress {

    create = async (payload: IInventory): Promise<AxiosResponse<any>> => {    
        return await requestWithoutJwt.post<any>(`/inventories/create`, {data: payload})
    }

    update = async (payload: IInventory): Promise<AxiosResponse<any>> => {    
        return await requestWithoutJwt.put<any>(`/inventories/update`, {data: payload})
    }

    delete = async (id: string): Promise<AxiosResponse<any>> => {    
        return await requestWithoutJwt.delete<any>(`/inventories/delete`, {params: {id}})
    }
}