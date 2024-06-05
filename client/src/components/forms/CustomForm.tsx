import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Grid,
    Checkbox,
    FormControlLabel,
    FormGroup,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';
import { getGridData } from 'api/get/get.api';
import { ACTIONS, InputType } from 'utils/enums';



interface ICustomFormProps {
    tableName: string;
    initData: {};
    action: ACTIONS;
    formParams: any[];
    setFormData: (data: any) => void;
}

const BasicForm: React.FC<ICustomFormProps> = (props: ICustomFormProps) => {

    // const [formData, setFormData] = useState<{}>(props.initData);
    const [gridData, setGridData] = useState<any[]>([]);
    const {setFormData} = props;
    useEffect(() => {
        (async () => {
            const res = await getGridData(props.tableName);
            setGridData(res.data.data);
        })();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown; }>) => {
        const { name, value } = e.target;
        setFormData((prevData : {}) => ({
            ...prevData,
            [name as string]: value as string,
        }));
    };


    return (
        <Box>
            <form>
                <Grid container spacing={2}>
                    {
                        gridData.map((item) => {
                            switch (item.inputType) {
                                case InputType.TEXT:
                                    return <Grid item xs={12} md={6} key={item.columnName}>
                                        <FormGroup>
                                            <InputLabel>{item.label || ""}</InputLabel>
                                            <TextField
                                                // label={item.label || ""}
                                                name={item.columnName || ""}
                                                defaultValue={props.initData?.[item.columnName as keyof typeof props.initData] || ""}
                                                onChange={handleChange}
                                                variant="outlined"
                                                disabled={props.action === ACTIONS.VIEW? true : !item.editable}
                                                fullWidth
                                                required
                                            />
                                        </FormGroup>
                                    </Grid>
                                case InputType.NUMBER:
                                    return <Grid item xs={12} md={6} key={item.columnName}>
                                        <FormGroup>
                                            <InputLabel>{item.label || ""}</InputLabel>
                                            <TextField
                                                name={item.columnName || ""}
                                                defaultValue={props.initData?.[item.columnName as keyof typeof props.initData] || 0}
                                                onChange={handleChange}
                                                variant="outlined"
                                                disabled={props.action === ACTIONS.VIEW? true : !item.editable}
                                                fullWidth
                                                required
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
                                                            disabled={props.action === ACTIONS.VIEW? true : !item.editable}
                                                            defaultChecked={props.initData?.[checkBoxParams?.name as keyof typeof props.initData] === checkBoxParams?.value || checkBoxParams?.defaultChecked}
                                                            onChange={
                                                                (e) => {
                                                                    const { name, value } = e.target;
                                                                    setFormData((prevData : {}) => ({
                                                                        ...prevData,
                                                                        [name]: value,
                                                                    }));
                                                                }
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
                                                    defaultValue={props.initData?.[item.columnName as keyof typeof props.initData]}
                                                    disabled={props.action === ACTIONS.VIEW? true : !item.editable}
                                                    onChange={
                                                        (e) => {
                                                            const { name, value } = e.target;
                                                            setFormData((prevData : {}) => ({
                                                                ...prevData,
                                                                [name]: value,
                                                            }));
                                                        }
                                                    }
                                                >
                                                    {selectBoxParams?.values?.map((value : any) => {
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
                                                    defaultValue={props.initData?.[item.columnName as keyof typeof props.initData] || ""}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    disabled={props.action === ACTIONS.VIEW? true : !item.editable}
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
