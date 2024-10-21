import { Box, Rating, Typography } from '@mui/material';
import CustomModal from 'components/modals/customModal/CustomModal';
import { caculateScore } from 'helpers/Nam-helper/Caculate';
import { useActStarModal, useResult } from '../../context/context';
import React from 'react';
import { defaultAction } from 'utils/interfaces';

interface IProps {

}

const StarModal: React.FC<IProps> = (props) => {
    const {actStarModal, setActStarModal} = useActStarModal()
    const {result} = useResult()
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
                <Typography variant='h1'>
                    Bạn đã đạt được {caculateScore(result.totalScore, result.yourScore)} điểm
                </Typography>
            </Box>
        </CustomModal>
    );
};

export default StarModal;