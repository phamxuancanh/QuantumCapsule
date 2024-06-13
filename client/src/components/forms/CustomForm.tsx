import React, { useEffect, useState } from 'react';
import {
    TextField,
    Grid,
    Checkbox,
    FormControlLabel,
    FormGroup,
    InputLabel,
    Select,
    MenuItem,
    Box,
    SelectChangeEvent,
} from '@mui/material';
import { getGridData, getDirections } from 'api/get/get.api';
import { ACTIONS, InputType } from 'utils/enums';
import { convertDate } from 'utils/functions';
import { IAction, IDataSource, IGrid } from 'utils/interfaces'



interface ICustomFormProps {
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
const BasicForm: React.FC<ICustomFormProps> = (props: ICustomFormProps) => {

    const { setFormData } = props;
    const [state, setState] = useState<IState>({
        dataSources: [],
        gridData: [],
    });
    useEffect(() => {
        console.log(props.formData);

        (async () => {
            const res = await getGridData(props.tableName);
            const tempGridData: IGrid[] = res.data.data
            const tempDataSources: IDataSource[] = []
            for (let i = 0; i < tempGridData.length; i++) {
                if (tempGridData[i].dataSource === null) continue;
                const res = await getDirections(tempGridData[i].dataSource);
                tempDataSources[i] = { name: tempGridData[i].columnName, values: res.data.data };
            }
            setState(prep => ({ ...prep, dataSources: tempDataSources, gridData: tempGridData }))
        })();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown; }> | SelectChangeEvent<never>) => {
        const { name, value } = e.target;
        setFormData({ ...props.formData, [name as string]: value });
    };

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
                                    // case InputType.CHECKBOX:
                                    // const checkBoxParams = props.formParams.find((param) => param.name === item.columnName);
                                    // return (
                                    //     <Grid item xs={12} md={6} key={item.columnName}>
                                    //         <FormGroup>
                                    //             <InputLabel>{checkBoxParams?.label}</InputLabel>
                                    //             <FormControlLabel
                                    //                 control={
                                    //                     <Checkbox
                                    //                         name={checkBoxParams?.name || ""}
                                    //                         value={checkBoxParams?.value || ""}
                                    //                         disabled={props.action === ACTIONS.VIEW ? true : !item.editable}
                                    //                         defaultChecked={props.formData?.[item.columnName as keyof typeof props.formData] === checkBoxParams?.value}
                                    //                         onChange={
                                    //                             handleChange
                                    //                         }
                                    //                     />
                                    //                 }
                                    //                 label={checkBoxParams?.labelValue}
                                    //             />
                                    //         </FormGroup>
                                    //     </Grid>
                                    // );
                                    case InputType.SELECT:
                                        return (
                                            <Grid item xs={12} md={6} key={item.columnName}>
                                                <FormGroup>
                                                    <InputLabel>{item.label}</InputLabel>
                                                    <Select
                                                        name={item.columnName}
                                                        defaultValue={props.formData?.[item.columnName as keyof typeof props.formData]}
                                                        disabled={props.action === ACTIONS.VIEW ? true : !item.editable}
                                                        onChange={
                                                            handleChange
                                                        }
                                                    >
                                                        {
                                                            state.dataSources.find((dataSource) => dataSource?.name === item.columnName)?.values.map((value) => {
                                                                return (
                                                                    <MenuItem value={value.value}>{value.label}</MenuItem>
                                                                )
                                                            })
                                                        }
                                                    </Select>
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
                                    default: return <h1>nothing</h1>
                                }
                            }
                        })
                    }
                </Grid>
            </form >
        </Box>
    );
};

export default BasicForm;
