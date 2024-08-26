import React, { useEffect } from 'react';
import { useCurrentQuestion, useListAnswer, useListQuestion, useTotalScore } from './context/context';
import QuestionBox from 'modules/Practice/components/question-box/QuestionBox';
import { data } from './data/questions';
import { InitListAnswerFromListQuestion } from 'helpers/Nam-helper/ConvertHelper';
import { Button, Grid } from '@mui/material';

const Practice: React.FC = () => {
    const {totalScore, setTotalScore} = useTotalScore();
    const {listQuestion, setListQuestion} = useListQuestion();
    const {listAnswer, setListAnswer} = useListAnswer();
    const {currentQuestion, setCurrentQuestion} = useCurrentQuestion();
    useEffect(() => {
        setListQuestion(data)
        setListAnswer(InitListAnswerFromListQuestion(data))
        setCurrentQuestion(data[0])
    }, []);
    return (
        <div>
            <QuestionBox question={currentQuestion}/>
        </div>
    );
};

export default Practice;