import React, { useEffect } from "react"
import {
    useCurrentQuestion,
    useListAnswer,
    useListQuestion,
    useOpenResult,
    useResult,
    useTotalScore,
} from "./context/context"
import QuestionBox from "modules/Practice/components/question-box/QuestionBox"
import { data } from "./data/questions"
import { InitListAnswerFromListQuestion, InitResult } from "helpers/Nam-helper/InitHelper"
import { Button, Grid } from "@mui/material"
import { IQuestion } from "api/question/question.interfaces"
import ListQuestionButton from "./components/list-question-button/ListQuestionButton"
import SubmitResultBox from "./components/submit-result-box/SubmitResultBox"

const Practice: React.FC = () => {
    const { totalScore, setTotalScore } = useTotalScore()
    const { listQuestion, setListQuestion } = useListQuestion()
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { result, setResult } = useResult()
    const { openResult, setOpenResult } = useOpenResult()
    // const[]
    useEffect(() => {
        setListQuestion(data)
        setListAnswer(InitListAnswerFromListQuestion(data))
        setCurrentQuestion(data[0])
        setResult(InitResult(listQuestion.length, new Date(), new Date()))
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid item xs={9}>
                <QuestionBox
                    isOpen={openResult === false}
                />
                <SubmitResultBox isOpen={openResult} />
            </Grid>
            <Grid item xs={3}>
                <ListQuestionButton />
            </Grid>
            
        </Grid>
    )
}

export default Practice
