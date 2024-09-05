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
import { IQuestion } from "api/question/question.interfaces"
import React from "react"

interface IProps {
    question: IQuestion
    onAnswer?: (answer: string) => void
}

const QuestionV2: React.FC<IProps> = (props) => {
    const { question, onAnswer } = props
    // const renderAllAnswerNotNull = (question: IQuestion) => {
    //     const answers = [
    //         question.A,
    //         question.B,
    //         question.C,
    //         question.D,
    //         question.E,
    //     ]
    //     return answers.map((answer, index) => {
    //         if (answer) {
    //             return (
    //                 <FormControlLabel
    //                     value={answer}
    //                     control={<Radio />}
    //                     label={answer}
    //                     key={index}
    //                 />
    //             )
    //         }
    //         return <></>
    //     })
    // }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.target.value && onAnswer && onAnswer(event.target.value)
    }
    return (
        <Card sx={{ p: 10 }}>
            <Typography color={"#FF8A8A"} fontWeight={800}>
                {question.title}
            </Typography>
            <Typography color={"#1E201E"} fontWeight={600}>
                {question.content}
            </Typography>
            <img src={question.contentImg} alt="question" />
            <FormControl >
                <FormLabel component="legend">Trả lời ở đây</FormLabel>
                <TextField onChange={(e)=>{handleChange(e)}} focused color="success"/>
            </FormControl>
        </Card>
    )
}

export default QuestionV2
