import React from 'react';
import { Theme, makeStyles, Modal, Backdrop, Fade, Box, Typography, useMediaQuery, useTheme, Button } from '@mui/material';

interface ICustomModalProps {
    title: string;
    open: boolean;
    children: React.ReactNode;
    setOpenModal: (open: boolean) => void;
}

const CustomModal: React.FC<ICustomModalProps> = (props: ICustomModalProps) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isSmallScreen ? '90%' : isMediumScreen ? '80%' : '75%',
        maxWidth: '90%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    return (
        <Modal
            open={props.open}
            // onClose={() => props.setOpenModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {props.title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {props.children}
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => props.setOpenModal(false)}>
                        Đóng
                    </Button>
                </Box>
            </Box>
            
        </Modal>
    );
};

export default CustomModal;