import {
    Box,
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
import RenderContentImg from "../render-content-img/RenderContentImg"

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
            console.log(props.yourAnswer);
            
            props.onAnswer &&
            props.onAnswer(event.target.value)
    }
    return (
        <Card sx={{ p: 5, minHeight: "350px"}}>
            {props.mode === "submit" && !props.yourAnswer?.yourAnswer &&
                <Typography color={"red"} fontWeight={600} sx={{fontSize: "25px"}}>Chưa trả lời</Typography>
            }
            <Typography color={"#257180"} fontWeight={600} sx={{fontSize: "25px"}} mb={1}>
                {props.question.title} 
            </Typography>
            <Typography color={"#1E201E"} sx={{fontSize: "25px"}}>
                {props.question.content}
            </Typography>
            <RenderContentImg imageContent={props.question.contentImg!}/>
            <FormControl>
                <TextField
                    onChange={(e) => {
                        handleChange(e)
                    }}
                    focused
                    color="success"
                    value={props.yourAnswer?.yourAnswer}
                    // defaultValue={props.yourAnswer?.yourAnswer}
                    disabled={props.mode === "result" || props.mode === "submit"}
                    sx={{
                        "& .Mui-disabled": {
                            WebkitTextFillColor: "#000 !important", // Thay đổi màu chữ khi disabled
                        }
                    }}
                />
            </FormControl>
            {props.mode === "result" && (
                <Box>
                    <Typography color={props.yourAnswer?.isCorrect ? "#4caf50" : "#f44336"} fontWeight={600} fontSize={"25px"}>
                        {props.yourAnswer?.isCorrect ? "Bạn trả lời đúng rồi" : "Bạn trả lời sai rồi"}
                    </Typography>
                    <Typography color={"#4caf50"} fontSize={"25px"}>
                        Đáp án đúng: {props.question.correctAnswer}
                    </Typography>
                    <Typography color={"#1E201E"} fontSize={"25px"}>
                        Giải thích: {props.question.explainAnswer}
                    </Typography>

                </Box>
            )}
        </Card>
    )
}

export default QuestionV2
