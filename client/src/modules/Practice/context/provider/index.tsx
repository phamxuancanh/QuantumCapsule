import React from "react"
// import { IProvider } from "../context"
import Context from "../context"
import { IQuestion, IAnswer } from "api/practice/question.interfaces"

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
}

const Provider: React.FC<IProps> = ({ children }) => {
    // Đây là nơi bạn xác định giá trị mà bạn muốn chia sẻ

    const [totalScore, setTotalScore] = React.useState<number>(0)
    const [listQuestion, setListQuestion] = React.useState<IQuestion[]>([])
    const [listAnswer, setListAnswer] = React.useState<IAnswer[]>([])
    const [currentQuestion, setCurrentQuestion] = React.useState<IQuestion>({})

    const state: IProvider = {
        totalScore: {
            totalScore,
            setTotalScore,
        },
        listQuestion: {
            listQuestion,
            setListQuestion,
        },
        listAnswer:{
            listAnswer,
            setListAnswer,  
        },
        currentQuestion: {
            currentQuestion,
            setCurrentQuestion,
        }
    }
    return (
    <Context.Provider value={state}>{children}</Context.Provider>
  )
}

export default Provider
