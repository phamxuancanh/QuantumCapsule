import { Box, Rating, Typography } from '@mui/material';
import CustomModal from 'components/modals/customModal/CustomModal';
import { calculateScore, calculateTimeSpent } from 'helpers/Nam-helper/Caculate';
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
                    flexDirection: 'column',
                }}
            >
                <Typography variant='h1' color={"#72BF78"}>
                    {calculateScore(result.totalScore, result.yourScore)} điểm
                </Typography>
                <Typography fontSize={"25px"} >
                    Trả lời đúng:  {result.yourScore}/{result.totalScore} câu
                </Typography>
                <Typography fontSize={"25px"} >
                    Thời gian làm bài: {calculateTimeSpent(result.timeStart!, result.timeEnd!)}
                </Typography>

            </Box>
        </CustomModal>
    );
};

export default StarModal;