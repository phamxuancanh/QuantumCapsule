import { Box } from '@mui/material';
import IconBtn from 'components/buttons/iconBtn/Iconbtn';
import QuizCard from 'components/cards/quizCard/QuizCard';
import TimeCountdown from 'components/countdown/timeCountdown/TimeCountdown';
import ButtonMenu from 'components/menus/buttonMenu/ButtonMenu';
import React, { useRef } from 'react';
import { IconName } from 'utils/enums';
import { IAnswer, IQuestion } from 'utils/interfaces';

export interface IExamProps {
    userId: string;
    examId: string;
    data: IQuestion[],
    countDown: number;
    onCountDownEnd?: (idExam: string, idUser: string, answers: IAnswer[]) => void;
    onAnswerChange?: (answer: IAnswer) => void;
    onExamSubmit?: (idExam: string, idUser: string, answers: IAnswer[]) => void;
}

const Exam: React.FC<IExamProps> = (props: IExamProps) => {
    const { data } = props;
    const [answeredIds, setAnsweredIds] = React.useState<string[]>([]);
    const answers = useRef<Map<string, IAnswer>>(new Map<string, IAnswer>(
        data.map((item) => [item.id.toString(), { question: item, isCorrect: false, answer: '' }])
    )).current;

    const cardRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
    const handleExamSubmit = () => {
        props.onExamSubmit && props.onExamSubmit(props.userId, props.examId, Array.from(answers.values()));
    }
    const handleAnswerChange = (answer: IAnswer) => {
        answers.set(answer.question.id.toString(), answer);
        props.onAnswerChange && props.onAnswerChange(answer);
        setAnsweredIds([...answeredIds, answer.question.idRec]);
    }
    const scrollToCard = (id: string) => {
        if (cardRefs.current[id]) {
            cardRefs.current[id]!.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    const handleCountdownEnd = () => {
        props.onCountDownEnd && props.onCountDownEnd(props.examId, props.userId, Array.from(answers.values()));
    }
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                <TimeCountdown
                    initialSeconds={props.countDown || 30}
                    sx={{
                        width: '150px', height: '50px', fontSize: '2rem'
                    }}
                    onCountdownEnd={() => handleCountdownEnd()}
                />
                <IconBtn
                    iconName={IconName.check}
                    name='Submit'
                    onClick={() => handleExamSubmit()}
                    variant='contained'
                />
            </Box>
            {
                data.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
                        <Box
                            sx={{
                                overflowY: 'scroll',
                                flexBasis: '85%'
                            }}
                        >
                            {
                                data.map((item) => (
                                    <div
                                        key={item.idRec}
                                        ref={(ref) => (cardRefs.current[item.idRec] = ref)}
                                    >
                                        <QuizCard
                                            question={item}
                                            // showAnswer={true}
                                            mode='exam'
                                            onChange={handleAnswerChange}
                                        />
                                    </div>
                                ))
                            }
                        </Box>
                        <Box sx={{ flexBasis: '15%', }}>
                            <ButtonMenu
                                dataBtn={
                                    data.map((item) => ({ id: item.idRec, name: item.idRec }))
                                }
                                iconName={IconName.radio}
                                onBtnClick={(id) => { scrollToCard(id) }}
                                // onBtnClick={(id) => {  }}
                                // position='center'
                                sx={{ color: 'black' }}
                                listIdSx1={answeredIds}
                                iconNameSx1={IconName.check}
                                sx1={{ color: 'blue' }}
                            />
                        </Box>
                    </div>
                )
            }
            {/* {JSON.stringify(data, null, 2)} */}
        </Box>
    );
};

export default Exam;