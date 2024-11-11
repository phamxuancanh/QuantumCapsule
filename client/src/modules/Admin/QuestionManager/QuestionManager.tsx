import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React, { useEffect } from 'react';
import { initTableData, listChapterParams } from './data/TheoryData';
import { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid';
import { generateExamId, generateQuestionUID } from 'helpers/Nam-helper/GenerateUID';
import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { useDataSelected, useDataTable, useOpenForm } from './context/context';
import Loading from 'containers/loadable-fallback/loading';
import { IQuestion } from 'api/question/question.interfaces';
import { addQuestion, deleteQuestion, getListQuesion, getListQuestionByChapterId, getListQuestionByLessonId, importQuestions, updateQuestion } from 'api/question/question.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { getListLesson, getListLessonByChapterId, importLessons } from 'api/lesson/lesson.api';
import { toast } from 'react-toastify';
import QCChapterFilter, { IChapterFilter } from 'QCComponents/QCChapterFilter.tsx/ChapterFilter';
import RenderEditCell from '../components/RenderEditCell/RenderEditCell';
import ExcelExportBtn from 'components/buttons/excel/ExcelExportBtn';

interface IProps {
    // Define the props for the ExamManager component here
}
const typeExams = [
    {id: 0, name: "Bài kiểm tra"},
    {id: 2, name: "Bài ôn tập"}
]

const typeQuestions = [
    {id: 1, name: "Trắc nghiệm 1 đáp án"},
    {id: 2, name: "Điền đáp án đúng"},
    {id: 3, name: "Trắc nghiệm nhiều đáp án"},
]

const ExamManager: React.FC<IProps> = () => {

    const {setDataSelected} = useDataSelected(); 
    const {setOpenForm} = useOpenForm();
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [lessonParams, setLessonParams] = React.useState<ILesson[]>([])
    const [typeExamSelected, setTypeExamSelected] = React.useState<number>(0)
    const [filter, setFilter] = React.useState<IChapterFilter>({})

    const handleFilter = async (data: IChapterFilter) => {
        setFilter(data)
        try {
            if(typeExamSelected === 0){ // bài kiểm tra
                const response = await getListQuestionByChapterId(data.chapterId ?? '')
                setDataTable(response.data.data)
            }
            if(typeExamSelected === 2){ // bài ôn tập
                const response = await getListQuestionByLessonId(data.lessonId ?? '')
                setDataTable(response.data.data)
            }
            // const resLessons = await getListLessonByChapterId(data.chapterId ?? '')
            // setLessonParams(resLessons.data.data)
        }catch (error: any) {
            setDataTable([])
        }
    }

    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            if(!data.title || !data.content || !data.correctAnswer) {
                toast.error("Vui lòng nhập các trường tiêu đề, nội dung và đáp án đúng")
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
            try {
                const response = await addQuestion(data)
                toast.success("Thêm thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            if(!data.title || !data.content || !data.correctAnswer) {
                toast.error("Vui lòng nhập các trường tiêu đề, nội dung và đáp án đúng")
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
            try {
                const response = await updateQuestion(data.id, data)
                toast.success("Cập nhập thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const response = await deleteQuestion(data)
                toast.success("Xóa thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false

            }
        }
        return true
    }
    return (
        <Box>
            <Box p={2}>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={1.5}>
                        <Card sx={{p: 2}}>
                            <FormControl fullWidth>
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
                    initData={dataTable ? dataTable : [] as IQuestion[]}
                    toolbarComponent={<Box>
                        <ExcelExportBtn 
                            data={dataTable ? dataTable : [] as IQuestion[]}
                            headers={['id', 'questionType', 'title', 'content', 'contentImg', 'A', 'B', 'C', 'D', 'E', 'correctAnswer', 'explainAnswer', 'lessonId', 'status']}
                            variant='outlined'
                            fileName="exam" 
                        />
                    </Box>}
                    initNewRow={{
                        id: generateQuestionUID(),
                        questionType: 1,
                        title: "",
                        content: "",
                        contentImg: "",
                        A: "",
                        B: "",
                        C: "",
                        D: "",
                        E: "",
                        correctAnswer: "",
                        explainAnswer: "",
                        lessonId: filter.lessonId ?? "",
                        chapterId: filter.chapterId ?? '',
                        status: true,
                    }as IQuestion}
                    columns={[
                        // { field: 'id', headerName: 'ID', width: 70 },
                        { field: 'questionType', headerName: 'Loại câu hỏi', width: 180, 
                            editable: true,
                            valueFormatter: (value: number) => {
                                const temp = typeQuestions?.find((item) => item.id === value)
                                return temp?.name
                            },
                            renderEditCell(params) {
                                return <RenderEditCell params={params} dataParams={typeQuestions} label='name' editCellField='questionType'/>
                            },
                        },
                        // { field: 'questionType', headerName: 'Loại câu hỏi', width: 130, editable: true, type: "number" },
                        { field: 'title', headerName: 'Tiêu đề', width: 130, editable: true },
                        { field: 'content', headerName: 'Nội dung', width: 130, editable: true },
                        { field: 'contentImg', headerName: 'Ảnh', width: 130, editable: true },
                        { field: 'A', headerName: 'A', width: 130, editable: true },
                        { field: 'B', headerName: 'B', width: 130, editable: true },
                        { field: 'C', headerName: 'C', width: 130, editable: true },
                        { field: 'D', headerName: 'D', width: 130, editable: true },
                        { field: 'E', headerName: 'E', width: 130, editable: true },
                        { field: 'correctAnswer', headerName: 'Đáp án đúng', width: 130, editable: true },
                        { field: 'explainAnswer', headerName: 'Giải thích đáp án', width: 130, editable: true },
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
                        // { field: 'status', headerName: 'Trạng thái', width: 130 }
                    ] as GridColDef[]}
                    onRowClick={(row) => {
                        setDataSelected(row.row)
                        // setOpenForm(true);
                    }}
                    onUpdateRow={(data, action) => handleUpdateRow(data, action)}
                />
            </Box>
        </Box>
    );
};

export default ExamManager;