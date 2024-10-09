import { Box, Button, Grid } from "@mui/material"
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
    const {setIsSumited} = useIsSumited()
    const {setActStarModal}  = useActStarModal()


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
        <Box display={props.isOpen ? "block" : "none"}>
            {/* <Box sx={{maxHeight: "350px", overflowY: "scroll", borderRadius: "5px"}}>
                <Grid container spacing={2} p={2}>
                    {listQuestion.map((question) => (
                        <Grid item xs={12} md={4} xl={3} key={question.id}>
                            <Button
                                onClick={() => {
                                    setCurrentQuestion(question)
                                    setOpenResult(false)
                                }}
                                variant={"outlined"}
                            >
                                {question.title}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box> */}
            {/* </div> */}
            <Button
                onClick={() => {
                    setOpenResult(true)
                    handleSubmit()
                }}
                variant={"contained"}
                color="success"
                fullWidth
            >
                Hoàn thành
            </Button>
        </Box>
    )
}

export default ListQuestionButton
