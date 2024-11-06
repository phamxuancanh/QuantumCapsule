import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React from 'react';
import { GridColDef,  } from '@mui/x-data-grid';
import { generateExamQuestionUID, generateLessonUID,  } from 'helpers/Nam-helper/GenerateUID';
import { Autocomplete, Box, TextField } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { useDataSelected, useDataTable, useOpenForm } from './context/context';
import { ILesson } from 'api/lesson/lesson.interface';
import { deleteLesson, getListLessonByChapterId, insertLesson, updateLesson } from 'api/lesson/lesson.api';
import { toast } from 'react-toastify';
import RenderEditCell from '../components/RenderEditCell/RenderEditCell';
import { IExam, IExamQuestion } from 'api/exam/exam.interface';
import QCChapterFilter, { IChapterFilter } from 'QCComponents/QCChapterFilter.tsx/ChapterFilter';
import { getListAllChapter } from 'api/chapter/chapter.api';
import { IChapter } from 'api/chapter/chapter.interface';
import ExcelExportBtn from 'components/buttons/excel/ExcelExportBtn';

interface IProps {
    // Define the props for the ExamManager component here
}

const LessonManager: React.FC<IProps> = () => {

    const {setDataSelected} = useDataSelected(); 
    const {setOpenForm} = useOpenForm();
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    const [chapterParams, setChapterParams] = React.useState<IChapter[]>([])
    const handleFilter = async (data: IChapterFilter) => {
        try {
            const response = await getListLessonByChapterId(data.chapterId ?? '')
            setDataTable(response.data.data)
            const responseChapter = await getListAllChapter()
            setChapterParams(responseChapter.data.data)
        }catch (error: any) {
            toast.error("Dữ liệu chưa được lấy: " + error.message)
        }
    }


    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            try {
                const response = await insertLesson(data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            try {
                const response = await updateLesson(data.id, data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const response = await deleteLesson(data)
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
                    initData={dataTable ? dataTable : [] as ILesson[]}
                    toolbarComponent={<Box>
                        <ExcelExportBtn 
                            data={dataTable ? dataTable : [] as ILesson[]}
                            headers={["id", "chapterId", "name", "order", "status"]}
                            variant='outlined'
                            fileName="lesson" 
                        />
                    </Box>}
                    initNewRow={{
                        id: generateLessonUID(),
                        examId: '',
                        chapterId: '',
                        name: '',
                        order: 0,
                        status: true
                    }as ILesson}
                    columns={[
                        { field: 'chapterId', headerName: 'Chương', width: 130, 
                            editable: true,
                            valueFormatter: (value: string) => {
                                const temp = chapterParams?.find((item) => item.id === value)
                                return temp?.name
                            },
                            renderEditCell(params) {
                                return <RenderEditCell params={params} dataParams={chapterParams} label='name' editCellField='chapterId'/>
                            },
                        },
                        { field: 'name', headerName: 'Tên bài học', width: 130, editable: true, type: "string" },
                        { field: 'order', headerName: 'Thứ tự', width: 130, editable: true, type: "number" },
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

export default LessonManager;