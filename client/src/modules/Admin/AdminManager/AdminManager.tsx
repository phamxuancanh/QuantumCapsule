import React, { useEffect } from 'react';
import { Box, Button, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QCChapterFilter, { IChapterFilter } from 'QCComponents/QCChapterFilter.tsx/ChapterFilter';
import { IChapter } from 'api/chapter/chapter.interface';
import { addChapter, deleteChapter, getListAllChapter, updateChapter } from 'api/chapter/chapter.api';
import { ACTIONS } from 'utils/enums';
import { IAction } from 'utils/interfaces';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';
import { generateChapterUID, generateExamId, generateExamQuestionUID, generateLessonUID, generateQuestionUID, generateTheoryUID } from 'helpers/Nam-helper/GenerateUID';
import { deleteLesson, getListLessonByFilterParams, insertLesson, updateLesson } from 'api/lesson/lesson.api';
import { ILesson } from 'api/lesson/lesson.interface';
import { addExam, deleteExam, deleteExamQuestion, deleteExamQuestionByExamAndQuestionId, getListExamByFilterParams, importExamQuestions, insertExamQuestion, updateExam } from 'api/exam/exam.api';
import { IExam, IExamQuestion } from 'api/exam/exam.interface';
import SimpleTable from 'components/tables/simpleTable/SimpleTable';
import ExcelExportBtn from 'components/buttons/excel/ExcelExportBtn';
import RenderEditCell from '../components/RenderEditCell/RenderEditCell';
import { IQuestion } from 'api/question/question.interfaces';
import { GridColDef } from '@mui/x-data-grid';
import { addQuestion, deleteQuestion, getListQuesionByExamId, getListQuestionByChapterId, getListQuestionByLessonId, importQuestions, updateQuestion } from 'api/question/question.api';
import ExcelReaderBtn from 'components/buttons/excel/ExcelReaderBtn';
import CustomModal from 'components/modals/customModal/CustomModal';
import { ITheory } from 'api/theory/theory.interface';
import { addTheory, deleteTheory, getTheoriesByLessonId, importTheories, updateTheory } from 'api/theory/theory.api';


const typeQuestions = [
    {id: 1, name: "Trắc nghiệm 1 đáp án"},
    {id: 2, name: "Điền đáp án đúng"},
    {id: 3, name: "Trắc nghiệm nhiều đáp án"},
]


const AdminManager: React.FC = () => {

    const [filter, setFilter] = React.useState<IChapterFilter>({} as IChapterFilter)
    const [dataSelected, setDataSelected] = React.useState<any>()
    const [listChapter, setListChapter] = React.useState<IChapter[]>([])
    const [listLesson, setListLesson] = React.useState<ILesson[]>([])
    const [listExam, setListExam] = React.useState<IExam[]>([])
    const [listQuestion, setListQuestion] = React.useState<IQuestion[]>([])
    const [listQuestionBank, setListQuestionBank] = React.useState<IQuestion[]>([])
    const [modalQuestionBank, setModalQuestionBank] = React.useState<boolean>(false)
    const [listTheory, setListTheory] = React.useState<ITheory[]>([])
    const [actThemChuong, setActThemChuong] = React.useState<IAction>({
        open: false,
        type: ACTIONS.CREATE
    })
    const [actSuaChuong, setActSuaChuong] = React.useState<IAction>({
        open: false,
        type: ACTIONS.CREATE
    })
    const [actThemBaiHoc, setActThemBaiHoc] = React.useState<IAction>({
        open: false,
        type: ACTIONS.CREATE
    })
    const [actSuaBaiHoc, setActSuaBaiHoc] = React.useState<IAction>({
        open: false,
        type: ACTIONS.CREATE
    })
    const [actThemBaiKiemTra, setActThemBaiKiemTra] = React.useState<IAction>({
        open: false,
        type: ACTIONS.CREATE
    })
    const [actSuaBaiKiemTra, setActSuaBaiKiemTra] = React.useState<IAction>({
        open: false,
        type: ACTIONS.CREATE
    })
    const [actThemBaiOnTap, setActThemBaiOnTap] = React.useState<IAction>({
        open: false,
        type: ACTIONS.CREATE
    })
    const [actSuaBaiOnTap, setActSuaBaiOnTap] = React.useState<IAction>({
        open: false,
        type: ACTIONS.CREATE
    })
    const [actQuanLy, setActQuanLy] = React.useState<IAction>({
        open: false,
        type: ACTIONS.CREATE
    } as IAction)

    useEffect(() => {
        handleFilter({
            grade:1,
            subjectId: 'subject1'
        } as IChapterFilter)
    }, []);
    useEffect(() => {
        (async ()=>{
            if(actQuanLy.payload?.type === 'exam' && actQuanLy.payload?.data) {
                try {
                    const resQuestions = await getListQuesionByExamId(actQuanLy.payload.data.id)
                    setListQuestion(resQuestions.data.data)
                }catch (error: any) {
                    toast.error("Lỗi: " + error.message)
                }
            }
            if(actQuanLy.payload?.type === 'chapter' && actQuanLy.payload?.data) {
                try {
                    const resQuestions = await getListQuestionByChapterId(actQuanLy.payload.data.id)
                    setListQuestion(resQuestions.data.data)
                }catch (error: any) {
                    toast.error("Lỗi: " + error.message)
                }
            }
            if(actQuanLy.payload?.type === 'lesson' && actQuanLy.payload?.data) {
                try {
                    const resQuestions = await getListQuestionByLessonId(actQuanLy.payload.data.id)
                    setListQuestion(resQuestions.data.data)
                }catch (error: any) {
                    toast.error("Lỗi: " + error.message)
                }
            }
            if(actQuanLy.payload?.type === 'theory' && actQuanLy.payload?.data) {
                try {
                    const resTheory = await getTheoriesByLessonId(actQuanLy.payload.data.id)
                    setListTheory(resTheory.data.theories)
                }catch (error: any) {
                    toast.error("Lỗi: " + error.message)
                }
            }
        })()
    }, [actQuanLy.payload?.data, actQuanLy.payload?.type]);



    const handleFilter = async (data: IChapterFilter) => {
        setFilter(data)
        setDataSelected(undefined)
        try {

            const response = await getListAllChapter()
            setListChapter(response.data.data.filter((item) => {
                return (data.grade === 0 || item.grade === data.grade) && (data.subjectId === '' || item.subjectId === data.subjectId)
            }))
            const resLessons = await getListLessonByFilterParams({
                grade: data.grade,
                subjectId: data.subjectId
            } as IChapterFilter)
            setListLesson(resLessons.data.data)
            const resExam = await getListExamByFilterParams({
                grade: data.grade,
                subjectId: data.subjectId
            } as IChapterFilter)
            setListExam(resExam.data.data)
        }catch (error: any) {
        }
    }
    const handleUpdateRowExamQuestion = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            if(!data.questionType || !data.title || !data.content || !data.correctAnswer) {
                toast.error("Vui lòng nhập đầy đủ thông tin: loại câu hỏi, tiêu đề, nội dung và đáp án đúng")
                return false
            }
            try {
                const response = await addQuestion(data)
                const resExamQuestion = await insertExamQuestion({
                    examId: actQuanLy.payload.data.id,
                    questionId: response.data.data.id
                } as IExamQuestion)
                setListQuestion([response.data.data, ...listQuestion])
                toast.success("Thêm thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            if(!data.questionType || !data.title || !data.content || !data.correctAnswer) {
                toast.error("Vui lòng nhập đầy đủ thông tin: loại câu hỏi, tiêu đề, nội dung và đáp án đúng")
                return false
            }
            try {
                const response = await updateQuestion(data.id, data)
                setListQuestion(listQuestion.map((item) => {
                    return item.id === data.id ? response.data.data : item
                }))
                toast.success("Cập nhập thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const res = await deleteExamQuestionByExamAndQuestionId(actQuanLy.payload?.data?.id, data)
                setListQuestion(listQuestion.filter((item) => item.id !== data))
                toast.success("Xóa thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false

            }
        }
        return true
    }
    const handleUpdateRowQuestionBank = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            if(!data.questionType || !data.title || !data.content || !data.correctAnswer) {
                toast.error("Vui lòng nhập đầy đủ thông tin: loại câu hỏi, tiêu đề, nội dung và đáp án đúng")
                return false
            }
            try {
                const response = await addQuestion(data)
                setListQuestion([response.data.data, ...listQuestion])
                toast.success("Thêm thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            if(!data.questionType || !data.title || !data.content || !data.correctAnswer) {
                toast.error("Vui lòng nhập đầy đủ thông tin: loại câu hỏi, tiêu đề, nội dung và đáp án đúng")
                return false
            }
            try {
                const response = await updateQuestion(data.id, data)
                setListQuestion(listQuestion.map((item) => {
                    return item.id === data.id ? response.data.data : item
                }))
                toast.success("Cập nhập thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const res = await deleteQuestion(actQuanLy.payload?.data?.id)
                setListQuestion(listQuestion.filter((item) => item.id !== data))
                toast.success("Xóa thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false

            }
        }
        return true
    }
    const handleUpdateRowTheory = async (data: any, action: ACTIONS) => {
        if (action === ACTIONS.CREATE) {
            console.log("CREATE", data);
            if(!data.name || !data.url || !data.type) {
                toast.error("Vui lòng nhập đầy đủ thông tin: tên, url, tiêu đề")
                return false
            }
            try {
                const response = await addTheory(data)
                setListTheory([response.data.data, ...listTheory])
                toast.success("Thêm thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.UPDATE) {
            console.log("UPDATE", data);
            if(!data.name || !data.url  || !data.type) {
                toast.error("Vui lòng nhập đầy đủ thông tin: tên, url, tiêu đề")
                return false
            }
            try {
                const response = await updateTheory(data.id, data)
                setListTheory(listTheory.map((item) => {
                    return item.id === data.id ? response.data.data : item
                }))
                toast.success("Cập nhập thành công")
            }catch (error: any) {
                toast.error("Dữ liệu chưa được lưu: " + error.message)
                return false
            }
        }
        if (action === ACTIONS.DELETE) {
            console.log("DELETE", data);
            try {
                const res = await deleteTheory(data)
                setListQuestion(listTheory.filter((item) => item.id !== data))
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
            {/* <QCChapterFilter 
                    onChange={handleFilter}
                    mode={1}
            /> */}
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={4} 
                    sx={{
                        maxHeight: '100vh',
                        overflow: 'auto'
                    }}
                >
                    <QCChapterFilter 
                        onChange={handleFilter}
                        mode={1}
                    />
                    <Button 
                        onClick={()=>{
                            setActThemChuong({
                                open: !actThemChuong.open,
                                type: ACTIONS.CREATE
                            })
                        }}
                        color='success'
                    >
                        <AddIcon />
                        <Typography fontSize={20}>Thêm chương mới</Typography>
                    </Button>
                    {
                        actThemChuong.open && (
                            <Box>
                                <TextField
                                    size='small'
                                    label="Tên chương"
                                    variant="outlined"
                                    sx={{width: "90%"}}
                                    onChange={(event) => {
                                        setActThemChuong({
                                            open:true,
                                            payload: event.target.value
                                        } as IAction)
                                    }}
                                />
                                <Tooltip title={<Typography>Lưu</Typography>} placement="top-start" arrow>
                                    <IconButton onClick={async ()=>{
                                        if(!actThemChuong.payload) {
                                            toast.error("Tên chương không được để trống")
                                            return
                                        }
                                        try {
                                            const result = await addChapter({
                                                id: generateChapterUID(),
                                                name: actThemChuong.payload,
                                                grade: filter.grade,
                                                subjectId: filter.subjectId
                                            } as IChapter)
                                            setListChapter([result.data.data, ...listChapter])
                                            toast.success("Thêm thành công")
                                        }catch (error: any) {
                                            toast.error("Thêm chương thất bại")
                                        }

                                        setActThemChuong({
                                            open: false,
                                            type: ACTIONS.CREATE
                                        })
                                    }}>
                                        <SaveIcon />
                                    </IconButton>

                                </Tooltip>
                            </Box>
                        )
                    }
                    <SimpleTreeView
                        onItemClick={(event, itemId) => {
                            console.log(itemId);
                            
                        }}
                    >
                        {
                            listChapter.map((chapterItem) => {
                                return <TreeItem  key={chapterItem.id}  itemId={chapterItem.id!} 
                                    label={
                                        <Box display={"flex"} justifyContent={"space-between"}>
                                            {actSuaChuong.open && actSuaChuong.payload.id === chapterItem.id  || 
                                                <Typography fontSize={20} fontWeight={"bold"}>{chapterItem.name}</Typography>
                                            }
                                            {
                                                actSuaChuong.open && actSuaChuong.payload.id === chapterItem.id && (
                                                    <Box display={"flex"} width={"80%"}>
                                                        <TextField
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                            }}
                                                            onKeyDown={(event) => {
                                                                event.stopPropagation()
                                                            }}
                                                            size='small'
                                                            label="Tên chương"
                                                            variant="outlined"
                                                            // sx={{width: "90%"}}
                                                            value={actSuaChuong.payload.name}
                                                            fullWidth
                                                            onChange={(event) => {
                                                                setActSuaChuong({
                                                                    open:true,
                                                                    payload: {
                                                                        ...actSuaChuong.payload,
                                                                        name: event.target.value
                                                                    }
                                                                } as IAction)
                                                            }}
                                                        />
                                                        
                                                        <Tooltip title={<Typography>Lưu</Typography>} placement="top-start" arrow>
                                                            <IconButton onClick={async ()=>{
                                                                if(!actSuaChuong.payload) {
                                                                    toast.error("Tên chương không được để trống")
                                                                    return
                                                                }
                                                                try {
                                                                    const result = await updateChapter(actSuaChuong.payload.id, actSuaChuong.payload)
                                                                    setListChapter(listChapter.map((item) => {
                                                                        return item.id === actSuaChuong.payload.id ? result.data.data : item
                                                                    }))
                                                                    toast.success("Đổi tên thành công")
                                                                }catch (error: any) {
                                                                    toast.error("Đổi tên thất bại")
                                                                }
                                                                setActSuaChuong({
                                                                    open: false,
                                                                    type: ACTIONS.CREATE
                                                                })
                                                            }}>
                                                                <SaveIcon />
                                                            </IconButton>

                                                        </Tooltip>
                                                    </Box>
                                                )
                                            }
                                            <Box display={"flex"}>
                                                <Tooltip title={<Typography>Đổi tên</Typography>} placement="top-start" arrow>
                                                    <IconButton size="small" onClick={(event) => {
                                                        event.stopPropagation()
                                                        setActSuaChuong({
                                                            open: !actSuaChuong.open,
                                                            payload: chapterItem,
                                                            type: ACTIONS.UPDATE,
                                                        } as IAction)
                                                    }}>
                                                        <EditIcon fontSize="small" color='warning'/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={<Typography>Xóa</Typography>} placement="top-start" arrow>
                                                    <IconButton size="small" onClick={async (event) => {
                                                        event.stopPropagation()
                                                        try {
                                                            await deleteChapter(chapterItem.id!)
                                                            toast.success("Xóa thành công")
                                                            setListChapter(listChapter.filter((item) => item.id !== chapterItem.id))
                                                        }catch (error: any) {
                                                            toast.error("Xóa thất bại")
                                                        }
                                                    }}>
                                                        <DeleteIcon fontSize="small" color='error'/>
                                                    </IconButton>
                                                </Tooltip>
                                                    
                                            </Box>
                                        </Box>
                                    }
                                    onClick={(event) => {
                                        setActQuanLy({
                                            open: true,
                                            payload: {
                                                type: "chapter",
                                                data: chapterItem
                                            },
                                            type: ACTIONS.UPDATE
                                        } as IAction)
                                    }}
                                >
                                    <TreeItem itemId={chapterItem.id+"_baihoc"} 
                                         label={
                                            <Box display={"flex"} justifyContent={"space-between"} alignItems={'center'}>
                                                <Typography fontSize={20}>
                                                    Danh sách bài học <Typography color={"blue"} component={'span'} fontSize={20}>
                                                        ({listLesson.filter((lesson) => lesson.chapterId === chapterItem.id).length})
                                                    </Typography>
                                                    
                                                </Typography>
                                                <Tooltip title={<Typography>Thêm bài học</Typography>} placement="top-start" arrow>
                                                    <IconButton size="small" onClick={(event) => {
                                                        event.stopPropagation()
                                                        setActThemBaiHoc({
                                                            open: !actThemBaiHoc.open,
                                                            payload: {
                                                                chapterId: chapterItem.id,
                                                                name: ""
                                                            },
                                                            type: ACTIONS.CREATE
                                                        } as IAction)
                                                    }}>
                                                        <AddIcon fontSize="small" color='success'/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        } 
                                    >
                                        {
                                            actThemBaiHoc.open && actThemBaiHoc.payload.chapterId === chapterItem.id && (
                                                <Box>
                                                    <TextField
                                                        size='small'
                                                        label="Tên bài học"
                                                        variant="outlined"
                                                        sx={{width: "90%"}}
                                                        onKeyDown={(event) => {
                                                            event.stopPropagation()
                                                        }}
                                                        onChange={(event) => {
                                                            setActThemBaiHoc({
                                                                open:true,
                                                                payload: {
                                                                    ...actThemBaiHoc.payload,
                                                                    name: event.target.value
                                                                }
                                                            } as IAction)
                                                        }}
                                                    />
                                                    <Tooltip title={<Typography>Lưu</Typography>} placement="top-start" arrow>
                                                        <IconButton onClick={async ()=>{
                                                            if(!actThemBaiHoc.payload.name) {
                                                                toast.error("Tên bài học không được để trống")
                                                                return
                                                            }
                                                            try {
                                                                const result = await insertLesson({
                                                                    id: generateLessonUID(),
                                                                    name: actThemBaiHoc.payload.name,
                                                                    chapterId: chapterItem.id
                                                                } as ILesson)
                                                                setListLesson([result.data.data, ...listLesson])
                                                                toast.success("Thêm thành công")
                                                            }catch (error: any) {
                                                                toast.error("Thêm thất bại")
                                                            }

                                                            setActThemBaiHoc({
                                                                open: false,
                                                                type: ACTIONS.CREATE
                                                            })
                                                        }}>
                                                            <SaveIcon />
                                                        </IconButton>

                                                    </Tooltip>
                                                </Box>
                                            )
                                        }
                                        {
                                            listLesson.filter((lesson) => lesson.chapterId === chapterItem.id).map((lessonItem) => {
                                                return <TreeItem key={lessonItem.id} itemId={lessonItem.id!} 
                                                    label={
                                                        <Box display={"flex"} justifyContent={"space-between"}>
                                                            {actSuaBaiHoc.open && actSuaBaiHoc.payload.id ===lessonItem.id ||  
                                                                <Typography fontSize={20}>{lessonItem.name}</Typography>
                                                            }
                                                            {actSuaBaiHoc.open && actSuaBaiHoc.payload.id ===lessonItem.id && (
                                                                <Box display={"flex"} width={"80%"}>
                                                                    <TextField
                                                                        onClick={(event) => {
                                                                            event.stopPropagation()
                                                                        }}
                                                                        onKeyDown={(event) => {
                                                                            event.stopPropagation()
                                                                        }}
                                                                        size='small'
                                                                        label="Tên bài học"
                                                                        variant="outlined"
                                                                        // sx={{width: "90%"}}
                                                                        value={actSuaBaiHoc.payload.name}
                                                                        fullWidth
                                                                        onChange={(event) => {
                                                                            setActSuaBaiHoc({
                                                                                open: true,
                                                                                payload: {
                                                                                    ...actSuaBaiHoc.payload,
                                                                                    name: event.target.value
                                                                                }
                                                                            } as IAction)
                                                                        }}
                                                                    />
                                                                    
                                                                    <Tooltip title={<Typography>Lưu</Typography>} placement="top-start" arrow>
                                                                        <IconButton onClick={async ()=>{
                                                                            if(!actSuaBaiHoc.payload) {
                                                                                toast.error("Tên bài học không được để trống")
                                                                                return
                                                                            }
                                                                            try {
                                                                                const result = await updateLesson(actSuaBaiHoc.payload.id, actSuaBaiHoc.payload)
                                                                                setListLesson(listLesson.map((item) => {
                                                                                    return item.id === actSuaBaiHoc.payload.id ? result.data.data : item
                                                                                }))
                                                                                toast.success("Đổi tên thành công")
                                                                            }catch (error: any) {
                                                                                toast.error("Đổi tên thất bại")
                                                                            }
                                                                            setActSuaBaiHoc({
                                                                                open: false,
                                                                                type: ACTIONS.CREATE
                                                                            })
                                                                        }}>
                                                                            <SaveIcon />
                                                                        </IconButton>
            
                                                                    </Tooltip>
                                                                </Box>
                                                            )}
                                                            <Box display={"flex"}>
                                                                <Tooltip title={<Typography>Đổi tên</Typography>} placement="top-start" arrow>
                                                                    <IconButton size="small" onClick={(event) => {
                                                                        event.stopPropagation()
                                                                        setActSuaBaiHoc({
                                                                            open: !actSuaBaiHoc.open,
                                                                            payload: lessonItem,
                                                                            type: ACTIONS.UPDATE,
                                                                        } as IAction)
                                                                    }}>
                                                                        <EditIcon fontSize="small" color='warning'/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={<Typography>Xóa</Typography>} placement="top-start" arrow>
                                                                    <IconButton size="small" onClick={async (event) => {
                                                                        event.stopPropagation()
                                                                        try {
                                                                            await deleteLesson(lessonItem.id!)
                                                                            setListLesson(listLesson.filter((item) => item.id !== lessonItem.id))
                                                                            toast.success("Xóa thành công")
                                                                        }catch (error: any) {
                                                                            toast.error("Xóa thất bại")
                                                                        }
                                                                    }}>
                                                                        <DeleteIcon fontSize="small" color='error'/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    }
                                                    onClick={(event) => {
                                                        setActQuanLy({
                                                            open: true,
                                                            payload: {
                                                                type: "lesson",
                                                                data: lessonItem
                                                            },
                                                            type: ACTIONS.UPDATE
                                                        } as IAction)
                                                    }}
                                                >
                                                    <TreeItem itemId={lessonItem.id+"_baiOnTap"} 
                                                        label={
                                                            <Box display={"flex"} justifyContent={"space-between"}>
                                                                <Typography fontSize={20}>
                                                                    Danh sách bài ôn tập <Typography color={"blue"} component={'span'} fontSize={20}>
                                                                        ({listExam.filter((exam) => exam.lessonId === lessonItem.id).length})
                                                                    </Typography>
                                                                </Typography>
                                                                <Tooltip title={<Typography>Thêm bài ôn tập</Typography>} placement="top-start" arrow>
                                                                    <IconButton size="small" onClick={(event) => {
                                                                        event.stopPropagation()
                                                                        setActThemBaiOnTap({
                                                                            open: !actThemBaiOnTap.open,
                                                                            payload: {
                                                                                lessonId: lessonItem.id,
                                                                                name: ""
                                                                            },
                                                                            type: ACTIONS.CREATE
                                                                        } as IAction)
                                                                    }}>
                                                                        <AddIcon fontSize="small" color='success'/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        } 
                                                    >
                                                        {
                                                            actThemBaiOnTap.open && actThemBaiOnTap.payload.lessonId === lessonItem.id && (
                                                                <Box>
                                                                    <TextField
                                                                        size='small'
                                                                        label="Tên bài ôn tập"
                                                                        variant="outlined"
                                                                        sx={{width: "90%"}}
                                                                        onKeyDown={(event) => {
                                                                            event.stopPropagation()
                                                                        }}
                                                                        onChange={(event) => {
                                                                            setActThemBaiOnTap({
                                                                                open:true,
                                                                                payload: {
                                                                                    ...actThemBaiOnTap.payload,
                                                                                    name: event.target.value
                                                                                }
                                                                            } as IAction)
                                                                        }}
                                                                    />
                                                                    <Tooltip title={<Typography>Lưu</Typography>} placement="top-start" arrow>
                                                                        <IconButton onClick={async ()=>{
                                                                            if(!actThemBaiOnTap.payload?.name) {
                                                                                toast.error("Tên bài kiểm ôn tập không được để trống")
                                                                                return
                                                                            }
                                                                            try {
                                                                                const result = await addExam({
                                                                                    id: generateExamId(),
                                                                                    name: actThemBaiOnTap.payload.name,
                                                                                    lessonId: lessonItem.id
                                                                                } as IExam)
                                                                                setListExam([result.data.data, ...listExam])
                                                                                toast.success("Thêm thành công")
                                                                            }catch (error: any) {
                                                                                toast.error("Thêm thất bại")
                                                                            }

                                                                            setActThemBaiOnTap({
                                                                                open: false,
                                                                                type: ACTIONS.CREATE
                                                                            })
                                                                        }}>
                                                                            <SaveIcon />
                                                                        </IconButton>

                                                                    </Tooltip>
                                                                </Box>
                                                            )
                                                        }
                                                        {
                                                            listExam.filter((exam) => exam.lessonId === lessonItem.id).map((examItem) => {
                                                                return <TreeItem key={examItem.id} itemId={examItem.id!} 
                                                                    label={
                                                                        <Box display={"flex"} justifyContent={"space-between"}>
                                                                            {actSuaBaiOnTap.open && actSuaBaiOnTap.payload.id ===examItem.id ||  
                                                                                <Typography fontSize={20}>{examItem.name}</Typography>
                                                                            }
                                                                            {actSuaBaiOnTap.open && actSuaBaiOnTap.payload.id ===examItem.id && (
                                                                                <Box display={"flex"} width={"80%"}>
                                                                                    <TextField
                                                                                        onClick={(event) => {
                                                                                            event.stopPropagation()
                                                                                        }}
                                                                                        onKeyDown={(event) => {
                                                                                            event.stopPropagation()
                                                                                        }}
                                                                                        size='small'
                                                                                        label="Tên bài ôn tập"
                                                                                        variant="outlined"
                                                                                        // sx={{width: "90%"}}
                                                                                        value={actSuaBaiOnTap.payload.name}
                                                                                        fullWidth
                                                                                        onChange={(event) => {
                                                                                            setActSuaBaiOnTap({
                                                                                                open: true,
                                                                                                payload: {
                                                                                                    ...actSuaBaiOnTap.payload,
                                                                                                    name: event.target.value
                                                                                                }
                                                                                            } as IAction)
                                                                                        }}
                                                                                    />
                                                                                    
                                                                                    <Tooltip title={<Typography>Lưu</Typography>} placement="top-start" arrow>
                                                                                        <IconButton onClick={async ()=>{
                                                                                            if(!actSuaBaiOnTap.payload.name) {
                                                                                                toast.error("Tên bài ôn tập không được để trống")
                                                                                                return
                                                                                            }
                                                                                            try {
                                                                                                const result = await updateExam(actSuaBaiOnTap.payload.id, actSuaBaiOnTap.payload)
                                                                                                console.log(result.data.data);
                                                                                                
                                                                                                setListExam(listExam.map((item) => {
                                                                                                    return item.id === result.data.data.id ? result.data.data : item
                                                                                                }))
                                                                                                toast.success("Đổi tên thành công!")
                                                                                            }catch (error: any) {
                                                                                                toast.error("Đổi tên thất bại!")
                                                                                            }
                                                                                            setActSuaBaiOnTap({
                                                                                                open: false,
                                                                                                type: ACTIONS.CREATE
                                                                                            })
                                                                                        }}>
                                                                                            <SaveIcon />
                                                                                        </IconButton>
                            
                                                                                    </Tooltip>
                                                                                </Box>
                                                                            )}
                                                                            <Box display={"flex"}>
                                                                                <Tooltip title={<Typography>Đổi tên</Typography>} placement="top-start" arrow>
                                                                                    <IconButton size="small" onClick={(event) => {
                                                                                        event.stopPropagation()
                                                                                        setActSuaBaiOnTap({
                                                                                            open: !actSuaBaiOnTap.open,
                                                                                            payload: examItem,
                                                                                            type: ACTIONS.UPDATE,
                                                                                        } as IAction)
                                                                                    }}>
                                                                                        <EditIcon fontSize="small" color='warning'/>
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                                <Tooltip title={<Typography>Xóa</Typography>} placement="top-start" arrow>
                                                                                    <IconButton size="small" onClick={async (event) => {
                                                                                        event.stopPropagation()
                                                                                        try {
                                                                                            await deleteExam(examItem.id!)
                                                                                            setListExam(listExam.filter((item) => item.id !== examItem.id))
                                                                                            toast.success("Xóa thành công")
                                                                                        }catch (error: any) {
                                                                                            toast.error("Xóa thất bại")
                                                                                        }
                                                                                    }}>
                                                                                        <DeleteIcon fontSize="small" color='error'/>
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </Box>
                                                                        </Box>
                                                                    } 
                                                                    onClick={(event) => {
                                                                        setActQuanLy({
                                                                            open: true,
                                                                            payload: {
                                                                                type: "exam",
                                                                                data: examItem
                                                                            },
                                                                            type: ACTIONS.UPDATE
                                                                        } as IAction)
                                                                    }}
                                                                />
                                                            })
                                                        }
                                                    </TreeItem>
                                                    <TreeItem itemId={lessonItem.id+"_baiGiang"} 
                                                        label={<Typography fontSize={20}>Danh sách bài giảng</Typography>}
                                                        onClick={() => {
                                                            setActQuanLy({
                                                                open: true,
                                                                payload: {
                                                                    type: "theory",
                                                                    data: lessonItem
                                                                },
                                                                type: ACTIONS.UPDATE
                                                            } as IAction)
                                                            
                                                        }}
                                                    />
                                                </TreeItem>
                                            })
                                        }

                                    </TreeItem>
                                    <TreeItem itemId={chapterItem.id+"_baikiemtra"} 
                                         label={
                                            <Box display={"flex"} justifyContent={"space-between"}>
                                                <Typography fontSize={20}>
                                                    Danh sách bài kiểm tra <Typography color={"blue"} component={'span'} fontSize={20}>
                                                        ({listExam.filter((exam) => exam.chapterId === chapterItem.id).length})
                                                    </Typography>
                                                </Typography>
                                                <Tooltip title={<Typography>Thêm bài kiểm tra</Typography>} placement="top-start" arrow>
                                                    <IconButton size="small" onClick={(event) => {
                                                        event.stopPropagation()
                                                        setActThemBaiKiemTra({
                                                            open: !actThemBaiKiemTra.open,
                                                            payload: {
                                                                chapterId: chapterItem.id,
                                                                name: ""
                                                            },
                                                            type: ACTIONS.CREATE
                                                        } as IAction)
                                                    }}>
                                                        <AddIcon fontSize="small" color='success'/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        } 
                                    >
                                        {
                                            actThemBaiKiemTra.open && actThemBaiKiemTra.payload.chapterId === chapterItem.id && (
                                                <Box>
                                                    <TextField
                                                        size='small'
                                                        label="Tên bài kiểm tra"
                                                        variant="outlined"
                                                        sx={{width: "90%"}}
                                                        onKeyDown={(event) => {
                                                            event.stopPropagation()
                                                        }}
                                                        onChange={(event) => {
                                                            setActThemBaiKiemTra({
                                                                open:true,
                                                                payload: {
                                                                    ...actThemBaiKiemTra.payload,
                                                                    name: event.target.value
                                                                }
                                                            } as IAction)
                                                        }}
                                                    />
                                                    <Tooltip title={<Typography>Lưu</Typography>} placement="top-start" arrow>
                                                        <IconButton onClick={async ()=>{
                                                            if(!actThemBaiKiemTra.payload?.name) {
                                                                toast.error("Tên bài kiểm tra không được để trống")
                                                                return
                                                            }
                                                            try {
                                                                const result = await addExam({
                                                                    id: generateExamId(),
                                                                    name: actThemBaiKiemTra.payload.name,
                                                                    chapterId: chapterItem.id
                                                                } as IExam)
                                                                setListExam([result.data.data, ...listExam])
                                                                toast.success("Thêm thành công")
                                                            }catch (error: any) {
                                                                toast.error("Thêm thất bại")
                                                            }

                                                            setActThemBaiKiemTra({
                                                                open: false,
                                                                type: ACTIONS.CREATE
                                                            })
                                                        }}>
                                                            <SaveIcon />
                                                        </IconButton>

                                                    </Tooltip>
                                                </Box>
                                            )
                                        }
                                        {
                                            listExam.filter((exam) => exam.chapterId === chapterItem.id).map((examItem) => {
                                                return <TreeItem key={examItem.id} itemId={examItem.id!} 
                                                    label={
                                                        <Box display={"flex"} justifyContent={"space-between"}>
                                                            {actSuaBaiKiemTra.open && actSuaBaiKiemTra.payload.id ===examItem.id ||  
                                                                <Typography fontSize={20}>{examItem.name}</Typography>
                                                            }
                                                            {actSuaBaiKiemTra.open && actSuaBaiKiemTra.payload.id ===examItem.id && (
                                                                <Box display={"flex"} width={"80%"}>
                                                                    <TextField
                                                                        onClick={(event) => {
                                                                            event.stopPropagation()
                                                                        }}
                                                                        onKeyDown={(event) => {
                                                                            event.stopPropagation()
                                                                        }}
                                                                        size='small'
                                                                        label="Tên bài kiểm tra"
                                                                        variant="outlined"
                                                                        // sx={{width: "90%"}}
                                                                        value={actSuaBaiKiemTra.payload.name}
                                                                        fullWidth
                                                                        onChange={(event) => {
                                                                            setActSuaBaiKiemTra({
                                                                                open: true,
                                                                                payload: {
                                                                                    ...actSuaBaiKiemTra.payload,
                                                                                    name: event.target.value
                                                                                }
                                                                            } as IAction)
                                                                        }}
                                                                    />
                                                                    
                                                                    <Tooltip title={<Typography>Lưu</Typography>} placement="top-start" arrow>
                                                                        <IconButton onClick={async ()=>{
                                                                            if(!actSuaBaiKiemTra.payload.name) {
                                                                                toast.error("Tên bài học không được để trống")
                                                                                return
                                                                            }
                                                                            try {
                                                                                const result = await updateExam(actSuaBaiKiemTra.payload.id, actSuaBaiKiemTra.payload)
                                                                                setListExam(listExam.map((item) => {
                                                                                    return item.id === actSuaBaiKiemTra.payload.id ? result.data.data : item
                                                                                }))
                                                                                toast.success("Đổi tên thành công")
                                                                            }catch (error: any) {
                                                                                toast.error("Đổi tên thất bại")
                                                                            }
                                                                            setActSuaBaiKiemTra({
                                                                                open: false,
                                                                                type: ACTIONS.CREATE
                                                                            })
                                                                        }}>
                                                                            <SaveIcon />
                                                                        </IconButton>
            
                                                                    </Tooltip>
                                                                </Box>
                                                            )}
                                                            <Box display={"flex"}>
                                                                <Tooltip title={<Typography>Đổi tên</Typography>} placement="top-start" arrow>
                                                                    <IconButton size="small" onClick={(event) => {
                                                                        event.stopPropagation()
                                                                        setActSuaBaiKiemTra({
                                                                            open: !actSuaBaiKiemTra.open,
                                                                            payload: examItem,
                                                                            type: ACTIONS.UPDATE,
                                                                        } as IAction)
                                                                    }}>
                                                                        <EditIcon fontSize="small" color='warning'/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={<Typography>Xóa</Typography>} placement="top-start" arrow>
                                                                    <IconButton size="small" onClick={async (event) => {
                                                                        event.stopPropagation()
                                                                        try {
                                                                            await deleteExam(examItem.id!)
                                                                            setListExam(listExam.filter((item) => item.id !== examItem.id))
                                                                            toast.success("Xóa thành công")
                                                                        }catch (error: any) {
                                                                            toast.error("Xóa thất bại")
                                                                        }
                                                                    }}>
                                                                        <DeleteIcon fontSize="small" color='error'/>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </Box>
                                                    } 
                                                    onClick={(event) => {
                                                        setActQuanLy({
                                                            open: true,
                                                            payload: {
                                                                type: "exam",
                                                                data: examItem
                                                            },
                                                            type: ACTIONS.UPDATE
                                                        } as IAction)
                                                    }}
                                                />
                                            })
                                        }
                                    </TreeItem>
                                </TreeItem>
                            })
                        }
                    </SimpleTreeView>
                </Grid>
                <Grid item xs={12} md={8}>
                    {
                        actQuanLy.open && actQuanLy.payload?.type === 'exam' &&(
                            <Box>
                                <Typography fontSize={25} fontWeight={"bold"} color={"#4ADE80"}>Quản lý câu hỏi của bài tập: {actQuanLy.payload?.data?.name}</Typography>
                                <SimpleTable 
                                    initData={listQuestion ? listQuestion : [] as IQuestion[]}
                                    toolbarComponent={<Box display={"flex"} gap={1}>
                                        <ExcelReaderBtn variant='outlined' sheetIndex={0} name='Thêm từ excel' onUpload={async (data)=>{
                                            try {
                                                const payload = data.map((item) => ({
                                                    id: generateChapterUID(),
                                                    questionType: item.questionType ?? "",
                                                    title: item.title ?? "",
                                                    content: item.content ?? "",
                                                    contentImg: item.contentImg ?? "",
                                                    A: item.A ?? "",
                                                    B: item.B ?? "",
                                                    C: item.C ?? "",
                                                    D: item.D ?? "",
                                                    E: item.E ?? "",
                                                    correctAnswer: item.correctAnswer,
                                                    explainAnswer: item.explainAnswer,
                                                    lessonId: actQuanLy.payload?.data?.lessonId ? actQuanLy.payload?.data?.lessonId : '',
                                                    chapterId: actQuanLy.payload?.data?.lessonId ? actQuanLy.payload?.data.lessonId : '',
                                                    status: true,
                                                } as IQuestion))
                                                const response = await importQuestions(payload)
                                                const payloadExamQuestion = response.data.data.map((item : IQuestion) => {
                                                    return {
                                                        examId: actQuanLy.payload.data.id,
                                                        questionId: item.id
                                                    } as IExamQuestion
                                                })
                                                await importExamQuestions(payloadExamQuestion)
                                                toast.success("Nhập dữ liệu thành công")
                                                console.log([...response.data.data, ...listQuestion ?? []]);
                                                
                                                setListQuestion(pre => [...response.data.data, ...pre ?? []])
                                            }catch (error: any) {
                                                toast.error("Nhập dữ liệu thất bại: " + error.message)
                                            }
                                        }} />
                                        <Button variant='outlined'
                                            onClick={() => {
                                                setModalQuestionBank(true)
                                            }}
                                        >
                                            Thêm từ ngân hàng câu hỏi
                                        </Button>
                                        <ExcelExportBtn 
                                            data={listQuestion ? listQuestion : [] as IQuestion[]}
                                            headers={['questionType', 'title', 'content', 'contentImg', 'A', 'B', 'C', 'D', 'E', 'correctAnswer', 'explainAnswer']}
                                            variant='outlined'
                                            fileName="questions" 
                                        />
                                    </Box>}
                                    initNewRow={{
                                        id: generateQuestionUID(),
                                        questionType: 1,
                                        title: "Câu 0",
                                        content: "Nội dung",
                                        contentImg: "",
                                        A: "",
                                        B: "",
                                        C: "",
                                        D: "",
                                        E: "",
                                        correctAnswer: "",
                                        explainAnswer: "",
                                        lessonId: actQuanLy.payload.data.lessonId,
                                        chapterId: actQuanLy.payload.data.chapterId,
                                        status: true,
                                    }as IQuestion}
                                    columns={[
                                        // { field: 'id', headerName: 'ID', width: 70 },
                                        { field: 'questionType', headerName: 'Loại câu hỏi', width: 180, 
                                            editable: true,
                                            valueFormatter: (value: number) => {
                                                const temp = typeQuestions?.find((item) => item.id === value)
                                                return temp?.name
                                            },
                                            renderEditCell(params) {
                                                return <RenderEditCell params={params} dataParams={typeQuestions} label='name' editCellField='questionType'/>
                                            },
                                        },
                                        // { field: 'questionType', headerName: 'Loại câu hỏi', width: 130, editable: true, type: "number" },
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
                                    ] as GridColDef[]}
                                    onRowClick={(row) => {
                                        setDataSelected(row.row)
                                    }}
                                    onUpdateRow={(data, action) => handleUpdateRowExamQuestion  (data, action)}
                                />
                            </Box>
                        )
                    }
                    {
                        actQuanLy.open && (
                            actQuanLy.payload?.type === 'chapter' || 
                            actQuanLy.payload?.type === 'lesson'
                        ) && (
                            <Box>
                                <Typography fontSize={25} fontWeight={"bold"} color={"#4ADE80"}>Quản lý ngân hàng câu hỏi: {actQuanLy.payload?.data?.name}</Typography>
                                <SimpleTable 
                                    initData={listQuestion ? listQuestion : [] as IQuestion[]}
                                    toolbarComponent={<Box display={"flex"} gap={1}>
                                        <ExcelReaderBtn variant='outlined' sheetIndex={0} name='Thêm từ excel' onUpload={async (data)=>{
                                            try {
                                                const payload = data.map((item) => ({
                                                    id: generateChapterUID(),
                                                    questionType: item.questionType ?? "",
                                                    title: item.title ?? "",
                                                    content: item.content ?? "",
                                                    contentImg: item.contentImg ?? "",
                                                    A: item.A ?? "",
                                                    B: item.B ?? "",
                                                    C: item.C ?? "",
                                                    D: item.D ?? "",
                                                    E: item.E ?? "",
                                                    correctAnswer: item.correctAnswer,
                                                    explainAnswer: item.explainAnswer,
                                                    lessonId: actQuanLy.payload?.type === 'lesson' ? actQuanLy.payload.data.id : '',
                                                    chapterId: actQuanLy.payload?.type === 'chapter' ? actQuanLy.payload.data.id : '',
                                                    status: true,
                                                } as IQuestion))
                                                const response = await importQuestions(payload)
                                                toast.success("Nhập dữ liệu thành công")
                                                console.log([...response.data.data, ...listQuestion ?? []]);
                                                
                                                setListQuestion(pre => [...response.data.data, ...pre ?? []])
                                            }catch (error: any) {
                                                toast.error("Nhập dữ liệu thất bại: " + error.message)
                                            }
                                        }} />
                                        <ExcelExportBtn 
                                            data={listQuestion ? listQuestion : [] as IQuestion[]}
                                            headers={['questionType', 'title', 'content', 'contentImg', 'A', 'B', 'C', 'D', 'E', 'correctAnswer', 'explainAnswer']}
                                            variant='outlined'
                                            fileName="questions" 
                                        />
                                    </Box>}
                                    initNewRow={{
                                        id: generateQuestionUID(),
                                        questionType: 1,
                                        title: "Câu 0",
                                        content: "Nội dung",
                                        contentImg: "",
                                        A: "",
                                        B: "",
                                        C: "",
                                        D: "",
                                        E: "",
                                        correctAnswer: "",
                                        explainAnswer: "",
                                        lessonId: actQuanLy.payload?.type === 'lesson' ? actQuanLy.payload.data.id : '',
                                        chapterId: actQuanLy.payload?.type === 'chapter' ? actQuanLy.payload.data.id : '',
                                        status: true,
                                    }as IQuestion}
                                    columns={[
                                        // { field: 'id', headerName: 'ID', width: 70 },
                                        { field: 'questionType', headerName: 'Loại câu hỏi', width: 180, 
                                            editable: true,
                                            valueFormatter: (value: number) => {
                                                const temp = typeQuestions?.find((item) => item.id === value)
                                                return temp?.name
                                            },
                                            renderEditCell(params) {
                                                return <RenderEditCell params={params} dataParams={typeQuestions} label='name' editCellField='questionType'/>
                                            },
                                        },
                                        // { field: 'questionType', headerName: 'Loại câu hỏi', width: 130, editable: true, type: "number" },
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
                                    ] as GridColDef[]}
                                    onRowClick={(row) => {
                                        setDataSelected(row.row)
                                    }}
                                    onUpdateRow={(data, action) => handleUpdateRowQuestionBank (data, action)}
                                />
                            </Box>
                        )
                    }
                    {
                        actQuanLy.open && (
                            actQuanLy.payload?.type === 'theory'
                        ) && (
                            <Box>
                                <Typography fontSize={25} fontWeight={"bold"} color={"#4ADE80"}>Quản lý danh sách bài giảng: {actQuanLy.payload?.data?.name}</Typography>
                                <SimpleTable 
                                    initData={listTheory ? listTheory : [] as IQuestion[]}
                                    toolbarComponent={
                                        <Box display={"flex"} gap={1}>
                                            <ExcelReaderBtn variant='outlined' sheetIndex={0} name='Thêm từ excel' onUpload={async (data)=>{
                                                try {
                                                    const payload = data.map((item) => ({
                                                        id: generateChapterUID(),
                                                        lessonId: actQuanLy.payload.data.id,
                                                        name: item.name ?? "",
                                                        url: item.url ?? "",
                                                        type: item.type ?? "",
                                                        status: true,
                                                    } as ITheory))
                                                    const response = await importTheories(payload)
                                                    toast.success("Nhập dữ liệu thành công")
                                                    console.log([...response.data.data, ...listTheory ?? []]);
                                                    
                                                    setListTheory(pre => [...response.data.data, ...pre ?? []])
                                                }catch (error: any) {
                                                    toast.error("Nhập dữ liệu thất bại: " + error.message)
                                                }
                                            }} />
                                            <ExcelExportBtn 
                                                data={listTheory ? listTheory : [] as ITheory[]}
                                                headers={[ 'name', 'url', 'type']}
                                                variant='outlined'
                                                fileName="theory" 
                                            />
                                        </Box>
                                    }
                                    initNewRow={{
                                        id: generateTheoryUID(),
                                        lessonId: actQuanLy.payload.data.id,
                                        name: "Tên bài lý thuyết",
                                        description: "Mô tả",
                                        summary: "Tóm tắt",
                                        url: "Link",
                                        type: "MP4",
                                        order: 0,
                                        status: true,
                                    } as ITheory}
                                    columns={[
                                        {
                                            field: "name",
                                            headerName: "Tên",
                                            width: 130,
                                            editable: true,
                                        },
                                        {
                                            field: "url",
                                            headerName: "URL",
                                            width: 130,
                                            editable: true,
                                        },
                                        {
                                            field: "type",
                                            headerName: "Kiểu",
                                            width: 130,
                                            editable: true,
                                        },
                                    ] as GridColDef[]}
                                    onRowClick={(row) => {
                                        setDataSelected(row.row)
                                    }}
                                    onUpdateRow={(data, action) => handleUpdateRowTheory(data, action)}
                                />
                            </Box>
                        )
                    }
                </Grid>
            </Grid>

            <CustomModal
                open={modalQuestionBank}
                setOpenModal={setModalQuestionBank}
                title='Danh sách các câu hỏi'
            >
                <Box>
                    Danh sách câu hỏi
                </Box>
            </CustomModal>
        </Box>
    );
};



export default AdminManager;