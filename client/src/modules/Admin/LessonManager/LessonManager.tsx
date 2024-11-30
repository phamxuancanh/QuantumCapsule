import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React, { useEffect } from 'react';
import { GridColDef,  } from '@mui/x-data-grid';
import { generateExamQuestionUID, generateLessonUID,  } from 'helpers/Nam-helper/GenerateUID';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { useDataSelected, useDataTable, useOpenForm } from './context/context';
import { ILesson } from 'api/lesson/lesson.interface';
import { deleteLesson, getListLessonByChapterId, getListLessonByFilterParams, importLessons, insertLesson, updateLesson } from 'api/lesson/lesson.api';
import { toast } from 'react-toastify';
import RenderEditCell from '../components/RenderEditCell/RenderEditCell';
import { IExam, IExamQuestion } from 'api/exam/exam.interface';
import QCChapterFilter, { IChapterFilter } from 'QCComponents/QCChapterFilter.tsx/ChapterFilter';
import { getListAllChapter } from 'api/chapter/chapter.api';
import { IChapter } from 'api/chapter/chapter.interface';
import ExcelExportBtn from 'components/buttons/excel/ExcelExportBtn';
import ExcelReaderBtn from 'components/buttons/excel/ExcelReaderBtn';
import CustomModal from 'components/modals/customModal/CustomModal';
import ExamManager from '../ExamManager/ExamManager';
import ExamManagerProvider from '../ExamManager/ExamManagerProvider';

interface IProps {
    // Define the props for the ExamManager component here
    chapter?: IChapter; 
}

const LessonManager: React.FC<IProps> = (props) => {

    const {dataSelected, setDataSelected} = useDataSelected(); 
    // const {setOpenForm} = useOpenForm();
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    // const [chapterParams, setChapterParams] = React.useState<IChapter[]>([])
    const [filter, setFilter] = React.useState<IChapterFilter>({} as IChapterFilter)
    const [openBaiTap, setOpenBaiTap] = React.useState(false)


    useEffect(() => {
        if(props.chapter){
            handleFilter({chapterId: props.chapter.id})
        }
    }, [])

    const handleFilter = async (data: IChapterFilter) => {
        setFilter(data)
        try {
            const response = await getListLessonByFilterParams({subjectId: data.subjectId, grade: data.grade, chapterId: data.chapterId ?? ''})
            setDataTable(response.data.data)
            // const responseChapter = await getListAllChapter()
            // setChapterParams(responseChapter.data.data)
        }catch (error: any) {
            setDataTable([])

            // toast.error("Dữ liệu chưa được lấy: " + error.message)
        }
    }


    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            if(!data.name || data.order === null) {
                toast.error("Vui lòng nhập đủ thông tin: thứ tự và tên bài học")
                return false
            }
            if(!filter.chapterId) {
                toast.error("Vui lòng chọn chương")
                return false
            }
            console.log("CREATE", data);
            try {
                const response = await insertLesson(data)
                setDataTable(pre => [response.data.data, ...pre ?? []])
                toast.success("Thêm mới thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            if(!data.name || data.order === null) {
                toast.error("Vui lòng nhập đủ thông tin: thứ tự và tên bài học")
                return false
            }
            try {
                const response = await updateLesson(data.id, data)
                setDataTable(pre => pre?.map((item) => item.id === data.id ? data : item))
                toast.success("Cập nhập thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const response = await deleteLesson(data)
                setDataTable(pre => pre?.filter((item) => item.id !== data))
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
            <CustomModal 
                title='Quản lý bài tập'
                open={openBaiTap}
                setOpenModal={setOpenBaiTap}
                children={<Box>
                    <ExamManagerProvider
                        lesson={dataSelected as ILesson}
                    />
                </Box>}
                width='80%'
                sx={{height: '95vh'}}
            />
            <Box p={1}>
                {!props.chapter && 
                    <Typography fontSize={"20px"}>Hãy chọn lớp, môn, chương</Typography>
                }

                {!props.chapter && 
                    <QCChapterFilter 
                        onChange={handleFilter}
                        mode={2}
                    />
                }
            {/* {!dataTable?.length ? <>Không có dữ liệu</>: */}

                <SimpleTable 
                    initData={dataTable ? dataTable : [] as ILesson[]}
                    toolbarComponent={<Box display={"flex"} gap={1}>
                        <ExcelReaderBtn variant='outlined' sheetIndex={0} name='Thêm bài học từ excel' onUpload={async (data)=>{
                            if(!filter.chapterId) {
                                toast.warning("Hãy chọn chương trước")
                                return
                            }
                            try {
                                const payload = data.map((item) => ({
                                    id: generateLessonUID(),
                                    chapterId: filter.chapterId ?? "",
                                    name: item.name ?? '',
                                    order: item.order ?? 0,
                                    status: true,
                                } as ILesson))
                                const response = await importLessons(payload)
                                toast.success("Nhập dữ liệu thành công")
                                console.log([...response.data.data, ...dataTable ?? []]);
                                
                                setDataTable(pre => [...response.data.data, ...pre ?? []])
                            }catch (error: any) {
                                toast.error("Nhập dữ liệu thất bại: " + error.message)
                            }
                        }} />
                        <ExcelExportBtn 
                            data={dataTable ? dataTable : [] as ILesson[]}
                            headers={[ "name", "order"]}
                            variant='outlined'
                            fileName="lesson" 
                        />
                         <Button variant='outlined'
                            onClick={() => {
                                if(!dataSelected) {
                                    toast.warning("Hãy chọn chương muốn quản lý bài học")
                                    return
                                }
                                setOpenBaiTap(true)
                            }}
                        >
                            Quản lý Bài tập
                        </Button>
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