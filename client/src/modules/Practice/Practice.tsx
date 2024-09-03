import React, { useEffect } from "react"
import {
    useCurrentQuestion,
    useListAnswer,
    useListQuestion,
    useTotalScore,
} from "./context/context"
import QuestionBox from "modules/Practice/components/question-box/QuestionBox"
import { data } from "./data/questions"
import { InitListAnswerFromListQuestion } from "helpers/Nam-helper/ConvertHelper"
import { Button, Grid } from "@mui/material"
import { IQuestion } from "api/question/question.interfaces"

const Practice: React.FC = () => {
    const { totalScore, setTotalScore } = useTotalScore()
    const { listQuestion, setListQuestion } = useListQuestion()
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    // const[]
    useEffect(() => {
        setListQuestion(data)
        setListAnswer(InitListAnswerFromListQuestion(data))
        setCurrentQuestion(data[0])
    }, [])
    const handleClickNextQuestion = () => {
        const index = listQuestion.findIndex(
            (question: IQuestion) => question.id === currentQuestion.id,
        )
        if (index < listQuestion.length - 1) {
            setCurrentQuestion(listQuestion[index + 1])
        } else {
            // setí
        }
    }
    return (
        <div>
            <QuestionBox isOpen={true} onNextQuestionClick={handleClickNextQuestion} />
        </div>
    )
}

export default Practice
