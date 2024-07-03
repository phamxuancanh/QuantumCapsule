import { Box, Button, SxProps } from '@mui/material';
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
    sxIcon?: SxProps
}

const IconBtn: React.FC<IIconBtnProps> = (props: IIconBtnProps) => {
    const { iconName, action, name, onClick, variant = 'text',  sx, disabled, sxIcon } = props;
    const IconComponent = React.createElement(Icons[iconName as IconName], {sx: sxIcon})
    return (
        <Button 
            onClick={()=>{onClick(name, action)}} 
            // startIcon={IconComponent}
            variant={variant}
            sx={sx}
            disabled={disabled}
        >
            {IconComponent}
            <Box sx={{marginLeft: 1}}>{props.name}</Box>
        </Button>
    );
};

export default IconBtn;