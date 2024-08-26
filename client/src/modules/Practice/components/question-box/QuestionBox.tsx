import { Box, Button, Card } from "@mui/material"
import { IAnswer } from "api/answer/answer.interfaces"
import { IQuestion } from "api/question/question.interfaces"
import {
    useCurrentQuestion,
    useListAnswer,
    useListQuestion,
} from "modules/Practice/context/context"
import ExplainAnswerV1 from "QCComponents/explain-answer/explain-answer-v1/ExplainAnswerV1"
import QuestionV1 from "QCComponents/questions/question-v1/QuestionV1"
import SpeakerV1 from "QCComponents/speakers/speaker-v1/SpeakerV1"
import React from "react"

interface IProps {
    question: IQuestion
}

const QuestionBox: React.FC<IProps> = ({ question }) => {
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { listQuestion, setListQuestion } = useListQuestion()
    const [openExplain, setOpenExplain] = React.useState(false)
    const [yourAnswer, setYourAnswer] = React.useState("")
    const handleAnswer = (answer: string) => {
        setYourAnswer(answer)
    }
    const handleClickAnswer = () => {
        const newListAnswer = listAnswer.map((item: IAnswer) => {
            if (item.questionId === question.id) {
                return {
                    ...item,
                    yourAnswer: yourAnswer,
                    isCorrect: item.correctAnswer === yourAnswer,
                } as IAnswer
            }
            return item
        })
        setListAnswer(newListAnswer)
        setOpenExplain(true)
    }
    const handleClickNextQuestion = () => {
        setOpenExplain(false)
        const index = listQuestion.findIndex(
            (item: IQuestion) => item.id === question.id,
        )
        if (index < listAnswer.length - 1) {
            setYourAnswer("")
            setCurrentQuestion(listQuestion[index + 1])
        }
    }
    const renderQuestion = (question: IQuestion) => {
        if (question.questionType === 1) {
            return <QuestionV1 question={question} onAnswer={handleAnswer} />
        }
        return <></>
    }
    return (
        <Box>
            {openExplain ? (
                <Box>
                    <ExplainAnswerV1
                        question={question}
                        answer={
                            listAnswer.find(
                                (item) => item.questionId === question.id,
                            ) || {}
                        }
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        onClick={handleClickNextQuestion}
                    >
                        câu tiếp theo
                    </Button>
                </Box>
            ) : (
                <Box>
                    <SpeakerV1
                        text={question.content!}
                        label="Đọc câu hỏi"
                        autoSpeak
                    />
                    {renderQuestion(question)}
                    <Button
                        variant="contained"
                        fullWidth
                        color="success"
                        onClick={handleClickAnswer}
                    >
                        Trả lời
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default QuestionBox
