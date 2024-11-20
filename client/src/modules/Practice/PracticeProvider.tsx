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
                <Box sx={{position: "absolute", top: 5, right: "0px", zIndex:-100, display: {xs: "none", md: "block"} }} >
                    <Box display={"flex"}>
                        <img src="/icon1.png" alt="Testing" width={"300px"}/>
                        <img src="/icon2.png" alt="Testing" width={"300px"}/>
                    </Box>
                </Box>
                {/* <Box sx={{position: "absolute", top: 5, right: "15px", zIndex:-100}}>
                </Box> */}
                {/* <Box sx={{position: "absolute", bottom: 5, right: "10%", zIndex:-100}}>
                     <img src="/icon1.png" alt="Testing" width={"300px"}/>
                </Box> */}
                <Practice />

            </Box>
        </Provider>
    );
};

export default PracticeProvider;