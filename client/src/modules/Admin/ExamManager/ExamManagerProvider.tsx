import React from 'react';
import Provider from './context/provider';
import ExamManager from './ExamManager';

interface PracticeProviderProps {
    // Define the props for your component here
}

const PracticeProvider: React.FC<PracticeProviderProps> = () => {
    // Implement your component logic here

    return (
        <Provider>
            <ExamManager />
        </Provider>
    );
};

export default PracticeProvider;