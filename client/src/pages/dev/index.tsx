import { getTableData } from 'api/get/get.api';
import GridTable from 'components/tables/gridTable/GridTable';
import React, { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import ModalAction from 'components/modals/ModalAction';
import CustomForm from 'components/forms/CustomForm';
import { InProgress } from 'api/models/Inventory';
import { Button } from '@mui/material';
import { ACTIONS } from 'utils/enums';

const DevPage: React.FC = () => {
    const [tableData, setTableData] = useState<any[]>([]);
    const [rowSelected, setRowSelected] = useState<any>({});
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [action, setAction] = useState<ACTIONS>(ACTIONS.CREATE);
    const [loading, setLoading] = useState<boolean>(false);
    const gridRef = useGridApiRef();
    
    const onRowClick = (row: any) => {
        setRowSelected(row.row);
    }
    useEffect(() => {
        (async () => {
            setLoading(true);
            const res1 = await getTableData({ tableName: 'inventories', filter: {} });
            setTableData(res1.data.data);
            setLoading(false);
        })();
    }, []);
    async function handleClick(action: ACTIONS): Promise<void> {
        console.log('Action:', action);
        switch (action) {
            case ACTIONS.CREATE:
                setAction(action);
                setRowSelected({});
                setOpenModal(true);
                break;
            case ACTIONS.UPDATE:
                setAction(action);
                if (rowSelected.id) {
                    setOpenModal(true);
                } else {
                    alert('Please select a row to update');
                }
                break;
            case ACTIONS.DELETE:
                const instance = new InProgress();
                try {
                    setLoading(true);
                    instance.delete(rowSelected.id)
                    let tempTableData = [...tableData].filter((item) => item.id !== rowSelected.id);
                    gridRef.current?.setRows(tempTableData);
                    setLoading(false);
                } catch (error) {
                    alert(error);
                }
                break;
            default:
                break;
        }
    }

    return (
        <>
            {
                tableData.length === 0 ? (
                    <div>Đang tải dữ liệu...</div>
                ) : (
                    <GridTable
                        apiRef={gridRef}
                        tableName="inventories"
                        initData={tableData}
                        onRowClick={onRowClick}
                    />
                )
            }
            <Button onClick={() => handleClick(ACTIONS.CREATE)}>thêm</Button>
            <Button onClick={() => handleClick(ACTIONS.UPDATE)}>sửa</Button>
            <Button onClick={() => handleClick(ACTIONS.DELETE)}>xóa</Button>
            <ModalAction
                title='INVENTORY FORM'
                open={openModal}
                setOpenModal={setOpenModal}
                onSave={() => console.log('Save')}
                action={action} // Fix: Change the type of 'action' to 'ACTIONS'
            >
                <CustomForm
                    tableName='inventories'
                    initData={rowSelected}
                />
            </ModalAction>
        </>
    );
};

export default DevPage;