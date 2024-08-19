import React from 'react';
import Provider from './context/provider';
import Practice from './Practice';

interface PracticeProviderProps {
    // Define the props for your component here
}

const PracticeProvider: React.FC<PracticeProviderProps> = () => {
    // Implement your component logic here

    return (
        <Provider>
            <Practice />
        </Provider>
    );
};

export default PracticeProvider;