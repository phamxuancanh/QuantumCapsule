import React, { useEffect } from "react"
import {
    useActStarModal,
    useCurrentQuestion,
    useExamId,
    useIsSumited,
    useListAnswer,
    useListQuestion,
    useOpenResult,
    useResult,
    useTotalScore,
} from "./context/context"
import QuestionBox from "modules/Practice/components/question-box/QuestionBox"
import { data } from "./data/questions"
import { caculateStar, InitListAnswerFromListQuestion, InitResult } from "helpers/Nam-helper/InitHelper"
import { Box, Button, Grid } from "@mui/material"
import { IQuestion } from "api/question/question.interfaces"
import ListQuestionButton from "./components/list-question-button/ListQuestionButton"
import SubmitResultBox from "./components/submit-result-box/SubmitResultBox"
import { getListQuesionByExamId } from "api/question/question.api"
import { toast } from "react-toastify"
import { getFromLocalStorage } from "utils/functions"
import ResultBox from "./components/result-box/ResultBox"
import StarModal from "./components/star-modal/StarModal"
import TimeCountdown from "components/countdown/timeCountdown/TimeCountdown"
import { insertResult } from "api/result/result.api"
import { insertListAnswer } from "api/answer/answer.api"
import { ACTIONS } from "utils/enums"
import { IResult } from "api/result/result.interface"

const Practice: React.FC = () => {
    // const EXAM_ID = "exam00001"
    const curentUser = getFromLocalStorage<any>('persist:auth')
    const { totalScore, setTotalScore } = useTotalScore()
    const { listQuestion, setListQuestion } = useListQuestion()
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { result, setResult } = useResult()
    const { openResult, setOpenResult } = useOpenResult()
    const {isSumited, setIsSumited} = useIsSumited()
    const {examId, setExamId} = useExamId()
    const {setActStarModal} = useActStarModal()
    // const[]
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(window.location.search)
                const EXAM_ID = params.get('examId') || "exam00001"
                const response = await getListQuesionByExamId(EXAM_ID)
                
                const resListQuestion = response.data.data
                const initResult = InitResult(resListQuestion.length, EXAM_ID, curentUser.currentUser.id)
                const initListAnswer = InitListAnswerFromListQuestion(resListQuestion, initResult.id)
                console.log(initListAnswer);
                
                setExamId(EXAM_ID)
                setListQuestion(resListQuestion)
                setListAnswer(initListAnswer)
                setCurrentQuestion(resListQuestion[0])
                setResult(initResult)
            }catch (error) {
                toast.error("Error when fetch data")
            }
        }
        fetchData()
    }, [])
    const handleSubmit = async () => {
        try {
            const res2 = await insertResult({
                ...result,
                star: caculateStar(result),
            } as IResult)        
            const res1 = await insertListAnswer(listAnswer)
            toast.success("Nộp bài thành công")
            setIsSumited(true)
            setActStarModal({open: true, payload: caculateStar(result), type: ACTIONS.VIEW})
        } catch (error: any) {
            toast.error(error.message)
            toast.error(error.message)
        }
    }
    return (
        <Box p={2}>
            <StarModal />
            <Grid container spacing={2}>
                <Grid item xs={12} display={"flex"} gap={2}>
                    <TimeCountdown initialSeconds={60 *40} // 40 minutes 
                        onCountdownEnd={() => {
                            handleSubmit()
                        }}
                        sx={{width: "500px", height:"40px", fontSize: "1.5rem", fontWeight: "bold", color: "#FF9D3D"}}
                    />
                    <Button
                        onClick={() => {
                            setOpenResult(true)
                        }}
                        variant={"contained"}
                        color="success"
                        sx={{
                            width: "100px",
                            height: "40px",
                        }}
                    >
                        Nộp bài
                    </Button>
                </Grid>
                <Grid item xs={9}>
                    <QuestionBox
                        isOpen={openResult === false && isSumited === false}
                    />
                    <SubmitResultBox isOpen={openResult === true && isSumited === false} />
                    <ResultBox isOpen={isSumited === true}/>
                </Grid>
                <Grid item xs={3}>
                    <ListQuestionButton isOpen={isSumited === false}/>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Practice
