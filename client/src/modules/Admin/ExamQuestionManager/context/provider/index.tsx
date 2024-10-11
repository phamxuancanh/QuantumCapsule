import React from "react"
// import { IProvider } from "../context"
import Context from "../context"
import { IExamQuestion } from "api/exam/exam.interface"


interface IProps {
    children: React.ReactNode
}

export interface IProvider {

    dataTable: {
        dataTable: IExamQuestion[] | undefined
        setDataTable: React.Dispatch<React.SetStateAction<IExamQuestion[] | undefined>>
    }
    dataForm: {
        dataForm: IExamQuestion | undefined
        setDataForm: React.Dispatch<React.SetStateAction<IExamQuestion | undefined>>
    }
    dataSelected: {
        dataSelected: IExamQuestion | undefined
        setDataSelected: React.Dispatch<React.SetStateAction<IExamQuestion | undefined>>
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

    const [dataTable, setDataTable] = React.useState<IExamQuestion[] | undefined>([])
    const [dataForm, setDataForm] = React.useState<IExamQuestion | undefined>()
    const [dataSelected, setDataSelected] = React.useState<IExamQuestion | undefined>()
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
