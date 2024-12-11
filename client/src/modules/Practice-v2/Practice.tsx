import React, { useEffect } from "react"
import {
    useActCongratulation,
    useActStarModal,
    useCurrentQuestion,
    useExamId,
    useIsNextQuestion,
    useIsSumited,
    useListAnswer,
    useListQuestion,
    useOpenResult,
    useResult,
    useTotalScore,
} from "./context/context"
import { caculateStar, InitListAnswerFromListQuestion, InitResult } from "helpers/Nam-helper/InitHelper"
import { Box, Button, Grid, Typography } from "@mui/material"
import { IQuestion } from "api/question/question.interfaces"
import ListQuestionButton from "./components/list-question-button/ListQuestionButton"
import SubmitResultBox from "./components/submit-result-box/SubmitResultBox"
import { getListQuesionByExamId } from "api/question/question.api"
import { toast } from "react-toastify"
import { getFromLocalStorage } from "utils/functions"
import ResultBox from "./components/result-box/ResultBox"
import StarModal from "./components/star-modal/StarModal"
import QuestionBox from "./components/question-box/QuestionBox"
import CongratulationBox from "./components/congratulation-box/CongratulationBox"
import { insertResult } from "api/result/result.api"
import { IResult } from "api/result/result.interface"
import { insertListAnswer } from "api/answer/answer.api"
import { ACTIONS } from "utils/enums"
import { getExamInfo } from "api/exam/exam.api"
import GameProgress from "./components/game-progress/GameProgress"
import { shuffleArray } from "helpers/Nam-helper/shufflerHelper"
import _ from "lodash"

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
    const {actCongratulation, setActCongratulation} = useActCongratulation()
    const {actStarModal, setActStarModal} = useActStarModal()
    const [examInfo, setExamInfo] = React.useState<any>({})
    const {isNextQuestion} = useIsNextQuestion()
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams(window.location.search)
                const EXAM_ID = params.get('examId') || "exam00001"
                const resExamInfo = await getExamInfo(EXAM_ID)
                let response = await getListQuesionByExamId(EXAM_ID)
                const listQuestion = _.shuffle(response.data.data)
                
                const resListQuestion = [...listQuestion].map((question: IQuestion, index) => {
                    return {
                        ...question,
                        title: "Câu " + (index + 1) + ' / ' + response.data.data.length,
                    }
                })
                
                const initResult = InitResult(resListQuestion.length, EXAM_ID, curentUser.currentUser.id)
                const initListAnswer = InitListAnswerFromListQuestion(resListQuestion, initResult.id)
                
                setExamInfo(resExamInfo.data.data)
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
    useEffect(() => {
        
        setCurrentQuestion(listQuestion[0])
    }, [listQuestion])
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
        <Box minHeight={700} p={2} width={{xs: "100vw", md: "70vw", }} mx={"auto"}
        >
            <StarModal />
            <Box >
                <Typography fontSize={"25px"} color={"#EB8317"} fontWeight={"bold"}>
                    {examInfo.subjectName} {examInfo.grade}  &gt; {examInfo.chapterName} &gt; {examInfo.lessonName} &gt; {examInfo.examName}
                </Typography>
            </Box>
            <Box >
                <ListQuestionButton isOpen={isSumited === false}/>
            </Box>
            <Box mb={1} display={isSumited === false? "flex": "none"} gap={2}>
                <Typography fontSize={"25px"} color={"#EB8317"} fontWeight={"bold"}>
                    Tiến trình trả lời: 
                </Typography>
                <Box width={"75%"}>
                    <GameProgress 
                        totalQuestions={listAnswer.length}
                        completedQuestions={isNextQuestion ?  listAnswer.filter(ans => ans.yourAnswer).length : listAnswer.filter(ans => ans.yourAnswer && ans.questionId !== currentQuestion.id).length}
                    />
                </Box>
            </Box>
            <Box >
                <QuestionBox
                    isOpen={openResult === false && isSumited === false}
                />
                <SubmitResultBox isOpen={openResult === true && isSumited === false} />
                <ResultBox isOpen={isSumited === true}/>
                <CongratulationBox 
                    open={actCongratulation.open}
                    answer={actCongratulation.payload}
                />
            </Box>
        </Box>
    )
}

export default Practice
