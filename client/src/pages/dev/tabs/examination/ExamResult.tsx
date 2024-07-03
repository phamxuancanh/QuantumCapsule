import { Box } from '@mui/material';
import InfoForm from 'components/forms/infoForm/InfoForm';
import React from 'react';
import { IAnswer } from 'utils/interfaces';
import QuizCard from 'components/cards/quizCard/QuizCard';

export interface IExamResult {
    idUser?: string;
    idExam?: string;
    answers?: IAnswer[];
}

const ExamResult: React.FC<IExamResult> = (props: IExamResult) => {
    const {idExam, idUser, answers} = props;
    const totalScore = answers?.reduce((acc, cur) => acc + (cur.isCorrect ? cur.question.score : 0), 0) + '/' + answers?.reduce((acc, cur) => acc + cur.question.score, 0);
    const totalCorrect = answers?.filter((ans) => ans.isCorrect).length;
    const totalQuestion = answers?.length;
    const your_answer = answers?.map((ans) => {
        return <QuizCard 
            mode='result'
            question={ans.question}
            answer={ans.answer}
            showAnswer={true}
        />
    });
    const formData = {
        idUser: idExam,
        idExam: idUser,
        totalScore,
        totalCorrect,
        totalQuestion,
        your_answer,
    }

    return (
        <Box>
            <InfoForm 
                data={formData}
                masterParams={['idUser', 'idExam', 'totalScore', 'totalCorrect']}
                detailParams={['your_answer']}
                image=''
                name='Exam Result'
            />

        </Box>
    );
};

export default ExamResult;