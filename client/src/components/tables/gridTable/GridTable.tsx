import React from 'react';
import { getGridData, getTableData } from 'api/get/get.api';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';


interface GridTableProps {
    tableName: string;
    tableData: any;
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
    const [tableData, setTableData] = React.useState<any[]>([]);
    const [dataGrid, setDataGrid] = React.useState<any[]>([]);
    const [columns, setColumns] = React.useState<any[]>([]);
    React.useEffect(() => {
        (async () => {
            const res2 = await getGridData("inventories");
            setDataGrid(res2.data.data);
            const res1 = await getTableData({ tableName: 'inventories', filter: {} });
            convertDates(res2, res1)
            setTableData(res1.data.data);
            setColumns(convertColumns(dataGrid));

            console.log(res1.data.data);
            console.log(res2.data.data);
        })()
    }, [])
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
    const convertDates = (dataGrid: any, tableData: any) => {
        tableData.data.data.forEach((element: any) => { 
            dataGrid.data.data.forEach((element2: any) => {
                if (element2.columnType === FieldType.DATE || element2.columnType === FieldType.DATETIME) {
                    element[element2.columnName] = new Date(element[element2.columnName])
                }
            })
        });
    }
    const convertColumns = (dataGrid: any) => {
        return dataGrid.map((element: any) => {
            return { 
                field: element.columnName, 
                headerName: element.label, 
                type: convertTypes(element.columnType), 
                editable: element.editable, 
            }
        });
    }



    return (
        <div>
            <DataGrid rows={tableData} columns={columns}/>
        </div>
    );
};

export default GridTable;