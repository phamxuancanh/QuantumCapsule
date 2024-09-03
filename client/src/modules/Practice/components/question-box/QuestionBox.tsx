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
    isOpen?: boolean
    onNextQuestionClick?: () => void
}

const QuestionBox: React.FC<IProps> = ({isOpen = true, onNextQuestionClick}) => {
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { listQuestion, setListQuestion } = useListQuestion()

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
        setListAnswer(newListAnswer)
    }
    const renderQuestion = (question: IQuestion) => {
        if (question.questionType === 1) {
            return <QuestionV1 question={question} onAnswer={handleAnswer} />
        }
        return <></>
    }
    return (
        <Box display={isOpen ? "block" : "none"}>
            <SpeakerV1 text={currentQuestion.content!} label="Đọc câu hỏi" autoSpeak />
            {renderQuestion(currentQuestion)}
            <Button
                variant="contained"
                fullWidth
                color="success"
                onClick={onNextQuestionClick}
            >
                Câu tiếp theo
            </Button>
        </Box>
    )
}

export default QuestionBox
