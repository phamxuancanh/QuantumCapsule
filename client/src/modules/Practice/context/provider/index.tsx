import React from "react"
// import { IProvider } from "../context"
import Context from "../context"
import { IQuestion } from "api/question/question.interfaces"
import { IAnswer } from "api/answer/answer.interfaces"
import { IResult } from "api/result/result.interface"

interface IProps {
    children: React.ReactNode
}

export interface IProvider {
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
}

const Provider: React.FC<IProps> = ({ children }) => {
    // Đây là nơi bạn xác định giá trị mà bạn muốn chia sẻ

    const [totalScore, setTotalScore] = React.useState<number>(0)
    const [listQuestion, setListQuestion] = React.useState<IQuestion[]>([])
    const [listAnswer, setListAnswer] = React.useState<IAnswer[]>([])
    const [currentQuestion, setCurrentQuestion] = React.useState<IQuestion>({})
    const [result, setResult] = React.useState<IResult>({})
    const [openResult, setOpenResult] = React.useState<boolean>(false)

    const state: IProvider = {
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
        }
    }
    return <Context.Provider value={state}>{children}</Context.Provider>
}

export default Provider
