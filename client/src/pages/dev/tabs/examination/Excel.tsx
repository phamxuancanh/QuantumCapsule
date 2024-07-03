import { Typography } from '@mui/material';
import ExcelReaderBtn from 'components/buttons/excel/ExcelReaderBtn';
import QuizCard from 'components/cards/quizCard/QuizCard';
import React from 'react';
import { IQuestion, IQuestionExcel } from 'utils/interfaces';

export function convertQuestion(excels: IQuestionExcel[]): IQuestion[] {
    return excels.map((excel) => {
        
        if (excel.type === 'single') {
            return {
                id: excel.id,
                idRec: excel.idRec,
                question: excel.question,
                score: excel.score,
                type: excel.type,
                correctAnswer: excel.correctAnswer,
                explain: excel.explain,
                questionType: excel.questionType,
                options: [
                    { value: 'A', label: excel.a },
                    { value: 'B', label: excel.b },
                    { value: 'C', label: excel.c },
                    { value: 'D', label: excel.d },
                ]
            }
        }
        if (excel.type === 'multiple') {
            return {
                id: excel.id,
                idRec: excel.idRec,
                question: excel.question,
                type: excel.type,
                correctAnswer: excel.correctAnswer,
                score: excel.score,
                explain: excel.explain,
                questionType: excel.questionType,
                options: [
                    { value: 'A', label: excel.a },
                    { value: 'B', label: excel.b },
                    { value: 'C', label: excel.c },
                    { value: 'D', label: excel.d },
                    { value: 'E', label: excel.e },
                ]
            }
        }
        if (excel.type === 'text') {
            return {
                id: excel.id,
                idRec: excel.idRec,
                question: excel.question,
                type: excel.type,
                correctAnswer: excel.correctAnswer,
                score: excel.score,
                explain: excel.explain,
                questionType: excel.questionType,
                options: []
            }
        }
        return {} as IQuestion;
    });

}


const Excel: React.FC = () => {
    const [data, setData] = React.useState<IQuestion[]>([]);
    const onUpload = (data: IQuestionExcel[]) => {
        console.log(data);
        
        setData(convertQuestion(data));
    }

    return (
        <div>
            <ExcelReaderBtn
                onUpload={onUpload}
                name='Upload Excel File'
            />
            {
                data.length > 0 && (
                    <div>
                        {
                            data.map((item) => (
                                <QuizCard
                                    mode='result'
                                    question={item}
                                    showAnswer={true}
                                />
                            ))
                        }
                    </div>
                )
            }
            {JSON.stringify(data, null, 2)}

        </div>
    );
};

export default Excel;