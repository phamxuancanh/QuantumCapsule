import { Button, SxProps } from '@mui/material';
import React from 'react';
import { ACTIONS, IconName } from 'utils/enums';
import * as Icons from '@mui/icons-material';
export interface IIconBtnProps {
    iconName: IconName
    action?: ACTIONS
    name: string
    onClick: (name: string, action?: ACTIONS) => void
    disabled?: boolean
    variant?: 'text' | 'outlined' | 'contained'
    sx?: SxProps
}

const IconBtn: React.FC<IIconBtnProps> = (props: IIconBtnProps) => {
    const { iconName, action, name, onClick, variant = 'text',  sx, disabled } = props;
    return (
        <Button 
            onClick={()=>{onClick(name, action)}} 
            startIcon={React.createElement(Icons[iconName as IconName])}
            variant={variant}
            sx={sx}
            disabled={disabled}
        >
            <div>{props.name}</div>
        </Button>
    );
};

export default IconBtn;