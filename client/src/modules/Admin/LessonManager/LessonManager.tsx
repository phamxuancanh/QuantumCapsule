import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React from 'react';
import { GridColDef,  } from '@mui/x-data-grid';
import { generateExamQuestionUID, generateLessonUID,  } from 'helpers/Nam-helper/GenerateUID';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
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
    const [filter, setFilter] = React.useState<IChapterFilter>({} as IChapterFilter)

    const handleFilter = async (data: IChapterFilter) => {
        setFilter(data)
        try {
            const response = await getListLessonByChapterId(data.chapterId ?? '')
            setDataTable(response.data.data)
            const responseChapter = await getListAllChapter()
            setChapterParams(responseChapter.data.data)
        }catch (error: any) {
            setDataTable([])

            // toast.error("Dữ liệu chưa được lấy: " + error.message)
        }
    }


    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            if(!data.name || data.order === null) {
                toast.error("Vui lòng nhập đủ thông tin")
                return false
            }
            if(!filter.chapterId) {
                toast.error("Vui lòng chọn môn và chương")
                return false
            }
            console.log("CREATE", data);
            try {
                const response = await insertLesson(data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            if(!data.name || data.order === null) {
                toast.error("Vui lòng nhập đủ thông tin")
                return false
            }
            if(!filter.chapterId) {
                toast.error("Vui lòng chọn môn và chương")
                return false
            }
            try {
                const response = await updateLesson(data.id, data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const response = await deleteLesson(data)
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
                <Typography fontSize={"20px"}>Hãy chọn lớp, môn, chương</Typography>

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
                        chapterId: filter.chapterId ?? "chapter001",
                        name: 'Nhập tên bài học',
                        order: 0,
                        status: true
                    }as ILesson}
                    columns={[
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
                        // { field: 'status', headerName: 'Trạng thái', width: 130, editable: true, type: "boolean" },
                        { field: 'order', headerName: 'Thứ tự', maxWidth: 150, editable: true, type: "number" },
                        { field: 'name', headerName: 'Tên bài học', editable: true, type: "string" },
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