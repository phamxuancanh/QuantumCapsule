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
import { getGridData } from 'api/get/get.api';
import { ACTIONS, InputType } from 'utils/enums';
import { convertDate } from 'utils/functions';
import { IAction, IGrid } from 'utils/interfaces'
import { faIR } from '@mui/material/locale';


interface ICustomFormProps {
    tableName: string;
    // initData: {};
    action: ACTIONS;
    formParams: any[];
    formData: {};
    setFormData: (data: any) => void;
}

const BasicForm: React.FC<ICustomFormProps> = (props: ICustomFormProps) => {

    const [gridData, setGridData] = useState<IGrid[]>([]);
    const { setFormData } = props;
    useEffect(() => {
        (async () => {
            const res = await getGridData(props.tableName);
            setGridData(res.data.data);
        })();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown; }> | SelectChangeEvent<never>) => {
        const { name, value } = e.target;
        setFormData((prevData: {}) => ({
            ...prevData,
            [name as string]: value as string,
        }));
    };


    return (
        <Box>
            <form>
                <Grid container spacing={2}>
                    {
                        gridData.sort((a: IGrid, b: IGrid) => a.position - b.position).map((item) => {
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
                                case InputType.CHECKBOX:
                                    const checkBoxParams = props.formParams.find((param) => param.name === item.columnName);
                                    return (
                                        <Grid item xs={12} md={6} key={item.columnName}>
                                            <FormGroup>
                                                <InputLabel>{checkBoxParams?.label}</InputLabel>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name={checkBoxParams?.name || ""}
                                                            value={checkBoxParams?.value || ""}
                                                            disabled={props.action === ACTIONS.VIEW ? true : !item.editable}
                                                            defaultChecked={props.formData?.[item.columnName as keyof typeof props.formData] === checkBoxParams?.value}
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                    }
                                                    label={checkBoxParams?.labelValue}
                                                />
                                            </FormGroup>
                                        </Grid>
                                    );
                                case InputType.SELECT:
                                    const selectBoxParams = props.formParams.find((param) => param.name === item.columnName);
                                    return (
                                        <Grid item xs={12} md={6} key={item.columnName}>
                                            <FormGroup>
                                                <InputLabel>{selectBoxParams?.label}</InputLabel>
                                                <Select
                                                    name={selectBoxParams?.name}
                                                    defaultValue={props.formData?.[item.columnName as keyof typeof props.formData]}
                                                    disabled={props.action === ACTIONS.VIEW ? true : !item.editable}
                                                    onChange={
                                                        handleChange
                                                    }
                                                >
                                                    {selectBoxParams?.values?.map((value: any) => {
                                                        return (
                                                            <MenuItem value={value.value}>{value.label}</MenuItem>
                                                        )
                                                    })}
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
                        })
                    }
                </Grid>
            </form >
        </Box>
    );
};

export default BasicForm;
