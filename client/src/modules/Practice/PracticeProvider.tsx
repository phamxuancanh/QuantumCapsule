import React, { useEffect } from 'react';
import Provider from './context/provider';
import Practice from './Practice';
import { Box } from '@mui/material';

interface PracticeProviderProps {
    // examId: string;
}

const PracticeProvider: React.FC<PracticeProviderProps> = (props) => {
    // Implement your component logic here
    return (
        <Provider>
            <Box sx={{
                    position: "relative",
                }}
            >
                <Box sx={{position: "absolute", top: 2, right: "130px"}}>
                    <img src="/student.png" alt="Testing" width={"120px"}/>
                </Box>
                <Box sx={{position: "absolute", top: 2, right: "20px"}}>
                    <img src="/test.png" alt="Testing" width={"120px"}/>
                </Box>
                <Practice />

            </Box>
        </Provider>
    );
};

export default PracticeProvider;