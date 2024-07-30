import { getTableData } from 'api/get/get.api';
// import GridTable from 'components/tables/gridTable/GridTable';
import React, { useEffect, useState } from 'react';
import { GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import ModalAction from 'components/modals/modalAction/ModalAction';
import GridForm from 'components/forms/gridForm/GridForm';
import { IGrid, GridProgress } from 'api/api-shared';
import { Button } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { IAction, defaultAction } from 'utils/interfaces';
import loadable from '@loadable/component';
import Loading from 'containers/loadable-fallback/loading';
const TableComponent = loadable(() => import('components/tables/gridTable/GridTable'), { fallback: <Loading /> });
interface IState {
    tableData: IGrid[]
    formData: IGrid
    action: IAction
}

const GridSetting: React.FC = () => {
    const TABLE_NAME = 'grids';
    const instance = new GridProgress();
    const gridRef = useGridApiRef();
    const [state, setState] = useState<IState>({
        tableData: [],
        formData: {} as IGrid,
        action: defaultAction
    });

    useEffect(() => {
        (async () => {
            const res1 = await getTableData({ tableName: TABLE_NAME, filter: {} });
            setState(prep => ({ ...prep, tableData: res1.data }));
        })();
    }, []);

    const onRowClick = (row: GridRowParams<any>) => {
        setState(prep => ({ ...prep, formData: row.row }));
    }
    const handleValidation = () => {
        return state.formData.tableName && state.formData.columnName;
    }
    async function handleClick(action: ACTIONS): Promise<void> {

        switch (action) {
            case ACTIONS.VIEW:
                if (state.formData?.tableName && state.formData?.columnName) {
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
                if (state.formData?.tableName && state.formData?.columnName) {
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
                if (state.formData?.tableName && state.formData?.columnName) {
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
                // const instance = new InProgress();
                try {
                    if (state.formData?.tableName && state.formData?.columnName) {
                        await instance.delete(state.formData.tableName, state.formData.columnName);
                        const idData = state.formData.tableName + state.formData.columnName;
                        const row = gridRef.current?.getRow(idData);
                        gridRef.current?.updateRows([{_action: 'delete', tableName: row?.tableName, columnName: row?.columnName}])
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
                        gridRef.current?.updateRows([resCreate.data]);
                        setState(prep => ({ ...prep, action: defaultAction }));
                    } else {
                        alert('Please check your input');
                    }
                    break;
                case ACTIONS.UPDATE:
                    if (handleValidation()) {
                        const resUpdate = await instance.update(state.formData);
                        gridRef.current?.updateRows([resUpdate.data]);
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
                tableName={TABLE_NAME}
                initData={state.tableData}
                onRowClick={(row) => onRowClick(row)}
                // getRowId={(row: IGrid) => row.tableName + row.columnName}
                pageSizeOptions={[10, 20, 30]}
            />
            <Button onClick={() => handleClick(ACTIONS.VIEW)}>xem</Button>
            <Button onClick={() => handleClick(ACTIONS.CREATE)}>thêm</Button>
            <Button onClick={() => handleClick(ACTIONS.UPDATE)}>sửa</Button>
            <Button onClick={() => handleClick(ACTIONS.COPY)}>sao chép</Button>
            <Button onClick={() => handleClick(ACTIONS.DELETE)}>xóa</Button>
            <ModalAction
                title='Grid Setting'
                open={state.action.open}
                type={state.action.type}
                onSave={() => handleSave()}
                onClose={() => setState(prep => ({ ...prep, action: defaultAction }))}

            >
                <GridForm
                    tableName={TABLE_NAME}
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

export default GridSetting;