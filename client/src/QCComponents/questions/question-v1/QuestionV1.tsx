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
import { IQuestion } from "api/practice/question.interfaces"
import React from "react"

interface IProps {
    question: IQuestion
    onAnswer?: (answer: string) => void
}

const QuestionV1: React.FC<IProps> = (props) => {
    // Implement your component logic here
    const { question, onAnswer } = props
    const renderAllAnswerNotNull = (question: IQuestion) => {
        const answers = [
            question.answer1,
            question.answer2,
            question.answer3,
            question.answer4,
            question.answer5,
        ]
        return answers.map((answer, index) => {
            if (answer) {
                return (
                    <FormControlLabel
                        value={answer}
                        control={<Radio />}
                        label={answer}
                        key={index}
                    />
                )
            }
            return <></>
        })
    }
    return (
        <Card sx={{ p: 10 }}>
            <Typography color={"#FF8A8A"} fontWeight={800}>
                {question.title}
            </Typography>
            <Typography color={"#1E201E"} fontWeight={600}>
                {question.content}
            </Typography>
            <img src={question.imgContent} alt="question" />
            <FormControl>
                <RadioGroup name="radio-buttons-group" >
                    {renderAllAnswerNotNull(question)}
                </RadioGroup>
            </FormControl>
        </Card>
    )
}

export default QuestionV1
