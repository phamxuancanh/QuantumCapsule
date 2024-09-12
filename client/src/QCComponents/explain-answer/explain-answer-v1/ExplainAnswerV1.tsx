import { Card, Typography } from '@mui/material';
import { IAnswer } from 'api/answer/answer.interfaces';
import { IQuestion } from 'api/question/question.interfaces';
import React from 'react';

interface IProps {
    question: IQuestion
    answer: IAnswer
}

const ExplainAnswerV1: React.FC<IProps> = (props) => {
    // Implement your component logic here
    const { question, answer } = props
    return (
        <Card sx={{ p: 10 }}>
             <Typography color={"#FF8A8A"} fontWeight={800}>
                {question.title}
            </Typography>
            <Typography color={"#1E201E"} fontWeight={600}>
                {question.content}
            </Typography>
            <img src={question.contentImg} alt="question" />
            <Typography color={answer.isCorrect? "#06D001": "#C80036"} fontWeight={600}>
                Câu trả lời của bạn là: {answer.yourAnswer}
            </Typography>
            
            <Typography color={"#1E201E"} fontWeight={600}>
                Câu trả lời đúng là : {question.correctAnswer}
            </Typography>
            <Typography color={"#1E201E"} fontWeight={600}>
                Giải thích: {question.explainAnswer}
            </Typography>
        </Card>
    );
};

export default ExplainAnswerV1;