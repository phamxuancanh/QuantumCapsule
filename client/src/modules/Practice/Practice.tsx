import React, { useEffect } from "react"
import {
    useCurrentQuestion,
    useExamId,
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
import { getListQuesionByExamId } from "api/question/question.api"
import { toast } from "react-toastify"

const Practice: React.FC = () => {
    const EXAM_ID = "exam00001"
    const { totalScore, setTotalScore } = useTotalScore()
    const { listQuestion, setListQuestion } = useListQuestion()
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { result, setResult } = useResult()
    const { openResult, setOpenResult } = useOpenResult()
    const {examId, setExamId} = useExamId()
    // const[]
    useEffect(() => {
        const fetchData = async () => {
            try {
                setExamId(EXAM_ID)
                const response = await getListQuesionByExamId(EXAM_ID)
                const resListQuestion = response.data.data
                console.log(resListQuestion);

                setListQuestion(resListQuestion)
                setListAnswer(InitListAnswerFromListQuestion(resListQuestion))
                setCurrentQuestion(resListQuestion[0])
                setResult(InitResult(resListQuestion.length, new Date(), new Date()))
            }catch (error) {
                toast.error("Error when fetch data")
            }
        }
        fetchData()
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
