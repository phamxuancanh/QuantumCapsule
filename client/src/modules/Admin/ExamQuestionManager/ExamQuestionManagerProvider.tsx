import React from 'react';
import Provider from './context/provider';
import ExamQuestionManager from './ExamQuestionManager';

interface PracticeProviderProps {
    // Define the props for your component here
}

const ExamQuestionManagerProvider: React.FC<PracticeProviderProps> = () => {
    // Implement your component logic here

    return (
        <Provider>
            <ExamQuestionManager />
        </Provider>
    );
};

export default ExamQuestionManagerProvider;