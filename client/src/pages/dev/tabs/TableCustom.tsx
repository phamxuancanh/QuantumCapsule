import { Button } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import SimpleTable, { ISimpleTableProps } from 'components/tables/simpleTable/SimpleTable';
import React from 'react';
import { ACTIONS } from 'utils/enums';

let data = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: "Aha", age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
]

const TableCustom: React.FC = () => {




    const simpleTableProps: ISimpleTableProps = {
        apiRef: useGridApiRef(),
        initData: data,
        keys: ['id'],
        columns: [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'firstName', headerName: 'First name', width: 130, editable: true },
            { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
            {
                field: 'age',
                headerName: 'Age',
                type: 'number',
                width: 90,
                editable: true,
            },
        ],
        pageSizeOptions: [5, 10, 20],
        // getRowId: (row) => row.id.toString(),
        onUpdateRow: (updatedRow, action) => {
            data = data.map((row) => {
                if (row.id === updatedRow.id) {
                    return updatedRow;
                }
                return row;
            });
        }
    }
    return (
        <div>
            <Button onClick={() => {
                console.log(data)
                console.log(simpleTableProps.apiRef.current?.getAllRowIds())
            }}>
                log
            </Button>;
            <SimpleTable {...simpleTableProps} />
        </div>
    );
};

export default TableCustom;