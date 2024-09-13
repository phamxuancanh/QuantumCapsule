import {
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

interface IProps {
    question: IQuestion
    yourAnswer?: IAnswer
    onAnswer?: (answer: string) => void
    mode?: "practice" | "submit" | "result"
}

const QuestionV1: React.FC<IProps> = (props) => {
    // Implement your component logic here
    const { question, onAnswer } = props
    const renderAllAnswerNotNull = (question: IQuestion) => {
        const answers = [
            { value: "a", label: question.A },
            { value: "b", label: question.B },
            { value: "c", label: question.C },
            { value: "d", label: question.D },
            { value: "e", label: question.E },
        ]
        return answers.map((answer, index) => {
            if (answer.label) {
                return (
                    <FormControlLabel
                        value={answer.value}
                        control={<Radio />}
                        label={answer.label}
                        key={index}
                        checked={props.yourAnswer?.yourAnswer === answer.value}
                        disabled={props.mode === "result" || props.mode === "submit"}
                    />
                )
            }
            return <></>
        })
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value && onAnswer && onAnswer(event.target.value)
    }
    return (
        <Card sx={{ p: 5 }}>
            <Typography color={"#FF8A8A"} fontWeight={800}>
                {question.title}
            </Typography>
            <Typography color={"#1E201E"} fontWeight={600}>
                {question.content}
            </Typography>
            <img src={question.contentImg} alt="question" />
            <FormControl>
                <RadioGroup name="radio-buttons-group" onChange={(e)=>{handleChange(e)}}>
                    {renderAllAnswerNotNull(question)}
                </RadioGroup>
            </FormControl>
        </Card>
    )
}

export default QuestionV1
