import React from "react"
// import { IProvider } from "../context"
import Context from "../context"
import { IQuestion } from "api/question/question.interfaces"


interface IProps {
    children: React.ReactNode
}

export interface IProvider {

    dataTable: {
        dataTable: IQuestion[] | undefined
        setDataTable: React.Dispatch<React.SetStateAction<IQuestion[] | undefined>>
    }
    dataForm: {
        dataForm: IQuestion | undefined
        setDataForm: React.Dispatch<React.SetStateAction<IQuestion | undefined>>
    }
    dataSelected: {
        dataSelected: IQuestion | undefined
        setDataSelected: React.Dispatch<React.SetStateAction<IQuestion | undefined>>
    }
    openForm: {
        openForm: boolean | undefined
        setOpenForm: React.Dispatch<React.SetStateAction<boolean | undefined>>
    }
    action:{
        action: string | undefined
        setAction: React.Dispatch<React.SetStateAction<string | undefined>>
    }
    filter:{
        filter: any | undefined
        setFilter: React.Dispatch<React.SetStateAction<any | undefined>>
    }
}

const Provider: React.FC<IProps> = ({ children }) => {
    // Đây là nơi bạn xác định giá trị mà bạn muốn chia sẻ

    const [dataTable, setDataTable] = React.useState<IQuestion[] | undefined>([])
    const [dataForm, setDataForm] = React.useState<IQuestion | undefined>()
    const [dataSelected, setDataSelected] = React.useState<IQuestion | undefined>()
    const [openForm, setOpenForm] = React.useState<boolean | undefined>(false)
    const [action, setAction] = React.useState<string | undefined>('')
    const [filter, setFilter] = React.useState<any | undefined>({})
    const [listIdQuesionSelected, setListIdQuesionSelected] = React.useState<string[] | undefined>([])
    const state: IProvider = {
        dataTable: {
            dataTable,
            setDataTable,
        },
        dataForm: {
            dataForm,
            setDataForm,
        },
        dataSelected: {
            dataSelected,
            setDataSelected,
        },
        openForm: {
            openForm,
            setOpenForm
        },
        action:{
            action,
            setAction
        },
        filter:{
            filter,
            setFilter
        },

    }

    
    return <Context.Provider value={state}>{children}</Context.Provider>
}

export default Provider
