import { Box, Button, Grid, Typography } from "@mui/material"
import {
    useActStarModal,
    useCurrentQuestion,
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


    
    return (
        <Box display={props.isOpen ? "block" : "none"}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    backgroundColor: '#f5f5f5',
                    maxWidth: 300,
                    margin: 'auto',
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                    Đã làm: {listAnswer.filter(ans => ans.yourAnswer).length}/{listAnswer.length}
                </Typography>
                <Typography variant="h4" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    Số câu đúng: {listAnswer.filter(ans => {return ans.isCorrect && ans.questionId !== currentQuestion.id}).length}
                </Typography>
                <Typography variant="h4" gutterBottom sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    Số câu sai: {listAnswer.filter(ans => {return !ans.isCorrect && ans.yourAnswer && ans.questionId !== currentQuestion.id}).length}
                </Typography>
            </Box>
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
