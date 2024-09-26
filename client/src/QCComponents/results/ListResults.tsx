import { Box } from "@mui/material"
import { IAnswer } from "api/answer/answer.interfaces"
import { IQuestion } from "api/question/question.interfaces"
import { IResult } from "api/result/result.interface"
import QuestionV1 from "QCComponents/questions/question-v1/QuestionV1"
import QuestionV2 from "QCComponents/questions/question-v2/QuestionV2"
import QuestionV3 from "QCComponents/questions/question-v3/QuestionV3"
import React from "react"

interface ListResultsProps {
    result: IResult
    listAnswer: IAnswer[]
    listQuestion: IQuestion[]
}

const ListResults: React.FC<ListResultsProps> = (props) => {
    const renderListResult = () => {
        return (
            <Box>
                {props.listQuestion.map((question, index) => {
                    if (question.questionType === 1) {
                        return (
                            <QuestionV1
                                question={question}
                                yourAnswer={props.listAnswer.find(
                                    (ans) => ans.questionId === question.id,
                                )}
                                mode="result"
                            />
                        )
                    }
                    if (question.questionType === 2) {
                        return (
                            <QuestionV2
                                question={question}
                                yourAnswer={props.listAnswer.find(
                                    (ans) => ans.questionId === question.id,
                                )}
                                mode="result"
                            />
                        )
                    }
                    if (question.questionType === 3) {
                        return (
                            <QuestionV3
                                question={question}
                                yourAnswer={props.listAnswer.find(
                                    (ans) => ans.questionId === question.id,
                                )}
                                mode="result"
                            />
                        )
                    }
                    return <></>
                })}
            </Box>
        )
    }
    return <Box>{renderListResult()}</Box>
}

export default ListResults
