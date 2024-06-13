import { AxiosResponse } from 'axios';
import { requestWithJwt, requestWithoutJwt } from './request'
import { convertDate } from 'utils/functions'


export interface IInventory {
    id?: string;
    name?: string;
    price?: number;
    quantity?: number;
    storageName?: string;
    storageId?: string;
    category?: string;
    unit?: string;
    createdDate?: Date | string;
    updatedDate?: Date | string;
    status?: "ENABLED" | "DISABLED"
}



export class InProgress {

    init = (): IInventory => {
        return {
            id: 'random ID',
            name: 'name',
            price: 100,
            quantity: 100,
            storageName: 'Storage A',
            storageId: 'ST_1',
            category: 'category A',
            unit: 'Cai',
            createdDate: new Date(),
            updatedDate: new Date(),
            status: 'ENABLED'
        }
    }

    create = async (body: IInventory): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.post(`/inventories/create`, body)
    }

    update = async (body: IInventory): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.put(`/inventories/update`, body)
    }

    delete = async (id: string): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.delete(`/inventories/delete`, { params: { id } })
    }
}