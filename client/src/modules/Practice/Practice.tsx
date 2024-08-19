import React, { useEffect } from 'react';
import { useListAnswer, useListQuestion, useTotalScore } from './context/context';
import QuestionBox from 'modules/Practice/components/question-box/QuestionBox';
import { questions } from './data/questions';

const Practice: React.FC = () => {
    const {totalScore, setTotalScore} = useTotalScore();
    const {listQuestion, setListQuestion} = useListQuestion();
    const {listAnswer, setListAnswer} = useListAnswer();
    useEffect(() => {
        setListQuestion(questions)
    }, []);
    return (
        <div>
            {listQuestion.map((question, index) => {
                return <QuestionBox  question={question} key={index}/>
            })}
        </div>
    );
};

export default Practice;