import React, { useEffect } from 'react';
import Provider from './context/provider';
import Practice from './Practice';
import { Box } from '@mui/material';

interface PracticeProviderProps {
    // examId: string;
}

const PracticeProviderV2: React.FC<PracticeProviderProps> = (props) => {
    // Implement your component logic here
    return (
        <Provider>
            <Box
                sx={{
                    backgroundImage: 'url(/bg1.png)',
                    backgroundRepeat: 'no-repeat', // Không lặp lại ảnh nền
                    backgroundSize: 'cover', // Ảnh nền sẽ được kéo dãn để bao phủ toàn bộ
                    backgroundPosition: 'center bottom', // Canh giữa ảnh nền
                }}
            >
                <Practice />

            </Box>
        </Provider>
    );
};

export default PracticeProviderV2;