import { Box, Button, Card, Typography } from "@mui/material"
import { IAnswer } from "api/answer/answer.interfaces"
import { IQuestion } from "api/question/question.interfaces"
import {
    useActCongratulation,
    useActStarModal,
    useCurrentQuestion,
    useIsNextQuestion,
    useIsSumited,
    useListAnswer,
    useListQuestion,
    useOpenResult,
    useResult,
} from "../../context/context"
import ExplainAnswerV1 from "QCComponents/explain-answer/explain-answer-v1/ExplainAnswerV1"
import QuestionV1 from "QCComponents/questions/question-v1/QuestionV1"
import QuestionV2 from "QCComponents/questions/question-v2/QuestionV2"
import QuestionV3 from "QCComponents/questions/question-v3/QuestionV3"
import SpeakerV1 from "QCComponents/speakers/speaker-v1/SpeakerV1"
import React, { useCallback, useEffect, useRef, useState } from "react"
import ReactCanvasConfetti from 'react-canvas-confetti';
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { insertResult } from "api/result/result.api"
import { caculateStar } from "helpers/Nam-helper/InitHelper"
import { IResult } from "api/result/result.interface"
import { insertListAnswer } from "api/answer/answer.api"
import { toast } from "react-toastify"
import { ACTIONS } from "utils/enums"

interface IProps {
    isOpen?: boolean
}

const QuestionBox: React.FC<IProps> = (props) => {
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { listQuestion, setListQuestion } = useListQuestion()
    const { result, setResult } = useResult()
    const {openResult, setOpenResult} = useOpenResult()
    const {isNextQuestion, setIsNextQuestion} = useIsNextQuestion()
    const {actCongratulation,setActCongratulation} = useActCongratulation()
    const confettiRef = useRef(null);
    const correctSoundUrl = `${process.env.PUBLIC_URL}/clap.mp3`;
    const errorSoundUrl = `${process.env.PUBLIC_URL}/error.mp3`;
    const [isFireworksRunning, setIsFireworksRunning] = useState(false);
    const {setIsSumited} = useIsSumited()
    const {setActStarModal}  = useActStarModal()

    useEffect(() => {
        if (isFireworksRunning) {
          const timer = setTimeout(() => {
            setIsFireworksRunning(false); // Dừng pháo hoa sau 3 giây
          }, 1000);
          return () => clearTimeout(timer); // Xóa bộ đếm thời gian khi component unmount
        }
    }, [isFireworksRunning]);

    const handleAnswer = (yourAnswer: string) => {
        const newListAnswer = listAnswer.map((answer: IAnswer) => {
            if (answer.questionId === currentQuestion.id) {
                return {
                    ...answer,
                    yourAnswer: yourAnswer,
                    isCorrect: currentQuestion.correctAnswer === yourAnswer,
                } as IAnswer
            }
            return answer
        })
        
        setListAnswer(newListAnswer)
        setResult({
            ...result,
            yourScore: newListAnswer.filter((answer) => answer.isCorrect).length,

        })
    }
    const handleSubmit = async () => {
        try {
            const res2 = await insertResult({
                ...result,
                star: caculateStar(result),
            } as IResult)        
            const res1 = await insertListAnswer(listAnswer)
            toast.success("Nộp bài thành công")
            setIsSumited(true)
            setActStarModal({open: true, payload: caculateStar(result), type: ACTIONS.VIEW})
            playSound(true)
            setIsFireworksRunning(true)
        } catch (error: any) {
            toast.error(error.message)
        }
    }
    const handleClickNextQuestion = () => {
        if(!isNextQuestion) {
            const yourAnswer = listAnswer.find((ans) => ans.questionId === currentQuestion.id)
            if(!yourAnswer?.yourAnswer) {
                toast.error("Bạn chưa trả lời")
                return
            }
            setIsNextQuestion(true)
            playSound(yourAnswer?.isCorrect!)
            setIsFireworksRunning(yourAnswer?.isCorrect!)
            return
        }
        setIsNextQuestion(false)
        const index = listQuestion.findIndex(
            (question: IQuestion) => question.id === currentQuestion.id,
        )
        if (index < listQuestion.length - 1) {
            setCurrentQuestion(listQuestion[index + 1])
        } else {
            setOpenResult(true)
            handleSubmit()
        }
    }
    const renderQuestion = (question: IQuestion) => {
        const yourAnswer = listAnswer.find((ans) => ans.questionId === question.id)
        const mode = isNextQuestion ? "result" : "practice"
        if (question?.questionType === 1) {
            return <QuestionV1 question={question} yourAnswer={yourAnswer} onAnswer={handleAnswer} mode={mode} sort={yourAnswer?.orderAnswer}/>
        }
        if (question?.questionType === 2) {
            return <QuestionV2  question={question} yourAnswer={yourAnswer} onAnswer={handleAnswer} mode={mode}/>
        }
        if (question?.questionType === 3) {
            return <QuestionV3  question={question}  yourAnswer={yourAnswer} onAnswer={handleAnswer} mode={mode} sort={yourAnswer?.orderAnswer}/>
        }
        return <></>
    }
    const playSound = (isCorrect: boolean) => {
        const soundUrl = isCorrect ? correctSoundUrl : errorSoundUrl;
        const audio = new Audio(soundUrl);
        audio.play();
      };
    
     
    return (
        <Box display={props.isOpen ? "block" : "none"}>
            <SpeakerV1 text={currentQuestion?.content!} label="Đọc câu hỏi" 
                variant="outlined"
            />
            {renderQuestion(currentQuestion)}
            <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={handleClickNextQuestion}
                sx={{textTransform: "none !important"}}
            >
                <Typography fontSize={"25px"} >
                    {!isNextQuestion ?  'Trả lời' : 
                        ( listQuestion.findIndex((question: IQuestion) => question.id === currentQuestion.id) === listQuestion.length -1? 'Hoàn thành' : "Câu tiếp theo")
                    }
                </Typography>
            </Button>
            {/* <ReactCanvasConfetti refConfetti={makeConfetti} /> */}
            {isFireworksRunning && (
                <Fireworks autorun={{ speed: 3 }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }} />
            )}
        </Box>
    )
}

export default QuestionBox
