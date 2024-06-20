import * as Icons from '@mui/icons-material';


import { ListItemIcon, ListItemText, MenuItem, MenuList, Paper} from '@mui/material';
import {IconName} from 'utils/enums'
import {IMenuItem} from 'utils/interfaces'

import React from 'react';


export interface IIconMenuProps {
    listMenuItem: IMenuItem[];
    onClickItem: (itemName: string) => void;
}

const IconMenu: React.FC<IIconMenuProps> = (props: IIconMenuProps) => {


    return (
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
            <MenuList>
                {props.listMenuItem.map((item, index) => (
                    <MenuItem key={index}  onClick={ ()=>props.onClickItem(item.name)}>
                        <ListItemIcon>
                            {React.createElement(Icons[item.icon as IconName])}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </MenuItem>
                ))}
            </MenuList>
        </Paper>
    );
};

export default IconMenu;