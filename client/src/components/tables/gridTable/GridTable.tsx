import React from 'react';
import { getGridData } from 'api/get/get.api';
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { Box, darken, lighten, styled } from '@mui/material';
// import customs.scss
import { COLORS } from 'utils/colors';



interface GridTableProps {
    tableName: string;
    initData: any[];
    apiRef: any;

    pageSizeOptions?: number[];

    onRowClick?: GridEventListener<"rowClick">;
}
enum FieldType {
    // NUMBER, STRING, DATE, DATETIME, BOOLEAN,
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    DATE = 'DATE',
    DATETIME = 'DATETIME',
    BOOLEAN = 'BOOLEAN',
}

const styles = {
    '& .super-app-theme--header': {
        backgroundColor: COLORS.th,
        color: 'black',
        fontWeight: 'bold',
    },
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
                headerClassName: 'super-app-theme--header',
                editable: false,
                flex: 1,
            }
        });
    }



    return (
        <DataGrid
            sx={styles}
            apiRef={props.apiRef}
            rows={props.initData}
            columns={columns}
            initialState={{
                pagination: { paginationModel: { pageSize: props.pageSizeOptions?.[0] || 10, page: 1 } }
            }}
            pageSizeOptions={props.pageSizeOptions || [10, 20]}
            onRowClick={props.onRowClick}
            // disableColumnResize
            getRowClassName={(params) => `super-app-theme--${params.row.status}`}
            
            autoHeight
        />
    );
};

export default GridTable;