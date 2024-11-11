import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

interface IProps {
    totalQuestions: number,
    completedQuestions: number,
}

const GameProgress: React.FC<IProps> = (props) => {
    const { totalQuestions, completedQuestions } = props;
    const progress = (completedQuestions / totalQuestions) * 100;

    return (
        <Box sx={{ position: 'relative', width: '100%', mt: 2 }}>
            {/* Thanh progress */}
            <LinearProgress variant="determinate" value={progress} sx={{ height: 15, borderRadius: 5 }} color='primary'/>

            {/* Chiếc xe */}
            <Box
                sx={{
                    py: 1,
                    position: 'absolute',
                    top: -20, // Điều chỉnh vị trí của xe theo trục y
                    left: `calc(${progress}% - 10px)`, // Điều chỉnh vị trí của xe theo phần trăm tiến độ
                    transition: 'left 0.3s ease-in-out', // Animation chuyển động
                }}
            >
                <LocalShippingIcon style={{ fontSize: 40, color: '#EC8305' }} />
            </Box>
        </Box>
    );
};

export default GameProgress;
