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

    async create(data: IInventory): Promise<AxiosResponse> {
        return await requestWithoutJwt.post('/inventories/create', data); 
    }

    async findById(id: string): Promise<AxiosResponse> {
        return await requestWithoutJwt.get(`/inventories/findById`, {params: {id}}); 
    }

    async update(id: string, data: IInventory): Promise<AxiosResponse> {
        return await requestWithoutJwt.put(`/inventories/update`, data); 
    }

    delete = async (id: string): Promise<AxiosResponse<any>> => {    
        return await requestWithoutJwt.delete<any>(`/inventories/delete`, {params: {id}})
    }
}