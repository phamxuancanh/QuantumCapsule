import {
    Box,
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
import RenderContentImg from "../render-content-img/RenderContentImg"

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
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const { value } = event.target
        const currentIndex = checkedItems.indexOf(value)
        const newChecked = [...checkedItems]

        if(checked ) {
            newChecked.push(value)
        }
        else {
            newChecked.splice(currentIndex, 1)
        }
        props.onAnswer && props.onAnswer(convertArrToSortedString(newChecked))
        setCheckedItems(newChecked)
    }

    function renderColor(answer: string) {
        if(props.mode === "result" && props.yourAnswer?.isCorrect) {
            if(props.question.correctAnswer?.includes(answer)) {
                return "#4caf50"
            }
        }
        return "#000"
    }
    const renderAllAnswerNotNull = (question: IQuestion) => {
        const answers = [
            {value: "a", label: question.A, },
            {value: "b", label: question.B, },
            {value: "c", label: question.C, },
            {value: "d", label: question.D, },
            {value: "e", label: question.E, },
        ].filter((answer) => answer.label)
        return answers.map((answer, index) => {
            if (answer) {
                return (
                    <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                value={answer.value}
                                onChange={handleChange}
                                checked={
                                    props.yourAnswer?.yourAnswer?.includes(answer.value)
                                }
                                disabled={props.mode === "result" || props.mode === "submit"}
                            />
                        }
                        label={ 
                            <Typography style={{color: renderColor(answer.value)}} sx={{fontSize: "30px"}}>
                                {answer.label}
                            </Typography>
                        }
                    />
                )
            }
            return <></>
        })
    }

    return (
        <Card sx={{ p: 5 }}>
            <Typography color={"#257180"} fontWeight={800}>
                {props.question.title}
            </Typography>
            <Typography color={"#1E201E"} fontWeight={600} sx={{fontSize: "30px"}}>
                {props.question.content}
            </Typography>
            {/* <img src={props.question.contentImg} alt="question" /> */}
            <RenderContentImg imageContent={props.question.contentImg!}/>
            <FormGroup>{renderAllAnswerNotNull(props.question)}</FormGroup>
            {props.mode === "result" && (
                <Box>
                    <Typography color={props.yourAnswer?.isCorrect ? "#4caf50" : "#f44336"} fontWeight={600}>
                        {props.yourAnswer?.isCorrect ? "Bạn trả lời đúng rồi" : "Bạn trả lời sai rồi"}
                    </Typography>
                    <Typography color={"#1E201E"} fontWeight={600}>
                        {props.question.explainAnswer}
                    </Typography>

                </Box>
            )}
        </Card>
    )
}

export default QuestionV3
