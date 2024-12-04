import { Box, Rating, Typography } from '@mui/material';
import CustomModal from 'components/modals/customModal/CustomModal';
import { useActStarModal, useResult } from '../../context/context';
import React from 'react';
import { defaultAction } from 'utils/interfaces';
import { calculateTimeSpent } from 'helpers/Nam-helper/Caculate';

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
                    flexDirection: 'column',
                }}
            >
                <Rating value={actStarModal.payload} max={3} size="large" readOnly
                    sx={{
                        fontSize: '5rem' // Gấp 5 lần bình thường (khoảng 80px)
                    }}
                />
                <Typography color="#4caf50" fontSize={"30px"}>Trả lời đúng: <span>{result.yourScore} / {result.totalScore} câu</span></Typography>
                <Typography color="#4caf50" fontSize={"30px"}>Thời gian làm bài: <span>{calculateTimeSpent(result.timeStart!, result.timeEnd!)}</span></Typography>
            </Box>
        </CustomModal>
    );
};

export default StarModal;