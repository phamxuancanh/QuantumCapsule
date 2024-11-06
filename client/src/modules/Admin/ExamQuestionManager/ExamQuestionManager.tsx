import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React, { useEffect } from 'react';
import { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid';
import { generateExamId, generateExamQuestionUID, generateQuestionUID } from 'helpers/Nam-helper/GenerateUID';
import { Autocomplete, Box, TextField } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { useDataSelected, useDataTable, useOpenForm } from './context/context';
import Loading from 'containers/loadable-fallback/loading';
import { IQuestion } from 'api/question/question.interfaces';
import { getListQuesion, getListQuestionByChapterId, } from 'api/question/question.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { getListLesson, importLessons } from 'api/lesson/lesson.api';
import { toast } from 'react-toastify';
import { addExam, deleteExamQuestion, getExamsByChapterId, getListExam, getListExamByChapterId, getListExamQuestionByChapterId, insertExamQuestion, updateExamQuestion } from 'api/exam/exam.api';
import RenderEditCell from '../components/RenderEditCell/RenderEditCell';
import { IExam, IExamQuestion } from 'api/exam/exam.interface';
import { update } from 'lodash';
import QCChapterFilter, { IChapterFilter } from 'QCComponents/QCChapterFilter.tsx/ChapterFilter';
import ExcelExportBtn from 'components/buttons/excel/ExcelExportBtn';

interface IProps {
    // Define the props for the ExamManager component here
}

const ExamQuestionManager: React.FC<IProps> = () => {

    const {setDataSelected} = useDataSelected(); 
    const {setOpenForm} = useOpenForm();
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [examParams, setExamParams] = React.useState<IExam[]>([])
    const [questionParams, setQuestionParams] = React.useState<IQuestion[]>([])

    const handleFilter = async (data: IChapterFilter) => {
        try {
            const response = await getListExamQuestionByChapterId(data.chapterId ?? '')
            setDataTable(response.data.data)
            const responseExam = await getListExamByChapterId(data.chapterId ?? '')
            setExamParams(responseExam.data.data)
            const responeQuestion = await getListQuestionByChapterId(data.chapterId ?? '')
            setQuestionParams(responeQuestion.data.data)
        }catch (error: any) {
            toast.error("Dữ liệu chưa được lấy: " + error.message)
        }
    }


    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            try {
                const response = await insertExamQuestion(data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            try {
                const response = await updateExamQuestion(data.id, data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const response = await deleteExamQuestion(data)
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
            {/* {!dataTable?.length ? <>Không có dữ liệu</>: */}

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
                        examId: '',
                        questionId: '',
                    }as IExamQuestion}
                    columns={[
                        // { field: 'id', headerName: 'ID', width: 70 },
                        // { field: 'examId', headerName: 'Bài tập', width: 130, editable: true, type: "string" },
                        { field: 'questionId', headerName: 'Câu hỏi', width: 130, 
                            editable: true,
                            valueFormatter: (value: string) => {
                                const temp = questionParams?.find((item) => item.id === value)
                                return temp?.content
                            },
                            renderEditCell(params) {
                                return <RenderEditCell params={params} dataParams={questionParams} label='content' editCellField='questionId'/>
                            },
                        },

                        { field: 'examId', headerName: 'Bài tập', width: 130, 
                            editable: true,
                            valueFormatter: (value: string) => {
                                const temp = examParams?.find((item) => item.id === value)
                                return temp?.name
                            },
                            renderEditCell(params) {
                                return <RenderEditCell params={params} dataParams={examParams} label='name' editCellField='examId'/>
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
            {/* } */}

            </Box>
        </Box>
    );
};

export default ExamQuestionManager;