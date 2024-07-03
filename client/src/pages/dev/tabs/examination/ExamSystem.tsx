import TabMenu from 'components/menus/tabMenu/TabMenu';
import React from 'react';
import Exam from './Exam';
import ExamResult from './ExamResult';
import Excel from './Excel';
import { IAnswer, IQuestion } from 'utils/interfaces';

const ExamSystem: React.FC = () => {
    const baseData: IQuestion[] = [{ "id": 1, "idRec": "A1", "question": "What is the capital of France?", "score": 1, "type": "single", "correctAnswer": "a", "explain": "ehe", "options": [{ "value": "A", "label": "Paris" }, { "value": "B", "label": "London" }, { "value": "C", "label": "Berlin" }, { "value": "D", "label": "Madrid" }] }, { "id": 2, "idRec": "A2", "question": "Test", "type": "multiple", "correctAnswer": "abe", "score": 1, "options": [{ "value": "A", "label": "t1" }, { "value": "B", "label": "t2" }, { "value": "C", "label": "t3" }, { "value": "D", "label": "t4" }, { "value": "E", "label": "t5" }] }, { "id": 3, "idRec": "A3", "question": "abc-ef", "type": "text", "correctAnswer": "d", "score": 1, "options": [] }, { "id": 4, "idRec": "A4", "question": "Which element has the chemical symbol 'H'?", "score": 2, "type": "single", "correctAnswer": "b", "explain": "tha hóa", "options": [{ "value": "A", "label": "Helium" }, { "value": "B", "label": "Hydrogen" }, { "value": "C", "label": "Oxygen" }, { "value": "D", "label": "Carbon" }] }, { "id": 5, "idRec": "A5", "question": "What is the tallest mountain in the world?", "score": 2, "type": "single", "correctAnswer": "d", "explain": "??", "options": [{ "value": "A", "label": "K2" }, { "value": "B", "label": "Kangchenjunga" }, { "value": "C", "label": "Lhotse" }, { "value": "D", "label": "Mount Everest" }] }, { "id": 6, "idRec": "A6", "question": "Which country has the largest population?", "type": "multiple", "correctAnswer": "ab", "score": 3, "explain": "not VN", "options": [{ "value": "A", "label": "China" }, { "value": "B", "label": "India" }, { "value": "C", "label": "USA" }, { "value": "D", "label": "Indonesia" }, { "value": "E", "label": "Brazil" }] }]

    const [resultExam, setResultExam] = React.useState<{
        idUser: string;
        idExam: string;
        answers: IAnswer[];
    }>({
        idUser: '',
        idExam: '',
        answers: []
    });

    const handleExamSubmit = (idExam: string, idUser: string, answers: IAnswer[]) => {
        console.log(answers);
        
        setResultExam({
            idUser,
            idExam,
            answers
        });
    }

    return (
        <div>
            <TabMenu listItems={[
                {
                    index: 0, label: 'questions',
                    item:
                        <Exam
                            userId='1'
                            examId='1'
                            data={baseData}
                            countDown={5}
                            onExamSubmit={handleExamSubmit}
                            onCountDownEnd={()=>console.log('countdown end')}
                        />
                },
                { index: 1, label: 'result', item: <ExamResult {...resultExam}/> },
                { index: 2, label: 'import from excel', item: <Excel /> },
            ]} defaultIndex={0} />
        </div>
    );
};

export default ExamSystem;