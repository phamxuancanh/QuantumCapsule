import { Box, Button, Card } from "@mui/material"
import { IAnswer } from "api/answer/answer.interfaces"
import { IQuestion } from "api/question/question.interfaces"
import {
    useActCongratulation,
    useCurrentQuestion,
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

interface IProps {
    isOpen?: boolean
}

const QuestionBox: React.FC<IProps> = (props) => {
    const { listAnswer, setListAnswer } = useListAnswer()
    const { currentQuestion, setCurrentQuestion } = useCurrentQuestion()
    const { listQuestion, setListQuestion } = useListQuestion()
    const { result, setResult } = useResult()
    const {openResult, setOpenResult} = useOpenResult()
    const [isNextQuestion, setIsNextQuestion] = React.useState(false)
    const {actCongratulation,setActCongratulation} = useActCongratulation()
    const confettiRef = useRef(null);
    const correctSoundUrl = '/path/to/congrats.mp3';
    const errorSoundUrl = '/path/to/error.mp3';
    const [isFireworksRunning, setIsFireworksRunning] = useState(false);


    useEffect(() => {
        if (isFireworksRunning) {
          const timer = setTimeout(() => {
            setIsFireworksRunning(false); // Dừng pháo hoa sau 3 giây
          }, 3000);
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
    const handleClickNextQuestion = () => {
        if(!isNextQuestion) {
            setIsNextQuestion(true)
            return
        }
        const yourAnswer = listAnswer.find((ans) => ans.questionId === currentQuestion.id)
        playSound(yourAnswer?.isCorrect!)
        setIsFireworksRunning(yourAnswer?.isCorrect!)
        setIsNextQuestion(false)
        const index = listQuestion.findIndex(
            (question: IQuestion) => question.id === currentQuestion.id,
        )
        if (index < listQuestion.length - 1) {
            setCurrentQuestion(listQuestion[index + 1])
        } else {
            setOpenResult(true)
        }
    }
    const renderQuestion = (question: IQuestion) => {
        const yourAnswer = listAnswer.find((ans) => ans.questionId === question.id)
        const mode = isNextQuestion ? "result" : "practice"
        if (question?.questionType === 1) {
            return <QuestionV1 question={question} yourAnswer={yourAnswer} onAnswer={handleAnswer} mode={mode}/>
        }
        if (question?.questionType === 2) {
            return <QuestionV2  question={question} yourAnswer={yourAnswer} onAnswer={handleAnswer} mode={mode}/>
        }
        if (question?.questionType === 3) {
            return <QuestionV3  question={question}  yourAnswer={yourAnswer} onAnswer={handleAnswer} mode={mode}/>
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
            <SpeakerV1 text={currentQuestion?.content!} label="Đọc câu hỏi" autoSpeak />
            {renderQuestion(currentQuestion)}
            <Button
                variant="contained"
                fullWidth
                color="success"
                onClick={handleClickNextQuestion}
            >
                {isNextQuestion ?  'Câu tiếp theo' : 'xem kết quả'}
            </Button>
            {/* <ReactCanvasConfetti refConfetti={makeConfetti} /> */}
            {isFireworksRunning && (
                <Fireworks autorun={{ speed: 3 }} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }} />
            )}
        </Box>
    )
}

export default QuestionBox
