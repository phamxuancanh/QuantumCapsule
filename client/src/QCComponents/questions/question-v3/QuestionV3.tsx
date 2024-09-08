import {
    Card,
    Checkbox,
    colors,
    FormControl,
    FormControlLabel,
    FormGroup,
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

const QuestionV3: React.FC<IProps> = (props) => {
    // Implement your component logic here
    // const { question, onAnswer } = props
    const [checkedItems, setCheckedItems] = React.useState<string[]>([])
    const convertArrToSortedString = (arr: string[]) => {
        return arr.sort().join("")
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        const currentIndex = checkedItems.indexOf(value)
        const newChecked = [...checkedItems]

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }
        props.onAnswer && props.onAnswer(convertArrToSortedString(newChecked))
        setCheckedItems(newChecked)
    }

    const renderAllAnswerNotNull = (question: IQuestion) => {
        const answers = [
            question.A,
            question.B,
            question.C,
            question.D,
            question.E,
        ]
        return answers.map((answer, index) => {
            if (answer) {
                return (
                    <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                value={answer}
                                onChange={handleChange}
                                checked={
                                    props.yourAnswer?.yourAnswer?.includes(answer)
                                }
                                disabled={props.mode === "result" || props.mode === "submit"}
                            />
                        }
                        label={answer}
                    />
                )
            }
            return <></>
        })
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
            <FormGroup>{renderAllAnswerNotNull(props.question)}</FormGroup>
        </Card>
    )
}

export default QuestionV3
