import { Box, Button } from "@mui/material"
import {
    useListAnswer,
    useListQuestion,
    useResult,
} from "modules/Practice/context/context"
import QuestionV1 from "QCComponents/questions/question-v1/QuestionV1"
import QuestionV2 from "QCComponents/questions/question-v2/QuestionV2"
import QuestionV3 from "QCComponents/questions/question-v3/QuestionV3"
import React from "react"

interface IProps {
    isOpen: boolean
}

const SubmitResultBox: React.FC<IProps> = (props) => {
    const { listAnswer } = useListAnswer()
    const { listQuestion } = useListQuestion()
    const {result} = useResult()
    const handleSubmit = () => {
        alert("Mày đã đạt được " + result.yourScore + " điểm")
    }
    const renderYourAnswer = () => {
        return (
            <Box>
                {listQuestion.map((question, index) => {
                    if (question.questionType === 1) {
                        return (
                            <QuestionV1
                                question={question}
                                yourAnswer={listAnswer.find(
                                    (ans) => ans.questionId === question.id,
                                )}
                                mode = "submit"
                            />
                        )
                    }
                    if (question.questionType === 2) {
                        return (
                            <QuestionV2
                                question={question}
                                yourAnswer={listAnswer.find(
                                    (ans) => ans.questionId === question.id,
                                )}
                                mode="submit"
                            />
                        )
                    }
                    if (question.questionType === 3) {
                        return (
                            <QuestionV3
                                question={question}
                                yourAnswer={listAnswer.find(
                                    (ans) => ans.questionId === question.id,
                                )}
                                mode="submit"
                            />
                        )
                    }
                    return <></>
                })}
            </Box>
        )
    }
    return (
        <Box display={props.isOpen ? "block" : "none"}>
            {renderYourAnswer()}
            <Button
                variant="contained"
                fullWidth
                color="success"
                onClick={handleSubmit}
            >
                Nộp bài
            </Button>
        </Box>
    )
}

export default SubmitResultBox
