import { Box, Button, Card } from "@mui/material"
import { IAnswer, IQuestion } from "api/practice/question.interfaces"
import { useCurrentQuestion, useListAnswer, useListQuestion } from "modules/Practice/context/context"
import ExplainAnswerV1 from "QCComponents/explain-answer/explain-answer-v1/ExplainAnswerV1"
import QuestionV1 from "QCComponents/questions/question-v1/QuestionV1"
import React from "react"

interface IProps {
    question: IQuestion
}

const QuestionBox: React.FC<IProps> = ({ question }) => {
    const { listAnswer, setListAnswer } = useListAnswer()
    const {currentQuestion, setCurrentQuestion} = useCurrentQuestion()
    const {listQuestion, setListQuestion} = useListQuestion()
    const [openExplain, setOpenExplain] = React.useState(false)
    const [yourAnswer, setYourAnswer] = React.useState("")
    const handleAnswer = (answer: string) => {
        setYourAnswer(answer)
    }
    const handleClickAnswer = () => {
        const newListAnswer = listAnswer.map((item) => {
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
        const index = listAnswer.findIndex(
            (item) => item.questionId === question.id,
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
