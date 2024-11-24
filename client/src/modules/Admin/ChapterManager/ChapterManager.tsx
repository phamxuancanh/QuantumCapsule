import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React, { useEffect } from 'react';
import { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid';
import { generateChapterUID, generateExamId, generateQuestionUID } from 'helpers/Nam-helper/GenerateUID';
import { Box, Typography } from '@mui/material';
import { ACTIONS } from 'utils/enums';
import { useDataSelected, useDataTable, useOpenForm } from './context/context';
import Loading from 'containers/loadable-fallback/loading';
import { IQuestion } from 'api/question/question.interfaces';
import { toast } from 'react-toastify';
import QCChapterFilter, { IChapterFilter } from 'QCComponents/QCChapterFilter.tsx/ChapterFilter';
import RenderEditCell from '../components/RenderEditCell/RenderEditCell';
import { addChapter, deleteChapter, getListAllChapter, updateChapter } from 'api/chapter/chapter.api';
import { ISubject } from 'api/subject/subject.interface';
import { IChapter } from 'api/chapter/chapter.interface';
import ExcelExportBtn from 'components/buttons/excel/ExcelExportBtn';

interface IProps {
    // Define the props for the ExamManager component here
}

const ChapterManager: React.FC<IProps> = () => {

    const {setDataSelected} = useDataSelected(); 
    const {setOpenForm} = useOpenForm();
    const { dataTable, setDataTable } = useDataTable()
    const [loading, setLoading] = React.useState(false)
    // const [subjectParams, setSubjectParams] = React.useState<ISubject[]>([])

    const [filter, setFilter] = React.useState<IChapterFilter>({} as IChapterFilter)

    const handleFilter = async (data: IChapterFilter) => {
        setFilter(data)
        try {
            if(data.grade === null || !data.subjectId) {
                setDataTable([])
                return 
            }
            const response = await getListAllChapter()
            setDataTable(response.data.data.filter((item) => {
                return (data.grade === 0 || item.grade === data.grade) && (data.subjectId === '' || item.subjectId === data.subjectId)
            }))

        }catch (error: any) {
            setDataTable([])
            // toast.error("Dữ liệu chưa được lấy: " + error.message)
        }
    }

    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        console.log(data);
        if (action === ACTIONS.CREATE) {
            if(filter.grade === null || !filter.subjectId) {
                toast.error("Vui lòng chọn lớp và môn học")
                return false
            }
            if (data.order === null || !data.name) {
                toast.error("Vui lòng nhập đủ thông tin: thứ tự và tên chương")
                return false
            }
            console.log("CREATE", data);
            try {
                const response = await addChapter(data)
                toast.success("Thêm mới thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false

            }
        }
        if (action === ACTIONS.UPDATE) {
            if(filter.grade === null || !filter.subjectId) {
                toast.error("Vui lòng chọn lớp và môn học")
                return false
            }
            if (data.order === null  || !data.name) {
                toast.error("Vui lòng nhập đủ thông tin: thứ tự và tên chương")
                return false
            }
            console.log("UPDATE", data);
            try {
                const response = await updateChapter(data.id, data)
                toast.success("Cập nhập thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false

            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const response = await deleteChapter(data)
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
                <Typography fontSize={"20px"}>Hãy chọn lớp và môn</Typography>
                <QCChapterFilter 
                    onChange={handleFilter}
                    mode={1}
                />
                <SimpleTable 
                    initData={dataTable ? dataTable : [] as IChapter[]}
                    toolbarComponent={<Box>
                        <ExcelExportBtn 
                            data={dataTable ? dataTable : [] as IChapter[]}
                            headers={['id', 'name', 'subjectId', 'description', 'grade', 'order', 'status']}
                            variant='outlined'
                            fileName="chapter" 
                        />
                    </Box>}
                    initNewRow={{
                        id: generateChapterUID(),
                        subjectId: filter.subjectId ?? 'subject1',
                        name: "nhập tên chương",
                        description:"mô tả" ,
                        grade: filter.grade ?? 1,
                        order: 0,
                        status: true,
                    }as IChapter}
                    columns={[
                        { field: 'order', headerName: 'Thứ tự', maxWidth: 100, editable: true, type: "number" },
                        { field: 'name', headerName: 'Tên chương', maxWidth: 500, editable: true, type: "string" },
                        // { field: 'subjectId', headerName: 'Môn', width: 130, editable: true, type: "string",
                        //     valueFormatter: (value: string) => {
                        //         const temp = subjectParams?.find((item) => item.id === value)
                        //         return temp?.name
                        //     },
                        //     renderEditCell(params) {
                        //         return <RenderEditCell params={params} dataParams={subjectParams} label='name' editCellField='subjectId'/>
                        //     },
                        // },
                        { field: 'description', headerName: 'Mô tả', width: 500, editable: true },
                        // { field: 'grade', headerName: 'lớp', width: 130,  editable: true, type: "number",
                        //     preProcessEditCellProps: (params) => {
                        //         const value = Number(params.props.value);
                        //         const hasError = value < 1 || value > 5;
                        //         if (hasError) {
                        //             toast.error("Lớp phải từ 1 đến 5")
                        //         }
                        //         return { ...params.props, error: hasError };
                        //     },
                        // },
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

export default ChapterManager;