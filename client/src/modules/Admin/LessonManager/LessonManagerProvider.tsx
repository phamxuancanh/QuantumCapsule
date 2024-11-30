import React from 'react';
import Provider from './context/provider';
import LessonManager from './LessonManager';
import { IChapter } from 'api/chapter/chapter.interface';

interface PracticeProviderProps {
    // Define the props for your component here
    chapter?: IChapter;
}

const LessonManagerProvider: React.FC<PracticeProviderProps> = (props) => {
    // Implement your component logic here

    return (
        <Provider>
            <LessonManager chapter={props.chapter}/>
        </Provider>
    );
};

export default LessonManagerProvider;