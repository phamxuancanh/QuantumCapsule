import { Box, Rating } from '@mui/material';
import CustomModal from 'components/modals/customModal/CustomModal';
import { useActStarModal } from 'modules/Practice/context/context';
import React from 'react';
import { defaultAction } from 'utils/interfaces';

interface IProps {

}

const StarModal: React.FC<IProps> = (props) => {
    const {actStarModal, setActStarModal} = useActStarModal()
    return (
        <CustomModal title='Bạn đã đạt được:' open={actStarModal.open} setOpenModal={()=>{setActStarModal(defaultAction)}}
            width='50%'
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Rating value={actStarModal.payload} max={3} size="large" readOnly
                    sx={{
                    fontSize: '5rem' // Gấp 5 lần bình thường (khoảng 80px)
                    }}
                />
            </Box>
        </CustomModal>
    );
};

export default StarModal;