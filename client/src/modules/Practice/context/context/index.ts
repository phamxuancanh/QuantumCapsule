import { createContext, useContext } from "react"
import { IProvider } from "../provider"

const Context = createContext<IProvider | undefined>(undefined)
export const useTotalScore = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useTotalScore must be used within a Provider")
    }
    return context.totalScore
}
export const useListQuestion = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useListQuestion must be used within a Provider")
    }
    return context.listQuestion
}
export const useListAnswer = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("uselistAnswer must be used within a Provider")
    }
    return context.listAnswer
}
export const useCurrentQuestion = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useCurrentQuestion must be used within a Provider")
    }
    return context.currentQuestion
}
export const useResult = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useResult must be used within a Provider")
    }
    return context.result
}
export const useOpenResult = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useOpenResult must be used within a Provider")
    }
    return context.openResult
}

export default Context
