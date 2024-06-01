import React from 'react';
import { getGridData, getTableData } from 'api/get/get.api';
import { DataGrid, GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';


interface GridTableProps {
    tableName: string;
    initData: any[];
    apiRef: any;

    onRowClick?: GridEventListener<"rowClick">;
}

enum InputType {
    // text, number, date, datetime, select, checkbox, radio, textarea,
    TEXT = 'text',
    NUMBER = 'number',
    DATE = 'date',
    DATETIME = 'datetime',
    SELECT = 'select',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    TEXTAREA = 'textarea',
}
enum FieldType {
    // NUMBER, STRING, DATE, DATETIME, BOOLEAN,
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    DATE = 'DATE',
    DATETIME = 'DATETIME',
    BOOLEAN = 'BOOLEAN',
}

const GridTable: React.FC<GridTableProps> = (props: GridTableProps) => {
    const [initData, setTableData] = React.useState<any[]>(props.initData);
    const [dataGrid, setDataGrid] = React.useState<any[]>([]);
    const [columns, setColumns] = React.useState<GridColDef[]>([]);

    React.useEffect(() => {
        (async () => {
            const res2 = await getGridData(props.tableName);
            setDataGrid(res2.data.data);
        })();
    }, [])
    React.useEffect(() => {
        convertDates(dataGrid, initData);
        const gridColumns = convertColumns(dataGrid)
        setColumns(gridColumns);
    }, [dataGrid])


    const convertTypes = (type: string) => {
        switch (type) {
            case FieldType.BOOLEAN: return 'boolean';
            case FieldType.DATE: return 'date';
            case FieldType.DATETIME: return 'dateTime';
            case FieldType.NUMBER: return 'number';
            case FieldType.STRING: return 'string';
            default: return 'string';
        }
    }
    const convertDates = (dataGrid: any[], initData: any[]) => {
        let tempData = [...initData]
        tempData.forEach((element: any) => {
            dataGrid.forEach((gridElement: any) => {
                if (gridElement.columnType === FieldType.DATE || gridElement.columnType === FieldType.DATETIME) {
                    element[gridElement.columnName] = new Date(element[gridElement.columnName]);
                }
            })
        })
        setTableData(tempData);
    }
    const convertColumns = (dataGrid: any): GridColDef[] => {
        return dataGrid.map((element: any) => {
            return {
                field: element.columnName,
                headerName: element.label,
                type: convertTypes(element.columnType),
                editable: false,

            }
        });
    }



    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <Button onClick={() => console.log(initData)}>Log Data</Button>
            <DataGrid
                apiRef={props.apiRef}
                rows={initData}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 1 } }
                }}
                pageSizeOptions={[10, 20]}
                onRowClick={props.onRowClick}
            />
        </Box>
    );
};

export default GridTable;