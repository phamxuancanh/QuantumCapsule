import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import './index.scss';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridSlots,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarQuickFilter,
    GridRowParams,
    GridRowSelectionModel,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { ACTIONS } from 'utils/enums';
import { generateUUID } from 'helpers/Nam-helper/GenerateUID';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
    initNewRow: any;
    toolbarComponent?: React.ReactNode;
    hideActions?: boolean;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, initNewRow } = props;
    const id = generateUUID();
    const handleClick = () => {
        setRows((oldRows) => [{...initNewRow, id: id, isNew: true}, ...oldRows]);
        setRowModesModel((oldModel) => ({
            [id]: { mode: GridRowModes.Edit },
            ...oldModel,
        }));
    };

    return (
        <GridToolbarContainer>
            {
                !props.hideActions &&
                <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} variant='outlined'>
                    Thêm mới
                </Button>
            }
            {props.toolbarComponent}
            <Box sx={{ flexGrow: 1 }} />
            <GridToolbarQuickFilter placeholder='Tìm kiếm'/>
        </GridToolbarContainer>
    );
}

export interface ISimpleTableProps {
    initData: any[];
    columns: GridColDef[];
    initNewRow: any;
    
    apiRef?: React.MutableRefObject<GridApiCommunity>; //useGridApiRef()
    pageSizeOptions?: number[];
    rowHeight?: number;
    minWidth?: number;
    checkboxSelection?: boolean;
    columnVisibilityModel?: { [key: string]: boolean };

    processRowAdd?: (newRow: any) => void;
    onRowClick?: (param: GridRowParams<any>) => void;
    onUpdateRow?: (data: any, action: ACTIONS) => Promise<boolean>;
    toolbarComponent?: React.ReactNode;
    loading?: boolean;
    getRowId?: (row: any) => string;
    onSelectionModelChange?: (newSelection: GridRowSelectionModel) => void;
    hideActions?: boolean;
}

export default function SimpleTable(props: ISimpleTableProps) {
    const [rows, setRows] = React.useState<any[]>([]);
    React.useEffect (() => {
        setRows(props.initData)
    }, [props.initData])
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        props.onUpdateRow && props.onUpdateRow(id, ACTIONS.DELETE);
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = async (newRow: GridRowModel) => {
        // const row = rows.find((r) => r.id === newRow.id);
        if(!props.onUpdateRow){
            return
        }
        let isValid = false;
        if(newRow.isNew ){
            isValid = await props.onUpdateRow(newRow, ACTIONS.CREATE);
        }
        if(!newRow.isNew){
            isValid = await props.onUpdateRow(newRow, ACTIONS.UPDATE);
        }

        if(!isValid){
            return
        }
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const convertColumns = React.useCallback((): GridColDef[] => {
        const columns: GridColDef[] = props.columns.map((prep: GridColDef) => {
            const gridColumn: GridColDef = {
                ...prep,
                headerClassName: 'table-header',
                flex: 1,
                minWidth: props.minWidth ? props.minWidth : 150,
                // editable: false
            };
            return gridColumn
        })
        return columns
    }, [props.columns, props.minWidth])


    const columns: GridColDef[] = props.hideActions ? 
    [...convertColumns()] :
    [
        ...convertColumns(),
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            headerClassName: 'table-header',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box
            sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <DataGrid
                // sx={{
                //     "& .MuiDataGrid-cell": {
                //         fontSize: "20px", // Kích thước chữ trong ô
                //     },
                //     "& .MuiDataGrid-columnHeaderTitle": {
                //         fontSize: "22px", // Kích thước chữ trong header
                //     },
                // }}
                apiRef={props.apiRef}
                rows={rows}
                columns={columns}
                loading={props.loading}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    // baseButton: EditToolbar as GridSlots['baseButton'],
                    toolbar: EditToolbar as GridSlots['toolbar']
                }}
                slotProps={{
                    pagination: {
                        labelRowsPerPage: "Số dòng mỗi trang",
                    },
                    toolbar: { setRows, setRowModesModel, initNewRow: props.initNewRow, toolbarComponent: props.toolbarComponent, hideActions: props.hideActions},
                }}
                columnVisibilityModel={props.columnVisibilityModel}
                // initialState={{
                //     pagination: { paginationModel: { pageSize: props.pageSizeOptions?.[0] || 10, page: 0,}},
                // }}
                // pageSizeOptions={props.pageSizeOptions || [10, 20]}
                hideFooter={true}
                onRowClick={ e => {props.onRowClick && props.onRowClick(e)}}
                getRowId={props.getRowId}
                rowHeight={props.rowHeight || 60}
                checkboxSelection={props.checkboxSelection}
                onRowSelectionModelChange={props.onSelectionModelChange}
            />
        </Box>
    );
}
