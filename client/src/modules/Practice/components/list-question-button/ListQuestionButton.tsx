import { Badge, Box, Button, Grid } from "@mui/material"
import {
    useCurrentQuestion,
    useListAnswer,
    useListQuestion,
    useOpenResult,
} from "../../context/context"
import React from "react"
import FlagIcon from '@mui/icons-material/Flag';

interface IProps {
    isOpen: boolean
}

const ListQuestionButton: React.FC<IProps> = (props) => {
    const { listQuestion, setListQuestion } = useListQuestion()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { openResult, setOpenResult } = useOpenResult()
    const {listAnswer} = useListAnswer()
    return (
        <Box display={props.isOpen ? "block" : "none"} sx={{backgroundColor:"white", borderRadius: "5px", border: "1px solid black"}} >
            <Box sx={{height: "350px", overflowY: "scroll"}}>
                <Grid container spacing={1} p={2}>
                    {listQuestion.map((question, index) => {
                        const answer = listAnswer.find(answer => answer.questionId === question.id)
                        return <Grid item xs={12} md={4} xl={3} key={question.id}>
                            <Badge 
                                badgeContent={
                                    answer?.flat && 
                                    <FlagIcon sx={{color: "#FF9D3D"}}/>
                                }
                            >
                                <Button
                                    onClick={() => {
                                        setCurrentQuestion(question)
                                        setOpenResult(false)
                                    }}
                                    variant={ answer?.yourAnswer ? "contained": "outlined"}
                                >
                                    {index + 1}
                                </Button>
                            </Badge>
                        </Grid>
                    })}
                </Grid>

            </Box>

        </Box>
    )
}

export default ListQuestionButton
