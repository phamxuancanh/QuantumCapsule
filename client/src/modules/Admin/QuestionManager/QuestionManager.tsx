import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React, { useEffect } from 'react';
import { initTableData, listChapterParams } from './data/TheoryData';
import { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid';
import { generateExamId, generateQuestionUID } from 'helpers/Nam-helper/GenerateUID';
import { Box } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { useDataSelected, useDataTable, useOpenForm } from './context/context';
import Loading from 'containers/loadable-fallback/loading';
import { IQuestion } from 'api/question/question.interfaces';
import { addQuestion, deleteQuestion, getListQuesion, getListQuestionByChapterId, importQuestions, updateQuestion } from 'api/question/question.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { getListLesson, getListLessonByChapterId, importLessons } from 'api/lesson/lesson.api';
import { toast } from 'react-toastify';
import QCChapterFilter, { IChapterFilter } from 'QCComponents/QCChapterFilter.tsx/ChapterFilter';
import RenderEditCell from '../components/RenderEditCell/RenderEditCell';
import ExcelExportBtn from 'components/buttons/excel/ExcelExportBtn';

interface IProps {
    // Define the props for the ExamManager component here
}

const ExamManager: React.FC<IProps> = () => {

    const {setDataSelected} = useDataSelected(); 
    const {setOpenForm} = useOpenForm();
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [lessonParams, setLessonParams] = React.useState<ILesson[]>([])

    const handleFilter = async (data: IChapterFilter) => {
        try {
            const response = await getListQuestionByChapterId(data.chapterId ?? '')
            setDataTable(response.data.data)
            const resLessons = await getListLessonByChapterId(data.chapterId ?? '')
            setLessonParams(resLessons.data.data)
        }catch (error: any) {
            toast.error("Dữ liệu chưa được lấy: " + error.message)
        }
    }

    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            try {
                const response = await addQuestion(data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            try {
                const response = await updateQuestion(data.id, data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const response = await deleteQuestion(data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
            }
        }
    }
    return (
        <Box>
            <Box p={2}>
            <QCChapterFilter 
                onChange={handleFilter}
            />
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
                        lessonId: "lesson001",
                        status: true,
                    }as IQuestion}
                    columns={[
                        // { field: 'id', headerName: 'ID', width: 70 },
                        { field: 'questionType', headerName: 'Loại câu hỏi', width: 130, editable: true, type: "number" },
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
                        { field: 'lessonId', headerName: 'Bài học', width: 180, 
                            editable: true,
                            valueFormatter: (value: string) => {
                                const temp = lessonParams?.find((item) => item.id === value)
                                return temp?.name
                            },
                            renderEditCell(params) {
                                return <RenderEditCell params={params} dataParams={lessonParams} label='name' editCellField='lessonId'/>
                            },
                        },
                        { field: 'status', headerName: 'Trạng thái', width: 130 }
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