import React, { useState } from 'react';
import { Drawer, Button, List, ListItem, ListItemText, IconButton, ListItemButton, Divider, Box, Card } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export interface IDrawerMenuProps {
    width?: number;
    archor?: 'left' | 'right';
    labels: string[]
    onClick?: (text: string) => void;
}


const DrawerMenu: React.FC<IDrawerMenuProps> = (props: IDrawerMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (text: string) => {
        props.onClick && props.onClick(text);
    }

    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setIsOpen(open);
    };

    const drawerContent = (
        <div
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {props.labels.map((text, index) => (
                    <Box  key={index} onClick={()=>{handleClick(text)}}>
                        <ListItem >
                            <ListItemButton >
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </Box>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{

        }}>
            <IconButton edge="start" color="default"  aria-label="menu" onClick={toggleDrawer(true)} sx={{
                backgroundColor: 'primary.main',
                ":hover": {
                    backgroundColor: 'primary.dark'
                }
            }}>
                <MenuIcon fontSize='large' />
            </IconButton>
            <Drawer anchor={props.archor} open={isOpen} onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.width },
                }}
            >
                {drawerContent}
            </Drawer>
        </Box >
    );
};

export default DrawerMenu;
