import {  Button, Fade, Paper,  Popper } from '@mui/material';
import * as Icons from '@mui/icons-material';
import React from 'react';
import { IconName } from 'utils/enums'; // Đảm bảo rằng bạn đã định nghĩa enum IconName trong một file khác
import './index.scss';

export interface IconPopupProps {
    icon: IconName;
    text: string;
    children?: React.ReactNode;
    placement?: 'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'left-start' | 'left' | 'left-end';
}

const IconPopup: React.FC<IconPopupProps> = ({ icon, text, children, placement }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };
    const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(false);
    };
    return (
        <div >
            <Button className="popup-iconButton" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <span className='popup-icon'>{React.createElement(Icons[icon as IconName])}</span>
                <span className='popup-text'>{text}</span>
            </Button>
            <Popper
                sx={{ zIndex: 1200 }}
                open={open}
                anchorEl={anchorEl}
                placement={placement ? placement : 'bottom'}
                transition
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={500}>
                        <Paper sx={{marginTop: "5px"}}>
                            {children}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
};

export default IconPopup;
