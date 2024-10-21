import { createContext, useContext } from "react"
import { IProvider } from "../provider"

const Context = createContext<IProvider | undefined>(undefined)
export const useDataTable = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useDataTable must be used within a Provider")
    }
    return context.dataTable
}
export const useDataForm = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useDataForm must be used within a Provider")
    }
    return context.dataForm
}
export const useDataSelected = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useDataSelected must be used within a Provider")
    }
    return context.dataSelected
}
export const useOpenForm = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useOpenForm must be used within a Provider")
    }
    return context.openForm
}
export const useAction = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useAction must be used within a Provider")
    }
    return context.action
}

export const useFilter = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error("useFilter must be used within a Provider")
    }
    return context.filter
}

export default Context
