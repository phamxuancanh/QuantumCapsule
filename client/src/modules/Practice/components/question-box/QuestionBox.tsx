import { Box, Button, Card } from "@mui/material"
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
import React from "react"

interface IProps {
    isOpen?: boolean
}

const QuestionBox: React.FC<IProps> = (props) => {
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { listQuestion, setListQuestion } = useListQuestion()
    const { result, setResult } = useResult()
    const {openResult, setOpenResult} = useOpenResult()
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
    const handleClickNextQuestion = () => {
        const index = listQuestion.findIndex(
            (question: IQuestion) => question.id === currentQuestion.id,
        )
        if (index < listQuestion.length - 1) {
            setCurrentQuestion(listQuestion[index + 1])
        } else {
            setOpenResult(true)
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
        <Box display={props.isOpen ? "block" : "none"}>
            <SpeakerV1 text={currentQuestion?.content!} label="Đọc câu hỏi" autoSpeak />
            {renderQuestion(currentQuestion)}
            <Button
                variant="contained"
                fullWidth
                color="success"
                onClick={handleClickNextQuestion}
            >
                Câu tiếp theo
            </Button>
        </Box>
    )
}

export default QuestionBox
