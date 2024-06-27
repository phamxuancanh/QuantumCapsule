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
    GridToolbar,
} from '@mui/x-data-grid';
import { IAction } from 'utils/interfaces';
import { GridApiCommunity, rowsMetaStateInitializer } from '@mui/x-data-grid/internals';

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = Date.now();
        setRows((oldRows) => [{ id, name: '', age: 20, isNew: true }, ...oldRows]);
        setRowModesModel((oldModel) => ({
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
            ...oldModel,
        }));
    };

    return (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} variant='outlined'>
                Add record
            </Button>
            <GridToolbar />
        </GridToolbarContainer>
    );
}

export interface ISimpleTableProps {
    apiRef: React.MutableRefObject<GridApiCommunity>; //useGridApiRef()
    initData: any[];
    columns: GridColDef[];
    keys: string[]

    pageSizeOptions?: number[];
    rowHeight?: number;
    minWidth?: number;
    checkboxSelection?: boolean;
    columnVisibilityModel?: { [key: string]: boolean };

    onUpdateRow?: (updatedRow: any, action: IAction) => void;
    processRowAdd?: (newRow: any) => void;
    onRowClick?: (param: any) => void;
    // getRowId?: (row: any) => string;
}

export default function SimpleTable(props: ISimpleTableProps) {
    const [rows, setRows] = React.useState(
        props.initData.map((row, index) => ({ 
            ...row, isNew: false
        })),
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
        const tempRows = rows.filter((row) => {
            const idRow = props.keys.map((key) => row[key]).join('');
            return idRow !== id
        });
        setRows(tempRows);
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
        console.log('newRow', newRow);
        
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
            <Button onClick={() => {
                console.log(rows)
            }}>log</Button>
            <DataGrid
                apiRef={props.apiRef}
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                    toolbar: EditToolbar as GridSlots['toolbar'],
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel, showQuickFilter: true},
                }}
                columnVisibilityModel={props.columnVisibilityModel}
                initialState={{
                    pagination: { paginationModel: { pageSize: props.pageSizeOptions?.[0] || 10, page: 1 } },
                }}
                pageSizeOptions={props.pageSizeOptions || [10, 20]}
                onRowClick={props.onRowClick}
                getRowId={(row) => {
                    return props.keys.map((key) => row[key]).join('');
                }}
                rowHeight={props.rowHeight || 60}
                checkboxSelection={props.checkboxSelection || true}
            />
        </Box>
    );
}
