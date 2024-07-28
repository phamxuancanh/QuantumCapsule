import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import './index.scss'

interface ICustomModalProps {
    title: string;
    open: boolean;
    children: React.ReactNode;
    type: ACTIONS;
    onSave: () => void;
    onClose: () => void;
    // setFormData: (data: any) => void;
}

const ModalAction: React.FC<ICustomModalProps> = (props: ICustomModalProps) => {
    return (
        <Modal
            open={props.open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='modal-container'

        >
            <div className='modal-box '>
                <Typography id="modal-modal-title" variant="h6" component="h2" className='modal-title'>
                    {props.title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }} className='modal-chilren'>
                    {props.children}
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    {
                        props.type === ACTIONS.VIEW ? null :
                            <Button variant="contained" color="primary" onClick={props.onSave} sx={{ mr: 2 }}>
                                Lưu
                            </Button>
                    }
                    <Button variant="outlined" onClick={() => props.onClose()}>
                        Đóng
                    </Button>
                </Box>
            </div>

        </Modal>
    );
};

export default ModalAction;