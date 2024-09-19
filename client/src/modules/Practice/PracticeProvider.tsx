import React, { useEffect } from 'react';
import Provider from './context/provider';
import Practice from './Practice';

interface PracticeProviderProps {
    // examId: string;
}

const PracticeProvider: React.FC<PracticeProviderProps> = (props) => {
    // Implement your component logic here
    return (
        <Provider>
            <Practice />
        </Provider>
    );
};

export default PracticeProvider;