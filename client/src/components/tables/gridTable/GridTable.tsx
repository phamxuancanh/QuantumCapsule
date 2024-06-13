import React from 'react';
import { getGridData } from 'api/get/get.api';
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';
import {IGrid} from 'utils/interfaces';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import 'styles/global.scss'

interface GridTableProps {
    tableName: string;
    initData: any[];
    apiRef: React.MutableRefObject<GridApiCommunity>;

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

interface IState {
    columns: GridColDef[];
    gridData: IGrid[];

}

const GridTable: React.FC<GridTableProps> = (props: GridTableProps) => {
    const [state, setState] = React.useState<IState>({
        columns: [],
        gridData: [],
    });

    React.useEffect(() => {
        (async () => {
            const res = await getGridData(props.tableName);
            const gridColumns = convertColumns(res.data.data)
            setState(prep=>({...prep, columns: gridColumns, gridData: res.data.data}));
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

    const convertColumns = (dataGrid: IGrid[]): GridColDef[] => {
        return dataGrid.sort((a: IGrid, b: IGrid) => a.position - b.position).map((element: IGrid) => {
            const gridColumn :GridColDef = {
                field: element.columnName,
                headerName: element.label,
                type: convertTypes(element.columnType),
                headerClassName: 'table-header',
                editable: false,
                flex: 1,
                hideable: true,
            };
            return gridColumn
        });
    }

    const columnVisibilityModel = () => {
        let visibles: { [key: string]: boolean } = {};
        state.gridData.forEach((grid) => {
            visibles[grid.columnName] = grid.isDisplayTable;
        });
        console.log(visibles);
        
        return visibles;
    };

    return (
        <DataGrid
            apiRef={props.apiRef}
            rows={props.initData}
            columns={state.columns}
            columnVisibilityModel= {columnVisibilityModel()}
            initialState={{
                pagination: { paginationModel: { pageSize: props.pageSizeOptions?.[0] || 10, page: 1 } },
            }}
            pageSizeOptions={props.pageSizeOptions || [10, 20]}
            onRowClick={props.onRowClick}
            getRowClassName={(params) => `super-app-theme--${params.row.status}`}
            
            autoHeight
        />
    );
};

export default GridTable;