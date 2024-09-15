import React from 'react';
import Provider from './context/provider';
import QuestionManager from './QuestionManager';

interface PracticeProviderProps {
    // Define the props for your component here
}

const PracticeProvider: React.FC<PracticeProviderProps> = () => {
    // Implement your component logic here

    return (
        <Provider>
            <QuestionManager />
        </Provider>
    );
};

export default PracticeProvider;