import { AxiosResponse } from 'axios';
import { requestWithoutJwt } from './request'


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

export interface IGrid{
    id?: number;
    tableName: string;
    columnName: string;
    columnType: string;
    inputType: string;
    label: string;
    editable: boolean;
    dataSource?: string;
    isDisplayTable: boolean;
    isDisplayForm: boolean;
    regex?: string;
    regexMessage?: string;
    position: number;
    displayField: string | null;


}
export class GridProgress {

    init = (): IGrid => {
        return {
            // id: undefined,
            tableName: '',
            columnName: '',
            columnType: 'STRING',
            inputType: 'text',
            label: '',
            editable: true,
            dataSource: '',
            isDisplayTable: true,
            isDisplayForm: true,
            regex: '',
            regexMessage: '',
            position: 0,
            displayField: null
        }
    }

    create = async (body: IGrid): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.post(`/grids/create`, body)
    }

    update = async (body: IGrid): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.put(`/grids/update`, body)
    }

    delete = async (id: any): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.delete(`/grids/delete`, { params: { id: id} })
    }
}

export interface IVoucher{
    
    id: string;
    coupon: string;
    totalAmount: number;
    amount: number;
    discount: number;
    status: "PENDING" | "PAID" | "CANCELLED";
    createdDate: Date | string;
    paymentDate: Date | string;


}
export class VchProgress {

    init = (): IVoucher => {
        return {
            id: 'random ID',
            coupon: 'coupon',
            totalAmount: 0.01,
            amount: 0.01,
            discount: 0,
            status: 'PENDING',
            createdDate: new Date(),
            paymentDate: new Date()
        }
    }

    create = async (body: IVoucher): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.post(`/vouchers/create`, body)
    }

    update = async (body: IVoucher): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.put(`/vouchers/update`, body)
    }

    delete = async (id: string): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.delete(`/vouchers/delete`, { params: { id} })
    }

    pay = async (id: string): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.put(`/vouchers/pay`, {}, { params: {id}})
    }

    cancel = async (id: string): Promise<AxiosResponse<any>> => {
        return await requestWithoutJwt.put(`/vouchers/cancel`, {}, { params: {id}})
    }
}