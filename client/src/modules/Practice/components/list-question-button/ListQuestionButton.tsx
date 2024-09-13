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
        <Box >
            <Box sx={{maxHeight: "350px", overflowY: "scroll", background: "#ECDFCC", borderRadius: "5px"}}>
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

            </Box>
            {/* </div> */}
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
