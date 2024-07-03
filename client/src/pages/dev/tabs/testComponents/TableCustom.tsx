import { Button } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import SimpleTable, { ISimpleTableProps } from 'components/tables/simpleTable/SimpleTable';
import React from 'react';
import { ACTIONS } from 'utils/enums';

let baseData = [
    { id: "id_1", lastName: 'Snow', firstName: 'Jon', age: 35, job: 'Engineer' },
    { id: "id_2", lastName: 'Lannister', firstName: 'Cersei', age: 42, job: 'Worker' },
    { id: "id_3", lastName: 'Lannister', firstName: 'Jaime', age: 45, job: 'Doctor' },
    { id: "id_4", lastName: 'Stark', firstName: 'Arya', age: 16, job: 'Teacher' },
    { id: "id_5", lastName: 'Targaryen', firstName: 'Daenerys', age: null, job: 'out of work' },
    { id: "id_6", lastName: 'Melisandre', firstName: "Aha", age: 150, job: 'out of work' },
    { id: "id_7", lastName: 'Clifford', firstName: 'Ferrara', age: 44, job: 'Doctor' },
    { id: "id_8", lastName: 'Frances', firstName: 'Rossini', age: 36, job: 'Worker' },
    { id: "id_9", lastName: 'Roxie', firstName: 'Harvey', age: 65, job: 'Engineer' },
]

const TableCustom: React.FC = () => {

    const apiRef = useGridApiRef();

    const simpleTableProps: ISimpleTableProps = {
        apiRef: apiRef,
        initData: baseData,
        initNewRow: { id: Date.now().toString(), lastName: '', firstName: '', age: 0 },
        columns: [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'firstName', headerName: 'First name', width: 130, editable: true },
            { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
            { field: 'age', headerName: 'Age', type: 'number', width: 90, editable: true,  },
            {
                field: 'job', headerName: 'job', width: 130, editable: true,
                type: 'singleSelect',
                valueOptions: ['Engineer', 'Worker', 'Doctor', 'Teacher', 'out of work'],
                valueFormatter: (params) => {
                    return params + ' @';
                }
            },
        ],
        pageSizeOptions: [5, 10, 20],
        onUpdateRow: (data, action) => {

            if (action === ACTIONS.CREATE) {
                baseData = [data, ...baseData];
            }
            if (action === ACTIONS.UPDATE) {
                baseData = baseData.map((row) => {
                    return row.id === data.id ? data : row;
                });
            }
            if (action === ACTIONS.DELETE) {
                baseData = baseData.filter((row) => row.id !== data);
            }
        }
    }
    return (
        <div>
            <Button onClick={() => {
                console.log(baseData);
                
                console.log(apiRef.current?.getSelectedRows())
            }}>
                log
            </Button>
            <SimpleTable {...simpleTableProps} />
        </div>
    );
};

export default TableCustom;