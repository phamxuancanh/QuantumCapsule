import { Box, Button, Card, Typography } from "@mui/material"
import { IAnswer } from "api/answer/answer.interfaces"
import { IQuestion } from "api/question/question.interfaces"
import {
    useCurrentQuestion,
    useListAnswer,
    useListQuestion,
    useOpenResult,
    useResult,
} from "modules/Practice/context/context"
import ExplainAnswerV1 from "QCComponents/explain-answer/explain-answer-v1/ExplainAnswerV1"
import QuestionV1 from "QCComponents/questions/question-v1/QuestionV1"
import QuestionV2 from "QCComponents/questions/question-v2/QuestionV2"
import QuestionV3 from "QCComponents/questions/question-v3/QuestionV3"
import SpeakerV1 from "QCComponents/speakers/speaker-v1/SpeakerV1"
import React, { useEffect } from "react"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlagIcon from '@mui/icons-material/Flag';
interface IProps {
    isOpen?: boolean
}

const QuestionBox: React.FC<IProps> = (props) => {
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { listQuestion, setListQuestion } = useListQuestion()
    const { result, setResult } = useResult()
    const {openResult, setOpenResult} = useOpenResult()
    const [currentAnswer, setCurrentAnswer] = React.useState<IAnswer>()

    useEffect(() => {
        if (currentQuestion) {
            const answer = listAnswer.find((answer) => answer.questionId === currentQuestion.id)
            setCurrentAnswer(answer)
        }
    }, [currentQuestion, listAnswer])

    const handleAnswer = (yourAnswer: string) => {
        const newListAnswer = listAnswer.map((answer: IAnswer) => {
            if (answer.questionId === currentQuestion.id) {
                return {
                    ...answer,
                    yourAnswer: yourAnswer,
                    isCorrect: currentQuestion.correctAnswer === yourAnswer,
                } as IAnswer
            }
            return answer
        })
        console.log(newListAnswer);
        
        setListAnswer(newListAnswer)
        setResult({
            ...result,
            yourScore: newListAnswer.filter((answer) => answer.isCorrect).length,

        })
    }
    const handleClickFowardQuestion = () => {
        const index = listQuestion.findIndex(
            (question: IQuestion) => question.id === currentQuestion.id,
        )
        if (index > 0) {
            setCurrentQuestion(listQuestion[index - 1])
        } else {

        }
    }
    const handleClickNextQuestion = () => {
        const index = listQuestion.findIndex(
            (question: IQuestion) => question.id === currentQuestion.id,
        )

        if (index < listQuestion.length - 1) {
            setCurrentQuestion(listQuestion[index + 1])
        } else {
        }
    }
    const renderQuestion = (question: IQuestion) => {
        if (question?.questionType === 1) {
            return <QuestionV1 question={question} yourAnswer={listAnswer.find(ans => ans.questionId===question.id)} onAnswer={handleAnswer} />
        }
        if (question?.questionType === 2) {
            return <QuestionV2  question={question} yourAnswer={listAnswer.find(ans => ans.questionId===question.id)} onAnswer={handleAnswer}/>
        }
        if (question?.questionType === 3) {
            return <QuestionV3  question={question}  yourAnswer={listAnswer.find(ans => ans.questionId===question.id)} onAnswer={handleAnswer}/>
        }
        return <></>
    }
    return (
        <Box display={props.isOpen ? "block" : "none"} height={"500px"}>
            <Box p={2}>
                <SpeakerV1 text={currentQuestion?.content!} label="Đọc câu hỏi" autoSpeak />
                <Button onClick={
                    () => {
                        const newListAnswer = listAnswer.map((answer: IAnswer) => {
                            if (answer.questionId === currentQuestion.id) {
                                return {
                                    ...answer,
                                    flat: !answer.flat,
                                } as IAnswer
                            }
                            return answer
                        })
                        setListAnswer(newListAnswer)
                    }
                }>
                    <Typography sx={{color: currentAnswer?.flat ? "#FF9D3D" : undefined}}>
                        <FlagIcon />
                        Đặt cờ
                    </Typography>
                </Button>
            </Box>
            <Box>
            </Box>
            {renderQuestion(currentQuestion)}
            <Box display={"flex"} justifyContent={"space-between"} gap={2} p={2}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleClickFowardQuestion}
                    sx={{width: "49%"}}
                    // disabled={currentQuestion.id === listQuestion[0].id}
                >
                    <ArrowBackIcon fontSize="large" />
                    <Typography variant="button">Câu Trước</Typography>
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleClickNextQuestion}
                    sx={{width: "49%"}}
                    // disabled={currentQuestion.id === listQuestion[listQuestion.length - 1].id}

                >
                    Câu tiếp theo
                    <ArrowForwardIcon fontSize="large" />
                </Button>
            </Box>
        </Box>
    )
}

export default QuestionBox
