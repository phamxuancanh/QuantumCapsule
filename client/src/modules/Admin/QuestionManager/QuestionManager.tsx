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
import { getListQuesion, importQuestions } from 'api/question/question.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { getListLesson, importLessons } from 'api/lesson/lesson.api';
import { toast } from 'react-toastify';

interface IProps {
    // Define the props for the ExamManager component here
}

const ExamManager: React.FC<IProps> = () => {

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
                await importQuestions([{...data}])
                toast.success("Dữ liệu đã được lưu")
            }catch (error) {
                toast.error("Dữ liệu chưa được lưu: " + error)
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            
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
                        { field: 'questionType', headerName: 'questionType', width: 130, editable: true, type: "number" },
                        { field: 'title', headerName: 'title', width: 130, editable: true },
                        { field: 'content', headerName: 'content', width: 130, editable: true },
                        { field: 'contentImg', headerName: 'contentImg', width: 130, editable: true },
                        { field: 'A', headerName: 'A', width: 130, editable: true },
                        { field: 'B', headerName: 'B', width: 130, editable: true },
                        { field: 'C', headerName: 'C', width: 130, editable: true },
                        { field: 'D', headerName: 'D', width: 130, editable: true },
                        { field: 'E', headerName: 'E', width: 130, editable: true },
                        { field: 'correctAnswer', headerName: 'correctAnswer', width: 130, editable: true },
                        { field: 'explainAnswer', headerName: 'explainAnswer', width: 130, editable: true },
                        { field: 'lessonId', headerName: 'Lesson ID', width: 130, 
                            valueOptions: lessonParams.map((item) => {
                                return {
                                    value: item.id,
                                    label: item.name
                                }
                            }),
                            editable: true,
                            type: 'singleSelect',
                        },
                        { field: 'status', headerName: 'Status', width: 130 }
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

export default ExamManager;