import React from 'react';
import Provider from './context/provider';
import LessonManager from './LessonManager';

interface PracticeProviderProps {
    // Define the props for your component here
}

const LessonManagerProvider: React.FC<PracticeProviderProps> = () => {
    // Implement your component logic here

    return (
        <Provider>
            <LessonManager />
        </Provider>
    );
};

export default LessonManagerProvider;