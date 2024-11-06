import React from 'react';
import Provider from './context/provider';
import ChapterManager from './ChapterManager';

interface PracticeProviderProps {
    // Define the props for your component here
}

const ChapterManagerProvider: React.FC<PracticeProviderProps> = () => {
    // Implement your component logic here

    return (
        <Provider>
            <ChapterManager />
        </Provider>
    );
};

export default ChapterManagerProvider;