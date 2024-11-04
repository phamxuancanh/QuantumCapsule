import SimpleTable from "components/tables/simpleTable/SimpleTable"
import React, { useEffect } from "react"
import { GridColDef, GridSingleSelectColDef } from "@mui/x-data-grid"
import {
    generateExamId,
    generateTheoryUID,
} from "helpers/Nam-helper/GenerateUID"
import { Box } from "@mui/material"
import { ACTIONS } from "utils/enums"
import { useDataSelected, useDataTable, useOpenForm } from "./context/context"
import { ILesson } from "api/lesson/lesson.interface"
import { ITheory } from "api/theory/theory.interface"
import { addTheory, deleteTheory, getListTheory, getListTheoryByChapterId, importTheories, updateTheory } from "api/theory/theory.api"
import { getListLesson, getListLessonByChapterId } from "api/lesson/lesson.api"
import Loading from "containers/loadable-fallback/loading"
import { toast } from "react-toastify"
import QCChapterFilter, { IChapterFilter } from "QCComponents/QCChapterFilter.tsx/ChapterFilter"
import RenderEditCell from "../components/RenderEditCell/RenderEditCell"

interface IProps {
    // Define the props for the ExamManager component here
}

const ExamManager: React.FC<IProps> = () => {
    const { setDataSelected } = useDataSelected()
    const { setOpenForm } = useOpenForm()
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [lessonParams, setLessonParams] = React.useState<ILesson[]>([])

    const handleFilter = async (data: IChapterFilter) => {
        try {
            const response = await getListTheoryByChapterId(data.chapterId ?? '')
            setDataTable(response.data.data)
            const resLessons = await getListLessonByChapterId(data.chapterId ?? '')
            setLessonParams(resLessons.data.data)
        }catch (error: any) {
            toast.error("Dữ liệu chưa được lấy: " + error.message)
        }
    }

    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data)
            try {
                const response = await addTheory(data)
                toast.success(response.data.message)
            } catch (error: any) {
                console.error("data chưa được lưu: ", error.message)
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data)
            try {
                const response = await updateTheory(data.id, data)
                toast.success(response.data.message)
            } catch (error: any) {
                console.error("data chưa được lưu: ", error.message )
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data)
            try {
                const response = await deleteTheory(data)
                toast.success(response.data.message)
            } catch (error: any) {
                console.error("data chưa được lưu: ", error.message)
            }
        }
    }
    return (
        <Box>
            <Box p={5}>
                <QCChapterFilter 
                    onChange={handleFilter}
                />
                <SimpleTable
                    initData={dataTable ? dataTable : ([] as ITheory[])}
                    initNewRow={
                        {
                            id: generateTheoryUID(),
                            lessonId: "lesson001",
                            name: "",
                            description: "",
                            summary: "",
                            url: "",
                            type: "",
                            order: 0,
                            status: true,
                        } as ITheory
                    }
                    columns={
                        [
                            {
                                field: "name",
                                headerName: "Tên",
                                width: 130,
                                editable: true,
                            },
                            {
                                field: "description",
                                headerName: "Mô tả",
                                width: 130,
                                editable: true,
                            },
                            {
                                field: "summary",
                                headerName: "Tóm tắt bài học",
                                width: 130,
                                editable: true,
                            },
                            {
                                field: "url",
                                headerName: "URL",
                                width: 130,
                                editable: true,
                            },
                            {
                                field: "type",
                                headerName: "Kiểu",
                                width: 130,
                                editable: true,
                            },

                            {
                                field: "lessonId",
                                headerName: "Lesson ID",
                                width: 130,
                                editable: true,
                                valueFormatter: (value: string) => {
                                    const temp = lessonParams?.find((item) => item.id === value)
                                    return temp?.name
                                },
                                renderEditCell(params) {
                                    return <RenderEditCell params={params} dataParams={lessonParams} label='name' editCellField='lessonId'/>
                                },
                            },

                            {
                                field: "order",
                                headerName: "Order",
                                width: 130,
                            },
                            {
                                field: "status",
                                headerName: "Status",
                                width: 130,
                            },
                        ] as GridColDef[]
                    }
                    onRowClick={(row) => {
                        setDataSelected(row.row)
                        // setOpenForm(true);
                    }}
                    onUpdateRow={(data, action) =>
                        handleUpdateRow(data, action)
                    }
                />
            </Box>
        </Box>
    )
}

export default ExamManager
