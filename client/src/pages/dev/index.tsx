import { getTableData } from 'api/get/get.api';
import GridTable from 'components/tables/gridTable/GridTable';
import React, { useEffect, useState } from 'react';
import { GridRowParams, useGridApiRef } from '@mui/x-data-grid';
import ModalAction from 'components/modals/ModalAction';
import CustomForm from 'components/forms/CustomForm';
import { InProgress, IInventory } from 'api/api-shared';
import { Button } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { IAction, IFormParam, defaultAction } from 'utils/interfaces';
import { set } from 'react-hook-form';
import { string } from 'yup';


const DevPage: React.FC = () => {
    const instance = new InProgress();
    const [tableData, setTableData] = useState<IInventory[]>([]);
    const [formData, setFormData] = useState<IInventory>({});
    const [loading, setLoading] = useState<boolean>(false);
    const gridRef = useGridApiRef();
    const [action, setAction] = useState<IAction>(defaultAction);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res1 = await getTableData({ tableName: 'inventories', filter: {} });
            setTableData(res1.data.data);
            setLoading(false);
        })();
    }, []);
    const generateStorages = () => {
        const storages = [];
        for (let i = 0; i < 26; i++) {
            const value = `Storage ${String.fromCharCode(65 + i)}`;
            const label = `Kho ${String.fromCharCode(65 + i)}`;
            storages.push({ value, label });
        }
        return storages;
    };
    const formParams: IFormParam[] = [
        {
            name: 'status',
            label: 'trạng thái',
            value: 'ENABLED',
            labelValue: 'Kích hoạt',
            defaultChecked: true
        },
        {
            name: 'storage',
            label: 'kho',
            values: generateStorages(),
        }
    ]
    const onRowClick = (row: GridRowParams<any>) => {
        setFormData(row.row);
    }
    const handleValidation = () => {
        let isValid = true;
        if(
            !formData.name
            || !new RegExp('^([1-9]\d*(\.\d+)?)|([1-9][0-9]*)$').test(formData.price?.toString() || '') 
            || !new RegExp('^[1-9][0-9]*$').test(formData.quantity?.toString() || '') 
            || !new RegExp('^[A-Z][a-zA-Z]*$').test(formData.unit?.toString() || '') 
        ){
            isValid = false;
        }
        console.log(isValid);
        
        return isValid
    }
    async function handleClick(action: ACTIONS): Promise<void> {
        console.log('Action:', action);
        switch (action) {
            case ACTIONS.VIEW:
                if (formData.id) {
                    setAction({
                        open: true,
                        payload: formData,
                        type: ACTIONS.VIEW
                    });
                } else {
                    alert('Please select a row to view');
                }
                break;
            case ACTIONS.CREATE:
                console.log(instance.init());
                setFormData(instance.init());
                setAction({
                    open: true,
                    payload: instance.init(),
                    type: ACTIONS.CREATE
                });
                break;
            case ACTIONS.UPDATE:
                console.log(formData);
                if (formData?.id) {
                    setAction({
                        open: true,
                        payload: formData,
                        type: ACTIONS.UPDATE
                    });
                } else {
                    alert('Please select a row to update');
                }
                break;
            case ACTIONS.DELETE:
                // const instance = new InProgress();
                try {
                    if (formData.id) {
                        setLoading(true);
                        await instance.delete(formData.id);
                        gridRef.current?.updateRows([{ id: formData.id, _action: 'delete' }]);
                        setLoading(false);
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
            setLoading(true);
            switch (action.type) {
                case ACTIONS.CREATE:
                    if (handleValidation()) {
                        const resCreate = await instance.create(formData);
                        gridRef.current?.updateRows([resCreate.data.data]);
                        setAction(defaultAction);
                    } else {
                        alert('Please check your input');
                    }
                    break;
                case ACTIONS.UPDATE:
                    if (handleValidation()) {
                        const resUpdate = await instance.update(formData);
                        gridRef.current?.updateRows([resUpdate.data.data]);
                        setAction(defaultAction);
                    }
                    else {
                        alert('Please check your input');
                    }
                    break;
                default:
                    break;
            }
            setLoading(false);
        } catch (error) {
            alert(error);
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
                        onRowClick={(row) => onRowClick(row)}

                        pageSizeOptions={[5, 10, 20]}
                    />
                )
            }
            <Button onClick={() => handleClick(ACTIONS.VIEW)}>xem</Button>
            <Button onClick={() => handleClick(ACTIONS.CREATE)}>thêm</Button>
            <Button onClick={() => handleClick(ACTIONS.UPDATE)}>sửa</Button>
            <Button onClick={() => handleClick(ACTIONS.DELETE)}>xóa</Button>
            <ModalAction
                title='INVENTORY FORM'
                open={action.open}
                type={action.type}
                formData={action.payload}
                onSave={() => handleSave()}
                onClose={() => setAction(defaultAction)}
            >
                <CustomForm
                    tableName='inventories'
                    // initData={action.payload}
                    action={action.type}
                    formData={formData}
                    setFormData={setFormData}
                    formParams={formParams}
                />
            </ModalAction>
        </>
    );
};

export default DevPage;