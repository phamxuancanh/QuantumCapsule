import { Box, Button, Card, Grid, Typography } from "@mui/material"
import {
    useActStarModal,
    useCurrentQuestion,
    useIsNextQuestion,
    useIsSumited,
    useListAnswer,
    useListQuestion,
    useOpenResult,
    useResult,
} from "../../context/context"
import React from "react"
import { insertResult } from "api/result/result.api"
import { IResult } from "api/result/result.interface"
import { caculateStar } from "helpers/Nam-helper/InitHelper"
import { insertListAnswer } from "api/answer/answer.api"
import { ACTIONS } from "utils/enums"
import { toast } from "react-toastify"

interface IProps {
    isOpen: boolean
}

const ListQuestionButton: React.FC<IProps> = (props) => {
    const { listQuestion, setListQuestion } = useListQuestion()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { openResult, setOpenResult } = useOpenResult()
    const {result} = useResult()
    const { listAnswer } = useListAnswer()

    const {isNextQuestion} = useIsNextQuestion()
    
    return (
        <Box display={props.isOpen ? "block" : "none"}>
            <Card
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    padding: 2,
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    flexWrap: 'wrap',
                }}
            >
                <Typography sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: "25px"}}>
                    Đã làm: {isNextQuestion ?  listAnswer.filter(ans => ans.yourAnswer).length : listAnswer.filter(ans => ans.yourAnswer && ans.questionId !== currentQuestion.id).length}/{listAnswer.length}
                </Typography>
                <Typography sx={{ color: '#4caf50', fontWeight: 'bold', fontSize: "25px"}}>
                    Số câu đúng: { isNextQuestion ? listAnswer.filter(ans => {return  ans.isCorrect}).length : listAnswer.filter(ans => {return ans.isCorrect && ans.questionId !== currentQuestion.id}).length}
                </Typography>
                <Typography sx={{ color: '#f44336', fontWeight: 'bold', fontSize: "25px" }}>
                    Số câu sai: {isNextQuestion ?  listAnswer.filter(ans => {return !ans.isCorrect && ans.yourAnswer}).length : listAnswer.filter(ans => {return !ans.isCorrect && ans.yourAnswer && ans.questionId !== currentQuestion.id}).length}
                </Typography>
            </Card>
            {/* <Button
                onClick={() => {
                    setOpenResult(true)
                    handleSubmit()
                }}
                variant={"contained"}
                color="success"
                fullWidth
            >
                Hoàn thành
            </Button> */}
        </Box>
    )
}

export default ListQuestionButton
