import React from 'react';
import Provider from './context/provider';
import ExamManager from './ExamManager';
import { ILesson } from 'api/lesson/lesson.interface';

interface PracticeProviderProps {
    // Define the props for your component here
    lesson?: ILesson;
}

const ExamManagerProvider: React.FC<PracticeProviderProps> = (props) => {
    // Implement your component logic here

    return (
        <Provider>
            <ExamManager 
                lesson={props.lesson}
            />
        </Provider>
    );
};

export default ExamManagerProvider;