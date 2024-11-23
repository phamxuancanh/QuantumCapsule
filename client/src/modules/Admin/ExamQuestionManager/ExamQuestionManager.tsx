import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React, { useEffect } from 'react';
import { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid';
import { generateExamId, generateExamQuestionUID, generateQuestionUID } from 'helpers/Nam-helper/GenerateUID';
import { Autocomplete, Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { useDataSelected, useDataTable, useOpenForm } from './context/context';
import Loading from 'containers/loadable-fallback/loading';
import { IQuestion } from 'api/question/question.interfaces';
import { getListQuesion, getListQuestionByChapterId, getListQuestionByLessonId, } from 'api/question/question.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { getListLesson, importLessons } from 'api/lesson/lesson.api';
import { toast } from 'react-toastify';
import { addExam, deleteExamQuestion, getExamsByChapterId, getListExam, getListExamByChapterId, getListExamByLessonId, getListExamQuestionByChapterId, getListExamQuestionByExamId, insertExamQuestion, updateExamQuestion } from 'api/exam/exam.api';
import RenderEditCell from '../components/RenderEditCell/RenderEditCell';
import { IExam, IExamQuestion } from 'api/exam/exam.interface';
import { update } from 'lodash';
import QCChapterFilter, { IChapterFilter } from 'QCComponents/QCChapterFilter.tsx/ChapterFilter';
import ExcelExportBtn from 'components/buttons/excel/ExcelExportBtn';

interface IProps {
    // Define the props for the ExamManager component here
}
const typeExams = [
    {id: 0, name: "Bài kiểm tra"},
    {id: 2, name: "Bài ôn tập"}
]
const ExamQuestionManager: React.FC<IProps> = () => {

    const {setDataSelected} = useDataSelected(); 
    const {setOpenForm} = useOpenForm();
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [examParams, setExamParams] = React.useState<IExam[]>([])
    const [questionParams, setQuestionParams] = React.useState<IQuestion[]>([])
    const [typeExamSelected, setTypeExamSelected] = React.useState<number>(0)
    const [examIdSelected, setExamIdSelected] = React.useState<string>('')
    const [listExamFiltered, setListExamFiltered] = React.useState<IExam[]>([])
    const [filter, setFilter] = React.useState<IChapterFilter>({})

    const handleFilter = async (data: IChapterFilter) => {
        setFilter(data)
        try {
            if(typeExamSelected=== 0 && data.chapterId) {
                const response = await getListExamByChapterId(data.chapterId)
                setListExamFiltered(response.data.data)
                const resQuestions = await getListQuestionByChapterId(data.chapterId)
                setQuestionParams(resQuestions.data.data)
            }
            if(typeExamSelected=== 2 && data.lessonId) {
                const response = await getListExamByLessonId(data.lessonId)
                setListExamFiltered(response.data.data)
                const resQuestions = await getListQuestionByLessonId(data.lessonId)
                setQuestionParams(resQuestions.data.data)
            }
            setDataTable([])
            setExamIdSelected('')
            // setQuestionParams([])
        }catch (error: any) {
            setDataTable([])
        }
    }
    const handleFilterExamQuestion = async (examId: string) => {
        try {
            const response = await getListExamQuestionByExamId(examId)
            setDataTable(response.data.data)

        }catch (error: any) {
            setDataTable([])
        }
    }


    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            if(!data.examId) {
                toast.error("Vui lòng chọn bài tập")
                return false
            }
            if(!data.questionId) {
                toast.error("Vui lòng nhập câu hỏi")
                return false
            }
            try {
                const response = await insertExamQuestion(data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            try {
                const response = await updateExamQuestion(data.id, data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const response = await deleteExamQuestion(data)
                toast.success(response.data.message)
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
                <Typography fontSize={"20px"}>Hãy chọn lớp, môn, chương, bài học (nếu là bài ôn tập) và chọn bài tập</Typography>

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
                    <Grid item xs={12} md={8.5}>
                        <QCChapterFilter 
                            onChange={handleFilter}
                            mode={typeExamSelected}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Card sx={{p: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>Chọn bài tập</InputLabel>
                                <Select
                                    name="lessonId"
                                    value={examIdSelected}
                                    label="Bài học"
                                    onChange={(e)=> {
                                        setExamIdSelected(e.target.value)
                                        handleFilterExamQuestion(e.target.value)
                                    }}
                                    // disabled={selectedChapterId === ''} // Disable nếu chưa chọn lesson
                                >
                                {listExamFiltered?.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Card>
                    </Grid>
                </Grid>

                <SimpleTable 
                    initData={dataTable ? dataTable : [] as IExamQuestion[]}
                    toolbarComponent={<Box>
                        <ExcelExportBtn 
                            data={dataTable ? dataTable : [] as IExamQuestion[]}
                            headers={['id', 'examId', 'questionId', 'status']}
                            variant='outlined'
                            fileName="theory" 
                        />
                    </Box>}
                    initNewRow={{
                        id: generateExamQuestionUID(),
                        examId: examIdSelected,
                        questionId: '',
                        status: true
                    }as IExamQuestion}
                    columns={[
                        { field: 'questionId', headerName: 'Câu hỏi', width: 130, 
                            editable: true,
                            valueFormatter: (value: string) => {
                                const temp = questionParams?.find((item) => item.id === value)
                                return `${temp?.title} - ${temp?.content}`
                            },
                            renderEditCell(params) {
                                return <RenderEditCell params={params} dataParams={questionParams} label='title' label2='content'  editCellField='questionId'/>
                            },
                        },

                        // { field: 'examId', headerName: 'Bài tập', width: 130, 
                        //     editable: true,
                        //     valueFormatter: (value: string) => {
                        //         const temp = examParams?.find((item) => item.id === value)
                        //         return temp?.name
                        //     },
                        //     renderEditCell(params) {
                        //         return <RenderEditCell params={params} dataParams={examParams} label='name' editCellField='examId'/>
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
            {/* } */}

            </Box>
        </Box>
    );
};

export default ExamQuestionManager;