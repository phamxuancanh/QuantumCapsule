import {
    Card,
    colors,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material"
import { IAnswer } from "api/answer/answer.interfaces"
import { IQuestion } from "api/question/question.interfaces"
import React from "react"

interface IProps {
    question: IQuestion
    yourAnswer?: IAnswer
    onAnswer?: (answer: string) => void
    mode?: "practice" | "submit" | "result"
}

const QuestionV2: React.FC<IProps> = (props) => {
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        event.target.value &&
            props.onAnswer &&
            props.onAnswer(event.target.value)
    }
    return (
        <Card sx={{ p: 5 }}>
            <Typography color={"#FF8A8A"} fontWeight={800}>
                {props.question.title}
            </Typography>
            <Typography color={"#1E201E"} fontWeight={600}>
                {props.question.content}
            </Typography>
            <img src={props.question.contentImg} alt="question" />
            <FormControl>
                <FormLabel component="legend">Trả lời ở đây</FormLabel>
                <TextField
                    onChange={(e) => {
                        handleChange(e)
                    }}
                    focused
                    color="success"
                    defaultValue={props.yourAnswer?.yourAnswer}
                    disabled={props.mode === "result" || props.mode === "submit"}
                />
            </FormControl>
        </Card>
    )
}

export default QuestionV2
