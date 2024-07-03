import { Autocomplete, Card, CardContent, TextField } from '@mui/material';
import React, { useState } from 'react';

export interface ISelectFilterProps {
    options: OptionType[];
    onSelected?: (value: OptionType | null) => void;
}
interface OptionType {
    label: string;
    value: string;
}

const SelectFilter: React.FC<ISelectFilterProps> = (props: ISelectFilterProps) => {
    const [inputValue, setInputValue] = useState('');
    const handleSelected = (newValue: OptionType | null) => {
        props.onSelected && props.onSelected(newValue);
    }
    return (
        <Card sx={{padding:'10px', maxWidth: "320px"}}>
            <Autocomplete
                onChange={(_, newValue: OptionType | null) => {
                    handleSelected(newValue)
                }}
                inputValue={inputValue}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                options={props.options}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                    <TextField {...params} label="Search" variant="outlined" />
                )}
                style={{ width: 300 }}
            />
        </Card>
    );
};

export default SelectFilter;