import React, { useEffect } from "react"
import { initTableData, listChapterParams } from "./data/ExamManagerData"
import { GridColDef, GridSingleSelectColDef } from "@mui/x-data-grid"
import { generateExamId } from "helpers/Nam-helper/GenerateUID"
import { Box } from "@mui/material"
import { ACTIONS } from "utils/enums"
import ToolbarComponent from "./components/toolbar/ToolbarComponent"
import { useDataSelected, useDataTable, useOpenForm } from "./context/context"
import AddQuestionBox from "./components/add-questions/AddQuestionBox"
import { addExam, deleteExam, getListExam, importExamQuestions, importExams, updateExam } from "api/exam/exam.api"
import { IExam, ListExamParams } from "api/exam/exam.interface"
import Loading from "containers/loadable-fallback/loading"
import loadable from "@loadable/component"
import { getListChapter } from "api/chapter/chapter.api"
import { IChapter } from "api/chapter/chapter.interface"
import { getListLesson } from "api/lesson/lesson.api"
import { ILesson } from "api/lesson/lesson.interface"
import { toast } from "react-toastify"
const SimpleTable = loadable(() => import("components/tables/simpleTable/SimpleTable"), { fallback: <Loading /> });

interface IProps {
    // Define the props for the ExamManager component here
}

const ExamManager: React.FC<IProps> = () => {
    const { setDataSelected } = useDataSelected()
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [chapterParams, setChapterParams] = React.useState<IChapter[]>([])
    const [lessonParams, setLessonParams] = React.useState<ILesson[]>([])

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const response = await getListExam({
                    params: {
                        page: 1,
                        search: "",
                        size: 200,
                    },
                })

                setDataTable(response.data.data as IExam[])

                const response2 = await getListChapter({
                    params: {
                        page: 1,
                        search: "",
                        size: 100,
                    },
                })
                setChapterParams(response2.data.data)

                const response3 = await getListLesson({
                    params: {
                        page: 1,
                        search: "",
                        size: 100,
                    },
                })
                setLessonParams(response3.data.data)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
        setLoading(false)
    }, [])

    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data)
            try{
                await addExam(data)
                toast.success("Exam added successfully")
            }catch(e: any){
                toast.error("Error: " + e.message )
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data)
            try{
                const resUpdate = await updateExam(data.id, data)
                toast.success(resUpdate.data.message)
            }catch(e: any){
                toast.error("Error: " + e.message)
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data)
            try{
                const resDelete = await deleteExam(data)
                toast.success(resDelete.data.message)
            }catch(e: any){
                toast.error("Error: " + e.message)
            }
        }
    }
    return (
        <Box>
            <Box p={1}>
                {!dataTable?.length ? <Loading /> :
                    <SimpleTable
                        initData={dataTable as unknown as IExam[]}
                        loading={loading}
                        getRowId={(row) => row.id}
                        initNewRow={{
                            id: generateExamId(),
                            name: "",
                            chapterId: "",
                            lessonId: "",
                            order: 0,
                            status: true,
                        }}
                        toolbarComponent={<ToolbarComponent />}
                        columns={
                            [
                                {
                                    field: "name",
                                    headerName: "Tên bài tập",
                                    width: 130,
                                    editable: true,
                                },
                                {
                                    field: "chapterId",
                                    headerName: "Chương",
                                    width: 130,
                                    valueOptions: chapterParams.map(
                                        (chapter) => {
                                            return {
                                                value: chapter.id,
                                                label: chapter.name,
                                            }
                                        },
                                    ),
                                    editable: true,
                                    type: "singleSelect",
                                },
                                {
                                    field: "lessonId",
                                    headerName: "Bài học",
                                    width: 130,
                                    valueOptions: lessonParams.map(
                                        (lesson) => {
                                            return {
                                                value: lesson.id,
                                                label: lesson.name,
                                            }
                                        },
                                    ),
                                    editable: true,
                                    type: "singleSelect",
                                },
                                {
                                    field: "order",
                                    headerName: "Sắp xếp",
                                    width: 130,
                                    editable: true,
                                    type: "number",
                                },
                                {
                                    field: "status",
                                    headerName: "Trạng thái",
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
                }
                </Box>
            <AddQuestionBox />
        </Box>
    )
}

export default ExamManager
