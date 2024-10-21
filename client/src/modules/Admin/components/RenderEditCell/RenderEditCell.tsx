import { Autocomplete, TextField } from '@mui/material';
import { GridRenderEditCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import React from 'react';

interface IProps {
    params: GridRenderEditCellParams<any, any, any, GridTreeNodeWithRender>
    dataParams: any,
    editCellField: string
    label: string
}

const RenderEditCell: React.FC<IProps> = (props) => {
    return (
        <Autocomplete
            sx={{ '& fieldset': { borderRadius: 0 }}}
            fullWidth
            options={props.dataParams}
            value={props.dataParams.find((item: any) => item?.id === props.params?.value) || null}
            getOptionLabel={(option: any) => option[props.label] || ''}
            onChange={(event, newValue) => {
              console.log("newValue", newValue);
              
                props.params.api.setEditCellValue({
                    id: props.params.id,
                    field: props.editCellField,
                    value: newValue?.id, // Assign the ID value to the cell
                });
            }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Chọn"
              variant="outlined"
            />
          )}
        />
      );
};

export default RenderEditCell;