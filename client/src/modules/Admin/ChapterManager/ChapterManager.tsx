import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import React, { useEffect } from 'react';
import { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid';
import { generateExamId, generateQuestionUID } from 'helpers/Nam-helper/GenerateUID';
import { Box } from '@mui/material';
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
    const [subjectParams, setSubjectParams] = React.useState<ISubject[]>([])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await getListAllChapter()
    //             setDataTable(response.data.data)
    //             setSubjectParams([
    //                 {
    //                     id: 'subject1',
    //                     name: 'Toán'
    //                 },
    //                 {
    //                     id: 'subject2',
    //                     name: 'Tiếng việt'
    //                 }
    //             ]);
    //         }catch (error: any) {
    //             toast.error("Dữ liệu chưa được lấy: " + error.message)
    //         }
    //     }
    //     fetchData()
    // }, [])
    const handleFilter = async (data: IChapterFilter) => {
        try {
            const response = await getListAllChapter()
            setDataTable(response.data.data.filter((item) => {
                return (data.grade === 0 || item.grade === data.grade) && (data.subjectId === '' || item.subjectId === data.subjectId)
            }))
            setSubjectParams([
                {
                    id: 'subject1',
                    name: 'Toán'
                },
                {
                    id: 'subject2',
                    name: 'Tiếng việt'
                }
            ]);
        }catch (error: any) {
            toast.error("Dữ liệu chưa được lấy: " + error.message)
        }
    }

    const handleUpdateRow = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            try {
                const response = await addChapter(data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            try {
                const response = await updateChapter(data.id, data)
                toast.success(response.data.message)
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const response = await deleteChapter(data)
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
                        id: generateQuestionUID(),
                        subjectId: "subject1",
                        name: "chương",
                        description:"mô tả" ,
                        grade: 1,
                        order: 0,
                        status: true,
                    }as IChapter}
                    columns={[
                        // { field: 'id', headerName: 'ID', width: 70 },
                        { field: 'name', headerName: 'Tên chương', width: 70 },
                        { field: 'subjectId', headerName: 'môn', width: 130, editable: true, type: "string",
                            valueFormatter: (value: string) => {
                                const temp = subjectParams?.find((item) => item.id === value)
                                return temp?.name
                            },
                            renderEditCell(params) {
                                return <RenderEditCell params={params} dataParams={subjectParams} label='name' editCellField='subjectId'/>
                            },
                        },
                        { field: 'description', headerName: 'Mô tả', width: 130, editable: true },
                        { field: 'grade', headerName: 'lớp', width: 130,  editable: true, type: "number",
                            preProcessEditCellProps: (params) => {
                                const value = Number(params.props.value);
                                const hasError = value < 1 || value > 5;
                                if (hasError) {
                                    toast.error("Lớp phải từ 1 đến 5")
                                }
                                return { ...params.props, error: hasError };
                            },
                        },
                        { field: 'order', headerName: 'Thứ tự', width: 130, editable: true, type: "number" },
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

export default ChapterManager;