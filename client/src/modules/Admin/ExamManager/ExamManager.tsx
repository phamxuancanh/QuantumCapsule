import React, { useEffect } from "react"
import { initTableData, listChapterParams } from "./data/ExamManagerData"
import { GridColDef, GridSingleSelectColDef } from "@mui/x-data-grid"
import { generateExamId } from "helpers/Nam-helper/GenerateUID"
import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material"
import { ACTIONS } from "utils/enums"
import ToolbarComponent from "./components/toolbar/ToolbarComponent"
import { useDataSelected, useDataTable, useOpenForm } from "./context/context"
import AddQuestionBox from "./components/add-questions/AddQuestionBox"
import { addExam, deleteExam, getListExam, getListExamByChapterId, getListExamByLessonId, importExamQuestions, importExams, updateExam } from "api/exam/exam.api"
import { IExam, ListExamParams } from "api/exam/exam.interface"
import Loading from "containers/loadable-fallback/loading"
import loadable from "@loadable/component"
import { getListAllChapter, getListChapter } from "api/chapter/chapter.api"
import { IChapter } from "api/chapter/chapter.interface"
import { getListLesson, getListLessonByChapterId } from "api/lesson/lesson.api"
import { ILesson } from "api/lesson/lesson.interface"
import { toast } from "react-toastify"
import QCChapterFilter, { IChapterFilter } from "QCComponents/QCChapterFilter.tsx/ChapterFilter"
import QCDateFilter from "QCComponents/QCDateFilter/QCDateFilter"
import RenderEditCell from "../components/RenderEditCell/RenderEditCell"
import ExcelExportBtn from "components/buttons/excel/ExcelExportBtn"
const SimpleTable = loadable(() => import("components/tables/simpleTable/SimpleTable"), { fallback: <Loading /> });

const typeExams = [
    {id: 0, name: "Bài kiểm tra"},
    {id: 2, name: "Bài ôn tập"}
]
interface IProps {
    // Define the props for the ExamManager component here
}

const ExamManager: React.FC<IProps> = () => {
    const { setDataSelected } = useDataSelected()
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [chapterParams, setChapterParams] = React.useState<IChapter[]>([])
    const [lessonParams, setLessonParams] = React.useState<ILesson[]>([])
    const [typeExamSelected, setTypeExamSelected] = React.useState<number>(0)
    const [filter, setFilter] = React.useState<IChapterFilter>({
        chapterId: "",
        lessonId: "",
    })

    const handleFilter = async (data: IChapterFilter) => {
        setFilter(data)
        try {
            if(typeExamSelected === 0){ // bai kiem tra
                const response = await getListExamByChapterId(data.chapterId ?? '')
                setDataTable(response.data.data)
            }
            if(typeExamSelected === 2){ // bai on tap
                const response = await getListExamByLessonId(data.lessonId ?? '')
                setDataTable(response.data.data)
            }

            // const resLessons = await getListLessonByChapterId(data.chapterId ?? '')
            // setLessonParams(resLessons.data.data)
            // const resChapters = await getListAllChapter()
            // setChapterParams(resChapters.data.data)
        }catch (error: any) {
            setDataTable([])
            // toast.error("Dữ liệu chưa được lấy: " + error.message)
        }
    }

    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data)
            if(data.order === null || !data.name ){
                toast.error("Vui lòng nhập đủ thông tin")
                return false
            }
            if(typeExamSelected === 0 && !filter.chapterId){
                toast.error("Vui lòng chọn chương")
                return false
            }
            if(typeExamSelected === 2 && !filter.lessonId){
                toast.error("Vui lòng chọn bài học")
                return false
            }
            try{
                await addExam(data)
                toast.success("Exam added successfully")
            }catch(e: any){
                toast.error("Error: " + e.message )
                return false
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data)
            if(data.order === null || !data.name ){
                toast.error("Vui lòng nhập đủ thông tin")
                return false
            }
            if(typeExamSelected === 0 && !filter.chapterId){
                toast.error("Vui lòng chọn chương")
                return false
            }
            if(typeExamSelected === 2 && !filter.lessonId){
                toast.error("Vui lòng chọn bài học")
                return false
            }
            try{
                const resUpdate = await updateExam(data.id, data)
                toast.success(resUpdate.data.message)
            }catch(e: any){
                toast.error("Error: " + e.message)
                return false
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data)
            try{
                const resDelete = await deleteExam(data)
                toast.success(resDelete.data.message)
            }catch(e: any){
                toast.error("Error: " + e.message)
                return false
            }
        }
        return true
    }
    return (
        <Box>
            <Box p={1}>
                <Grid container alignItems={"center"}>
                    <Grid item xs={12} md={1.5}>
                        <Card sx={{
                            p: 2,
                        }}>
                            <FormControl>
                                <InputLabel>Chọn</InputLabel>
                                <Select
                                    name="lessonId"
                                    value={typeExamSelected}
                                    label="Bài học"
                                    onChange={(e)=>setTypeExamSelected(e.target.value as number)}
                                    // disabled={selectedChapterId === ''} // Disable nếu chưa chọn lesson
                                >
                                {typeExams?.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>

                        </Card>
                    </Grid>
                    <Grid item xs={12} md={10.5}>
                        <QCChapterFilter 
                            onChange={handleFilter}
                            mode={typeExamSelected}
                        />

                    </Grid>

                </Grid>
                <SimpleTable
                    initData={dataTable as unknown as IExam[]}
                    toolbarComponent={<Box>
                        <ExcelExportBtn 
                            data={dataTable ? dataTable : [] as IExam[]}
                            headers={['id', 'name', 'order', 'lessonId', 'chapterId', 'status']}
                            variant='outlined'
                            fileName="exam" 
                        />
                    </Box>}
                    loading={loading}
                    getRowId={(row) => row.id}
                    initNewRow={{
                        id: generateExamId(),
                        name: "Tên bài tập",
                        chapterId: filter.chapterId,
                        lessonId: filter.lessonId,
                        order: 0,
                        status: true,
                    }}
                    // toolbarComponent={<ToolbarComponent />}
                    columns={
                        [
                            {
                                field: "order",
                                headerName: "Sắp xếp",
                                maxWidth: 150,
                                editable: true,
                                type: "number",
                            },
                            {
                                field: "name",
                                headerName: "Tên bài tập",
                                editable: true,
                            },
                            // { field: 'chapterId', headerName: 'Chương', width: 130, 
                            //     editable: true,
                            //     valueFormatter: (value: string) => {
                            //         const temp = chapterParams?.find((item) => item.id === value)
                            //         return temp?.name
                            //     },
                            //     renderEditCell(params) {
                            //         return <RenderEditCell params={params} dataParams={chapterParams} label='name' editCellField='chapterId'/>
                            //     },
                            // },
                            // { field: 'lessonId', headerName: 'Bài học', width: 180, 
                            //     editable: true,
                            //     valueFormatter: (value: string) => {
                            //         const temp = lessonParams?.find((item) => item.id === value)
                            //         return temp?.name
                            //     },
                            //     renderEditCell(params) {
                            //         return <RenderEditCell params={params} dataParams={lessonParams} label='name' editCellField='lessonId'/>
                            //     },
                            // },
                            // {
                            //     field: "status",
                            //     headerName: "Trạng thái",
                            //     width: 100,
                            // },
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
            {/* <AddQuestionBox /> */}
        </Box>
    )
}

export default ExamManager
