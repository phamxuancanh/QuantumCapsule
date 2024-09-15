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
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { ACTIONS } from 'utils/enums';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
    initNewRow: any;
    toolbarComponent?: React.ReactNode;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel, initNewRow } = props;

    const handleClick = () => {
        setRows((oldRows) => [{...initNewRow, isNew: true}, ...oldRows]);
        setRowModesModel((oldModel) => ({
            [initNewRow.id]: { mode: GridRowModes.Edit },
            ...oldModel,
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} variant='outlined'>
                Add record
            </Button>
            {props.toolbarComponent}
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector/>
            <GridToolbarExport/>
            <Box sx={{ flexGrow: 1 }} />
            <GridToolbarQuickFilter />
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
    onUpdateRow?: (data: any, action: ACTIONS) => void;
    toolbarComponent?: React.ReactNode;
    loading?: boolean;
    getRowId?: (row: any) => string;
}

export default function SimpleTable(props: ISimpleTableProps) {
    const [rows, setRows] = React.useState(
        props.initData
    );
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

    const processRowUpdate = (newRow: GridRowModel) => {
        // const row = rows.find((r) => r.id === newRow.id);
        
        if(newRow.isNew){
            props.onUpdateRow && props.onUpdateRow(newRow, ACTIONS.CREATE);
        }
        if(!newRow.isNew){
            props.onUpdateRow && props.onUpdateRow(newRow, ACTIONS.UPDATE);
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


    const columns: GridColDef[] = [
        ...convertColumns(),
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
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
            {/* {
                React.useMemo(() => {
                    return <DataGrid
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
                            toolbar: EditToolbar as GridSlots['toolbar'],
                        }}
                        slotProps={{
                            toolbar: { setRows, setRowModesModel, initNewRow: props.initNewRow, toolbarComponent: props.toolbarComponent },
                        }}
                        columnVisibilityModel={props.columnVisibilityModel}
                        initialState={{
                            pagination: { paginationModel: { pageSize: props.pageSizeOptions?.[0] || 10, page: 1 } },
                        }}
                        pageSizeOptions={props.pageSizeOptions || [10, 20]}
                        onRowClick={ e => {props.onRowClick && props.onRowClick(e)}}
                        getRowId={props.getRowId}
                        rowHeight={props.rowHeight || 60}
                        checkboxSelection={props.checkboxSelection || true}
                    />
                }, [rows])
            } */}
            <DataGrid
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
                    toolbar: EditToolbar as GridSlots['toolbar'],
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel, initNewRow: props.initNewRow, toolbarComponent: props.toolbarComponent },
                }}
                columnVisibilityModel={props.columnVisibilityModel}
                initialState={{
                    pagination: { paginationModel: { pageSize: props.pageSizeOptions?.[0] || 10, page: 1 } },
                }}
                pageSizeOptions={props.pageSizeOptions || [10, 20]}
                onRowClick={ e => {props.onRowClick && props.onRowClick(e)}}
                getRowId={props.getRowId}
                rowHeight={props.rowHeight || 60}
                checkboxSelection={props.checkboxSelection || true}
            />
        </Box>
    );
}
