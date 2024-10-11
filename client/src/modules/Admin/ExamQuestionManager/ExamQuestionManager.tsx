import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React, { useEffect } from 'react';
import { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid';
import { generateExamId, generateQuestionUID } from 'helpers/Nam-helper/GenerateUID';
import { Autocomplete, Box, TextField } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { useDataSelected, useDataTable, useOpenForm } from './context/context';
import Loading from 'containers/loadable-fallback/loading';
import { IQuestion } from 'api/question/question.interfaces';
import { addQuestion, deleteQuestion, getListQuesion, importQuestions, updateQuestion } from 'api/question/question.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { getListLesson, importLessons } from 'api/lesson/lesson.api';
import { toast } from 'react-toastify';
import { addExam } from 'api/exam/exam.api';
import RenderEditCell from '../components/RenderEditCell/RenderEditCell';

interface IProps {
    // Define the props for the ExamManager component here
}

const ExamQuestionManager: React.FC<IProps> = () => {

    const {setDataSelected} = useDataSelected(); 
    const {setOpenForm} = useOpenForm();
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [lessonParams, setLessonParams] = React.useState<ILesson[]>([])

    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const response = await getListQuesion({
                    params: {
                        page: 1,
                        search: "",
                        size: 30,
                    },
                })

                setDataTable(response.data.data as IQuestion[])

                // const response2 = await getListChapter({
                //     params: {
                //         page: 1,
                //         search: "",
                //         size: 100,
                //     },
                // })
                // setChapterParams(response2.data.data)

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
            <Box p={5}>
            {!dataTable?.length ? <Loading /> :

                <SimpleTable 
                    initData={dataTable ? dataTable : [] as IQuestion[]}
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
                        { field: 'lessonId', headerName: 'Bài học', width: 130, 
                            editable: true,
                            valueFormatter: (params: string) => {
                                const lesson = lessonParams.find((lesson) => lesson.id === params)
                                return lesson?.name
                            },
                            renderEditCell(params) {
                                return <RenderEditCell params={params} dataParams={lessonParams}/>
                            },

                            // type: 'singleSelect',
                        },
                        { field: 'status', headerName: 'Trạng thái', width: 130 }
                    ] as GridColDef[]}
                    onRowClick={(row) => {
                        setDataSelected(row.row)
                        // setOpenForm(true);
                    }}
                    onUpdateRow={(data, action) => handleUpdateRow(data, action)}
                />
            }

            </Box>
        </Box>
    );
};

export default ExamQuestionManager;