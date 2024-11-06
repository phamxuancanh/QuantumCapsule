import { Box, Button, Typography } from "@mui/material"
import { insertListAnswer } from "api/answer/answer.api"
import { insertResult } from "api/result/result.api"
import { IResult } from "api/result/result.interface"
import ComfirmModal from "components/modals/comfirmModal/ComfirmModal"
import { caculateStar } from "helpers/Nam-helper/InitHelper"
import {
    useActStarModal,
    useIsSumited,
    useListAnswer,
    useListQuestion,
    useResult,
} from "modules/Practice/context/context"
import QuestionV1 from "QCComponents/questions/question-v1/QuestionV1"
import QuestionV2 from "QCComponents/questions/question-v2/QuestionV2"
import QuestionV3 from "QCComponents/questions/question-v3/QuestionV3"
import React from "react"
import { toast } from "react-toastify"
import { ACTIONS } from "utils/enums"
import { defaultAction, IAction } from "utils/interfaces"

interface IProps {
    isOpen: boolean
}

const SubmitResultBox: React.FC<IProps> = (props) => {
    const { listAnswer } = useListAnswer()
    const { listQuestion } = useListQuestion()
    const {setIsSumited} = useIsSumited()
    const {result} = useResult()
    const {setActStarModal}  = useActStarModal()
    const [isComfirmSubmited, setIsComfirmSubmited] = React.useState(false)
    const [actComfirmModal, setActComfirmModal] = React.useState<IAction>(defaultAction)
    const handleSubmit = async () => {
        // check có câu chưa trả lời không, toaat câu đó ra
        const listQuestionNotAnswer = listQuestion.filter(question => {
            return !listAnswer.find(ans => ans.questionId === question.id)?.yourAnswer
        })
        if (listQuestionNotAnswer.length > 0 || isComfirmSubmited) {
            setActComfirmModal({open: true, payload: listQuestionNotAnswer.map(q => q.title).join(", ")} as IAction)
            return
        }
        
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
    const renderYourAnswer = () => {
        return (
            <Box >
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
            <ComfirmModal 
                children={<Typography>
                    {actComfirmModal.payload ?? ""}
                </Typography>}
                title="Xác nhận nộp bài"
                open={actComfirmModal.open}
                setOpenModal={(bool)=>setActComfirmModal({open: bool} as IAction)}
                width="50%"
                onComfirm={()=>{
                    setIsComfirmSubmited(true)
                    handleSubmit()
                }}
            />
        </Box>
    )
}

export default SubmitResultBox
