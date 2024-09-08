import { Box, Button, Grid } from "@mui/material"
import {
    useCurrentQuestion,
    useListQuestion,
    useOpenResult,
} from "modules/Practice/context/context"
import React from "react"

interface IProps {
    // Define the props for the component here
}

const ListQuestionButton: React.FC<IProps> = (props) => {
    const { listQuestion, setListQuestion } = useListQuestion()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { openResult, setOpenResult } = useOpenResult()
    return (
        <Box>
            <Grid container spacing={2} p={2}>
                {listQuestion.map((question) => (
                    <Grid item xs={4} key={question.id}>
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
            <Button
                onClick={() => {
                    setOpenResult(true)
                }}
                variant={"contained"}
                color="success"
                fullWidth
            >
                Nộp bài
            </Button>
        </Box>
    )
}

export default ListQuestionButton
