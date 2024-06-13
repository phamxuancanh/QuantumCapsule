import { getTableData } from 'api/get/get.api';
// import GridTable from 'components/tables/gridTable/GridTable';
import React, { useEffect, useState } from 'react';
import { GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import ModalAction from 'components/modals/ModalAction';
import CustomForm from 'components/forms/CustomForm';
import { InProgress, IInventory } from 'api/api-shared';
import { Button } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { IAction, defaultAction } from 'utils/interfaces';
import loadable from '@loadable/component';
import Loading from 'containers/loadable-fallback/loading';
const TableComponent = loadable(() => import('components/tables/gridTable/GridTable'), { fallback: <Loading /> });
interface IState {
    tableData: IInventory[]
    formData: IInventory
    action: IAction
}

const DevPage: React.FC = () => {
    const instance = new InProgress();
    const gridRef = useGridApiRef();
    const [state, setState] = useState<IState>({
        tableData: [],
        formData: {},
        action: defaultAction
    });

    useEffect(() => {
        (async () => {
            const res1 = await getTableData({ tableName: 'inventories', filter: {} });
            setState(prep => ({ ...prep, tableData: res1.data.data }));
        })();
    }, []);

    const onRowClick = (row: GridRowParams<any>) => {
        setState(prep => ({ ...prep, formData: row.row }));
    }
    const handleValidation = () => {
        return state.formData.name
            && new RegExp('^([1-9]\d*(\.\d+)?)|([1-9][0-9]*)$').test(state.formData.price?.toString() || '')
            && new RegExp('^[1-9][0-9]*$').test(state.formData.quantity?.toString() || '')
            && new RegExp('^[A-Z][a-zA-Z]*$').test(state.formData.unit?.toString() || '')
    }
    async function handleClick(action: ACTIONS): Promise<void> {

        switch (action) {
            case ACTIONS.VIEW:
                if (state.formData.id) {
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
            case ACTIONS.DELETE:
                // const instance = new InProgress();
                try {
                    if (state.formData.id) {
                        await instance.delete(state.formData.id);
                        gridRef.current?.updateRows([{ id: state.formData.id, _action: 'delete' }]);
                    }
                    else {
                        alert('Please select a row to delete');
                    }
                } catch (error) {
                    alert(error);
                }
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
    return (
        <>
            <TableComponent
                apiRef={gridRef}
                tableName="inventories"
                initData={state.tableData}
                onRowClick={(row) => onRowClick(row)}

                pageSizeOptions={[5, 10, 20]}
            />
            <Button onClick={() => handleClick(ACTIONS.VIEW)}>xem</Button>
            <Button onClick={() => handleClick(ACTIONS.CREATE)}>thêm</Button>
            <Button onClick={() => handleClick(ACTIONS.UPDATE)}>sửa</Button>
            <Button onClick={() => handleClick(ACTIONS.DELETE)}>xóa</Button>
            <ModalAction
                title='INVENTORY FORM'
                open={state.action.open}
                type={state.action.type}
                onSave={() => handleSave()}
                onClose={() => setState(prep => ({ ...prep, action: defaultAction }))}

            >
                <CustomForm
                    tableName='inventories'
                    // initData={action.payload}
                    action={state.action.type}
                    formData={state.formData}
                    setFormData={(data) => {
                        setState(prep => ({ ...prep, formData: data }));
                    }}
                // formParams={formParams}
                />
            </ModalAction>
        </>
    );
};

export default DevPage;