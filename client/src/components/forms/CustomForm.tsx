import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Grid,
} from '@mui/material';
import { getGridData } from 'api/get/get.api';


interface ICustomFormProps {
    tableName: string;
    initData: {};
}

const BasicForm: React.FC<ICustomFormProps> = (props: ICustomFormProps) => {
    const [formData, setFormData] = useState<{}>(props.initData);
    const [gridData, setGridData] = useState<any[]>([]);
    useEffect(() => {
        (async () => {
            const res = await getGridData(props.tableName);
            setGridData(res.data.data);
        })();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown; }>) => {
        const { name, value } = e.target;        
        setFormData((prevData) => ({
            ...prevData,
            [name as string]: value as string,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {
                    gridData.map((item) => {
                        return item.isDisplay ? (
                            <Grid item xs={12} md={6} key={item.columnName}>
                                <TextField
                                    label={item.label || ""}
                                    name={item.columnName || ""}
                                    defaultValue={props.initData?.[item.columnName as keyof typeof props.initData] || ""}
                                    onChange={handleChange}
                                    variant="outlined"
                                    disabled={!item.editable}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        ) : null;
                    })
                }
                <Button type="submit" variant="contained" color="primary">
                    Submit
                </Button>

            </Grid>
        </form>
    );
};

export default BasicForm;
