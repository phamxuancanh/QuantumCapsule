import React from 'react';
import { getGridData, getTableData } from 'api/get/get.api';
import { DataGrid, GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { number } from 'yup';


interface GridTableProps {
    tableName: string;
    initData: any[];
    apiRef: any;

    pageSizeOptions?: number[];

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
    const [columns, setColumns] = React.useState<GridColDef[]>([]);

    React.useEffect(() => {
        (async () => {
            const res = await getGridData(props.tableName);
            const gridColumns = convertColumns(res.data.data)
            setColumns(gridColumns);
        })();
    }, [])



    const convertTypes = (type: string) => {
        switch (type) {
            case FieldType.BOOLEAN: return 'boolean';
            case FieldType.DATE: return 'string';
            case FieldType.DATETIME: return 'string';
            case FieldType.NUMBER: return 'number';
            case FieldType.STRING: return 'string';
            default: return 'string';
        }
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
            <DataGrid
                apiRef={props.apiRef}
                rows={props.initData}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: props.pageSizeOptions?.[0] || 10, page: 1 } }
                }}
                pageSizeOptions={props.pageSizeOptions || [10, 20]}
                onRowClick={props.onRowClick}
            />
        </Box>
    );
};

export default GridTable;