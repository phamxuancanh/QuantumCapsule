import React from 'react';
import { IAnswer } from 'api/answer/answer.interfaces';
import CustomModal from 'components/modals/customModal/CustomModal';
import { useActCongratulation } from 'modules/Practice-v2/context/context';
import { defaultAction } from 'utils/interfaces';
import { Box } from '@mui/material';

interface CongratulationBoxProps {
    answer: IAnswer,
    open: boolean
}

const CongratulationBox: React.FC<CongratulationBoxProps> = (props) => {
    const {actCongratulation, setActCongratulation} = useActCongratulation()
    return (
        <CustomModal title='Bạn đã đạt được:' open={actCongratulation.open} setOpenModal={()=>{setActCongratulation(defaultAction)}}
            width='50%'
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {props.answer.isCorrect ? 'Chính xác' : 'Không chính xác'}
            </Box>
        </CustomModal>
    );
};

export default CongratulationBox;