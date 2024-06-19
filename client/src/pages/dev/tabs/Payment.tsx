import { getTableData } from 'api/get/get.api';
// import GridTable from 'components/tables/gridTable/GridTable';
import React, { useEffect, useState } from 'react';
import { GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import ModalAction from 'components/modals/modalAction/ModalAction';
import GridForm from 'components/forms/gridForm/GridForm';
import { IVoucher, VchProgress } from 'api/api-shared';
import { Button } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { IAction, defaultAction } from 'utils/interfaces';
import loadable from '@loadable/component';
import Loading from 'containers/loadable-fallback/loading';
import PayPalProvider from 'components/payments/paypal/PayPalProvider';
import CustomModal from 'components/modals/customModal/CustomModal';
const TableComponent = loadable(() => import('components/tables/gridTable/GridTable'), { fallback: <Loading /> });
interface IState {
    tableData: IVoucher[]
    formData: IVoucher
    action: IAction
}
interface IPayState {
    action: IAction
    voucherId: string
    totalAmount: number

}

const Payment: React.FC = () => {
    const TABLE_NAME = 'vouchers';
    const instance = new VchProgress();
    const gridRef = useGridApiRef();
    const [state, setState] = useState<IState>({
        tableData: [],
        formData: {} as IVoucher,
        action: defaultAction
    });
    const [payState, setPayState] = useState<IPayState>({
        action: { open: false, type: ACTIONS.PAY },
        voucherId: '',
        totalAmount: 0
    });

    useEffect(() => {
        (async () => {
            const res1 = await getTableData({ tableName: TABLE_NAME, filter: {} });
            setState(prep => ({ ...prep, tableData: res1.data.data }));
        })();
    }, []);

    const onRowClick = (row: GridRowParams<any>) => {
        setState(prep => ({ ...prep, formData: row.row }));
    }
    const handleValidation = () => {
        return true;
    }
    async function handleClick(action: ACTIONS): Promise<void> {

        switch (action) {
            case ACTIONS.VIEW:
                if (state.formData?.id) {
                    setState(prep => ({ ...prep, action: { open: true, payload: state.formData, type: ACTIONS.VIEW } }));
                } else {
                    alert('Please select a row to view');
                }
                break;
            case ACTIONS.CREATE:
                setState(prep => ({
                    ...prep,
                    action: { open: true, type: ACTIONS.CREATE },
                    formData: instance.init()
                }));
                break;
            case ACTIONS.UPDATE:
                if (state.formData?.id) {
                    setState(prep => ({
                        ...prep,
                        action: {
                            open: true,
                            type: ACTIONS.UPDATE
                        }
                    }));
                } else {
                    alert('Please select a row to update');
                }
                break;
            case ACTIONS.COPY:
                if (state.formData?.id) {
                    setState(prep => ({
                        ...prep,
                        action: {
                            open: true,
                            type: ACTIONS.CREATE
                        }
                    }));
                } else {
                    alert('Please select a row to copy');
                }
                break;
            case ACTIONS.DELETE:
                try {
                    if (state.formData?.id) {
                        await instance.delete(state.formData.id);
                        gridRef.current?.updateRows([{ _action: 'delete', id: state.formData.id }])
                    }
                    else {
                        alert('Please select a row to delete');
                    }
                } catch (error) {
                    alert(error);
                }
                break;
            case ACTIONS.PAY:
                if (!state.formData?.id) {
                    alert('Please select a row to pay');
                    return;
                }
                if (state.formData?.status === 'PAID') {
                    alert('this voucher has been paid');
                    return;
                }

                setPayState(prep => ({
                    ...prep,
                    action: {
                        open: true,
                        type: ACTIONS.PAY
                    },
                    voucherId: state.formData.id,
                    totalAmount: state.formData.totalAmount
                }));
                break;
            default:
                break;
        }
    }
    async function handleSave(): Promise<void> {
        try {
            switch (state.action.type) {
                case ACTIONS.CREATE:
                    if (handleValidation()) {
                        const resCreate = await instance.create(state.formData);
                        gridRef.current?.updateRows([resCreate.data.data]);
                        setState(prep => ({ ...prep, action: defaultAction }));
                    } else {
                        alert('Please check your input');
                    }
                    break;
                case ACTIONS.UPDATE:
                    if (handleValidation()) {
                        const resUpdate = await instance.update(state.formData);
                        gridRef.current?.updateRows([resUpdate.data.data]);
                        setState(prep => ({ ...prep, action: defaultAction }));
                    }
                    else {
                        alert('Please check your input');
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            alert(error);
        }
    }
    const handlePaySuccess = async () => {
        try {
            const res = await instance.pay(payState.voucherId);
            gridRef.current?.updateRows([res.data.data]);
            setPayState(prep => ({
                ...prep,
                action: defaultAction
            }));
        } catch (error) {
            console.log(error);    
        }
    }
    return (
        <>
            <TableComponent
                apiRef={gridRef}
                tableName={TABLE_NAME}
                initData={state.tableData}
                onRowClick={(row) => onRowClick(row)}
                getRowId={(row: IVoucher) => row.id}
                pageSizeOptions={[10, 20, 30]}
            />
            <Button onClick={() => handleClick(ACTIONS.VIEW)}>xem</Button>
            <Button onClick={() => handleClick(ACTIONS.CREATE)}>thêm</Button>
            <Button onClick={() => handleClick(ACTIONS.UPDATE)}>sửa</Button>
            <Button onClick={() => handleClick(ACTIONS.COPY)}>sao chép</Button>
            <Button onClick={() => handleClick(ACTIONS.DELETE)}>xóa</Button>
            <Button onClick={() => handleClick(ACTIONS.PAY)}>thanh toán</Button>
            <ModalAction
                title='Grid Setting'
                open={state.action.open}
                type={state.action.type}
                onSave={() => handleSave()}
                onClose={() => setState(prep => ({ ...prep, action: defaultAction }))}

            >
                <GridForm
                    tableName={TABLE_NAME}
                    action={state.action.type}
                    formData={state.formData}
                    setFormData={(data) => {
                        setState(prep => ({ ...prep, formData: data }));
                    }}
                />
            </ModalAction>
            <CustomModal
                open={payState.action.open}
                title='Thanh toán'
                setOpenModal={() => setPayState(prep => ({
                    ...prep,
                    action: defaultAction
                
                }))}

            >
                <PayPalProvider
                    voucherId={payState.voucherId}
                    totalAmount={payState.totalAmount}
                    handleSuccess={() => handlePaySuccess()}
                    handleFail={() => console.log('Payment fail')}
                />
            </CustomModal>

        </>
    );
};

export default Payment;