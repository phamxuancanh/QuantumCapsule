import { Box, Card } from '@mui/material';
import { IQuestion } from 'api/practice/question.interfaces';
import QuestionV1 from 'QCComponents/questions/question-v1/QuestionV1';
import React from 'react';

interface IProps {
    question: IQuestion;
}

const QuestionBox: React.FC<IProps> = ({ question }) => {
    const handleAnswer = (answer: string) => {
        console.log(answer)
    }
    const renderQuestion = (question: IQuestion) => {
        // have img, choose 1 answer
        if(question.questionType === 1) { 
            return <QuestionV1 question={question} onAnswer={handleAnswer}/>
        }
        return <></>
    }
    return (
        <Box>
            {
                renderQuestion(question)
            }
        </Box>
    );
};

export default QuestionBox;