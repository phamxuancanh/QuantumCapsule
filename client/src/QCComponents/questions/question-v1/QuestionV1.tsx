import {
    Box,
    Card,
    colors,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material"
import { IAnswer } from "api/answer/answer.interfaces"
import { IQuestion } from "api/question/question.interfaces"
import React from "react"
import { render } from "react-dom"
import RenderContentImg from "../render-content-img/RenderContentImg"

interface IProps {
    question: IQuestion
    yourAnswer?: IAnswer
    onAnswer?: (answer: string) => void
    mode?: "practice" | "submit" | "result"
    sort?: string // 'abcded', 'aebdc', ...
}

const QuestionV1: React.FC<IProps> = (props) => {
    // Implement your component logic here
    const { question, onAnswer } = props

    function renderColor(answer: { value: string; label: string | undefined}) {
        if(props.mode === "result" && props.yourAnswer?.isCorrect) {
            if (props.yourAnswer?.yourAnswer === answer.value) {
                return "#4caf50"
            }
            return "#000"
        }
        if(props.mode === "result" && !props.yourAnswer?.isCorrect) {
            if (props.yourAnswer?.yourAnswer === answer.value) {
                return "#f44336"
            }
            if (props.question?.correctAnswer === answer.value) {
                return "#4caf50"
            }
            return "#000"
        }
        return "#000"
    }

    const renderAllAnswerNotNull = (question: IQuestion) => {
        let answers = [
            { value: "a", label: question.A },
            { value: "b", label: question.B },
            { value: "c", label: question.C },
            { value: "d", label: question.D },
            { value: "e", label: question.E },
        ]
        answers = answers.filter(answer => answer.label);
        if(props.sort){
            answers.sort((a, b) => {
                return props.sort?.indexOf(a.value)! - props.sort?.indexOf(b.value)!;
            });
        }
        return answers.map((answer, index) => {
            return (
                <FormControlLabel
                    value={answer.value}
                    control={<Radio />}
                    label={ 
                        <Typography style={{color: renderColor(answer)}} sx={{fontSize: "25px"}}>
                            {answer.label}
                        </Typography>
                    }
                    key={index}
                    checked={props.yourAnswer?.yourAnswer === answer.value}
                    disabled={props.mode === "result" || props.mode === "submit"}
                    sx={{ color: renderColor(answer) }}
                    color={renderColor(answer)}
                />
            )
        })
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value && onAnswer && onAnswer(event.target.value)
    }
    return (
        <Card sx={{ p: 5, minHeight: "350px"}}>
            {props.mode === "submit" && !props.yourAnswer?.yourAnswer &&
                <Typography color={"red"} fontWeight={600} sx={{fontSize: "25px"}}>Chưa trả lời</Typography>
            }
            <Typography color={"#257180"} fontWeight={600} sx={{fontSize: "25px"}} mb={1}>
                {question.title}
            </Typography>
            <Typography color={"#1E201E"} sx={{fontSize: "25px"}}>
                {question.content}
            </Typography>
            <RenderContentImg imageContent={question.contentImg!}/>
            {/* <img src={question.contentImg} alt="question" /> */}
            <FormControl>
                <RadioGroup name="radio-buttons-group" onChange={(e)=>{handleChange(e)}}>
                    {renderAllAnswerNotNull(question)}
                </RadioGroup>
            </FormControl>
            {props.mode === "result" && (
                <Box>
                    <Typography color={props.yourAnswer?.isCorrect ? "#4caf50" : "#f44336"} fontSize={"25px"}>
                        {props.yourAnswer?.isCorrect ? "Bạn trả lời đúng rồi" : "Bạn trả lời sai rồi"}
                    </Typography>
                    <Typography color={"#1E201E"} fontSize={"25px"}>
                        Giải thích: {question.explainAnswer}
                    </Typography>

                </Box>
            )}
        </Card>
    )
}

export default QuestionV1
