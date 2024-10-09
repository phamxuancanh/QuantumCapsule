import React from "react"
// import { IProvider } from "../context"
import Context from "../context"
import { IQuestion } from "api/question/question.interfaces"
import { IAnswer } from "api/answer/answer.interfaces"
import { IResult } from "api/result/result.interface"
import { defaultAction, IAction } from "utils/interfaces"

interface IProps {
    children: React.ReactNode
}

export interface IProvider {

    examId: {
        examId: string
        setExamId: React.Dispatch<React.SetStateAction<string>>
    }
    totalScore: {
        totalScore: number
        setTotalScore: React.Dispatch<React.SetStateAction<number>>
    }
    listQuestion: {
        listQuestion: IQuestion[]
        setListQuestion: React.Dispatch<React.SetStateAction<IQuestion[]>>
    }
    listAnswer: {
        listAnswer: IAnswer[]
        setListAnswer: React.Dispatch<React.SetStateAction<IAnswer[]>>
    }
    currentQuestion: {
        currentQuestion: IQuestion
        setCurrentQuestion: React.Dispatch<React.SetStateAction<IQuestion>>
    }
    result: {
        result: IResult
        setResult: React.Dispatch<React.SetStateAction<IResult>>
    }
    openResult: {
        openResult: boolean
        setOpenResult: React.Dispatch<React.SetStateAction<boolean>>
    }
    isSumited: {
        isSumited: boolean
        setIsSumited: React.Dispatch<React.SetStateAction<boolean>>
    },
    actStarModal: {
        actStarModal: IAction
        setActStarModal: React.Dispatch<React.SetStateAction<IAction>>
    }
}

const Provider: React.FC<IProps> = ({ children }) => {
    // Đây là nơi bạn xác định giá trị mà bạn muốn chia sẻ
    const [examId, setExamId] = React.useState<string>("exam00001")
    const [totalScore, setTotalScore] = React.useState<number>(0)
    const [listQuestion, setListQuestion] = React.useState<IQuestion[]>([])
    const [listAnswer, setListAnswer] = React.useState<IAnswer[]>([])
    const [currentQuestion, setCurrentQuestion] = React.useState<IQuestion>({})
    const [result, setResult] = React.useState<IResult>({})
    const [openResult, setOpenResult] = React.useState<boolean>(false)
    const [isSumited, setIsSumited] = React.useState<boolean>(false)
    const [actStarModal, setActStarModal] = React.useState<IAction>(defaultAction)

    const state: IProvider = {
        examId: {
            examId,
            setExamId
        },
        totalScore: {
            totalScore,
            setTotalScore,
        },
        listQuestion: {
            listQuestion,
            setListQuestion,
        },
        listAnswer: {
            listAnswer,
            setListAnswer,
        },
        currentQuestion: {
            currentQuestion,
            setCurrentQuestion,
        },
        result: {
            result,
            setResult,
        },
        openResult: {
            openResult,
            setOpenResult
        },
        isSumited: {
            isSumited,
            setIsSumited
        },
        actStarModal: {
            actStarModal,
            setActStarModal
        }
    }
    return <Context.Provider value={state}>{children}</Context.Provider>
}

export default Provider
