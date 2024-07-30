import React, { useEffect, useState } from 'react';
import {
    TextField,
    Grid,
    FormGroup,
    InputLabel,
    Select,
    MenuItem,
    Box,
    SelectChangeEvent,
    Autocomplete,
} from '@mui/material';
import { getGridData, getDirections } from 'api/get/get.api';
import { ACTIONS, InputType } from 'utils/enums';
import { convertDate } from 'utils/functions';
import { IDataSource } from 'utils/interfaces'
import { IGrid } from 'api/api-shared';



export interface IGridFormProps {
    tableName: string;
    // initData: {};
    action: ACTIONS;
    // formParams: any[];
    formData: {};
    setFormData: (data: any) => void;
}
interface IState {
    dataSources: IDataSource[];
    gridData: IGrid[];
}
const GridForm: React.FC<IGridFormProps> = (props: IGridFormProps) => {

    const { setFormData } = props;
    const [state, setState] = useState<IState>({
        dataSources: [],
        gridData: [],
    });
    useEffect(() => {
        console.log(props.formData);

        (async () => {
            const res = await getGridData(props.tableName);
            const tempGridData: IGrid[] = res.data
            const tempDataSources: IDataSource[] = []
            for (let i = 0; i < tempGridData.length; i++) {
                if (tempGridData[i].dataSource === null) continue;
                const res = await getDirections(tempGridData[i].dataSource!);
                tempDataSources[i] = { name: tempGridData[i].columnName, values: res.data };
            }
            console.log(tempDataSources);

            setState(prep => ({ ...prep, dataSources: tempDataSources, gridData: tempGridData }))
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tableName]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown; }> | SelectChangeEvent<never>) => {
        const { name, value } = e.target;
        // console.log(name, value);

        setFormData({ ...props.formData, [name as string]: value });
    };
    const handleSelectChange = (name: string, value: any) => {
        // console.log(name, value);
        setFormData({ ...props.formData, [name as string]: value });
    }

    return (
        <Box>
            <form>
                <Grid container spacing={2}>
                    {
                        state.gridData.sort((a: IGrid, b: IGrid) => a.position - b.position).map((item) => {
                            if (item.isDisplayForm) {
                                switch (item.inputType) {
                                    case InputType.TEXT:
                                        return <Grid item xs={12} md={6} key={item.columnName}>
                                            <FormGroup>
                                                <InputLabel>{item.label || ""}</InputLabel>
                                                <TextField
                                                    name={item.columnName || ""}
                                                    defaultValue={props.formData?.[item.columnName as keyof typeof props.formData]}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    disabled={props.action === ACTIONS.VIEW ? true : !item.editable}
                                                    helperText={item.regexMessage}
                                                    inputProps={{
                                                        pattern: item.regex,
                                                    }}
                                                    error={
                                                        item.regex ?
                                                            !new RegExp(item.regex).test(props.formData?.[item.columnName as keyof typeof props.formData] as string)
                                                            : false
                                                    }
                                                    fullWidth
                                                // required
                                                />
                                            </FormGroup>
                                        </Grid>
                                    case InputType.NUMBER:
                                        return <Grid item xs={12} md={6} key={item.columnName}>
                                            <FormGroup>
                                                <InputLabel>{item.label || ""}</InputLabel>
                                                <TextField
                                                    name={item.columnName || ""}
                                                    defaultValue={props.formData?.[item.columnName as keyof typeof props.formData]}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    disabled={props.action === ACTIONS.VIEW ? true : !item.editable}
                                                    helperText={item.regexMessage}
                                                    inputProps={{
                                                        pattern: item.regex,
                                                    }}
                                                    error={
                                                        item.regex ?
                                                            !new RegExp(item.regex).test(props.formData?.[item.columnName as keyof typeof props.formData] as string)
                                                            : false
                                                    }
                                                    fullWidth
                                                    // required
                                                    type='number'
                                                />
                                            </FormGroup>
                                        </Grid>
                                    case InputType.SELECT:
                                        const directionValues = state.dataSources.find((dataSource) => dataSource?.name === item.columnName)?.values;
                                        return (
                                            <Grid item xs={12} md={6} key={item.columnName}>
                                                <FormGroup>
                                                    <InputLabel>{item.label}</InputLabel>
                                                    <Autocomplete
                                                        freeSolo
                                                        disableClearable
                                                        defaultValue={
                                                            item.displayField ?
                                                                props.formData?.[item.displayField as keyof typeof props.formData]
                                                                : props.formData?.[item.columnName as keyof typeof props.formData]
                                                        }
                                                        disabled={props.action === ACTIONS.VIEW ? true : !item.editable}
                                                        onChange={(_, v) => {
                                                            const name = item.columnName as string;
                                                            const value = directionValues?.find(dict => dict.label === v)?.value
                                                            handleSelectChange(name, value)
                                                        }}
                                                        options={directionValues?.map((option) => option.label) || []}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    type: 'search',
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </FormGroup>
                                            </Grid>
                                        );
                                    case InputType.DATETIME:
                                        return (
                                            <Grid item xs={12} md={6} key={item.columnName}>
                                                <FormGroup>
                                                    <InputLabel>{item.label || ""}</InputLabel>
                                                    <TextField
                                                        name={item.columnName || ""}
                                                        defaultValue={convertDate(props.formData?.[item.columnName as keyof typeof props.formData])}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        disabled={props.action === ACTIONS.VIEW ? true : !item.editable}
                                                        fullWidth
                                                        required
                                                        type='datetime-local'
                                                    />
                                                </FormGroup>
                                            </Grid>
                                        );
                                        case InputType.DATE:
                                        return (
                                            <Grid item xs={12} md={6} key={item.columnName}>
                                                <FormGroup>
                                                    <InputLabel>{item.label || ""}</InputLabel>
                                                    <TextField
                                                        name={item.columnName || ""}
                                                        defaultValue={convertDate(props.formData?.[item.columnName as keyof typeof props.formData])}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        disabled={props.action === ACTIONS.VIEW ? true : !item.editable}
                                                        fullWidth
                                                        required
                                                        type='date'
                                                    />
                                                </FormGroup>
                                            </Grid>
                                        );
                                    default: return <h1>nothing</h1>
                                }
                            }
                            return null;
                        })
                    }
                </Grid>
            </form >
        </Box>
    );
};

export default GridForm;
