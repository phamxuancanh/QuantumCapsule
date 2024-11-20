import React from 'react';
import { Modal, Box, Typography, useMediaQuery, useTheme, Button } from '@mui/material';

interface ICustomModalProps {
    title: string;
    open: boolean;
    children: React.ReactNode;
    setOpenModal: (open: boolean) => void;
    onComfirm?: () => void;
    width?: string;
}

const ComfirmModal: React.FC<ICustomModalProps> = (props: ICustomModalProps) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: props.width,
        // width: props.width ?? isSmallScreen ? '90%' : isMediumScreen ? '80%' : '75%',
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
                <Typography id="modal-modal-title" fontSize={30} fontWeight={700}>
                    {props.title}
                </Typography>
                {props.children}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1}}>
                    <Button variant="outlined" color='success' onClick={() => {
                        props.onComfirm && props.onComfirm()
                        props.setOpenModal(false)
                    }}>
                        Đống ý
                    </Button>
                    <Button variant="outlined" onClick={() => props.setOpenModal(false)}>
                        Đóng
                    </Button>
                </Box>
            </Box>
            
        </Modal>
    );
};

export default ComfirmModal;