import React, { useState, useEffect } from "react";
import ChartJS from 'chart.js/auto';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MenuIcon from '@mui/icons-material/Menu';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import { DataListChapter, IChapter, ListChapterParams } from "api/chapter/chapter.interface";
import { getListChapterNoPaging } from "api/chapter/chapter.api";
import { useLocation } from "react-router-dom";
import { findProgressByChapter, findProgressByLesson } from "api/progress/progress.api";
import { getFromLocalStorage } from "utils/functions";
import QCDateFilter, { IDateFilter } from "QCComponents/QCDateFilter/QCDateFilter";
import { toast } from 'react-toastify';
import { IGetResultByUserIdFilterParams } from "api/result/result.interface";
import Select from 'react-select';
import { getListAllDoneResultByUserIdandChapterId, getListAllDoneResultByUserIdandExamId, getListUniqueDoneResultByChapterId } from "api/result/result.api";
import { getExamsByChapterId, getExercisesByChapterId } from "api/exam/exam.api";
import { calculateScore } from "helpers/Nam-helper/Caculate";
import ProgressBar from '@ramonak/react-progress-bar'
import { IExam } from "api/exam/exam.interface";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, fetchUser } from "../../redux/auth/authSlice";
import { AppDispatch } from "redux/store";
import { getListLessonByChapterId } from "api/lesson/lesson.api";
import { getTheoriesByLessonId } from "api/theory/theory.api";
import { create } from "lodash";

interface ExamData {
    name: string;
    score: number;
    date: string;
}

interface MockData {
    chapter: { value: string; label: string; count: number, theories: any[] }[];
    exercise: { value: string; label: string; count: number, exercises: any[] }[];
    exam: { value: string; label: string; count: number, exams: any[] }[];
}

const Chart: React.FC = () => {
    const location = useLocation();
    const [selectedDay, setSelectedDay] = useState<string>("all");
    // const [selectedChapter, setSelectedChapter] = useState<string>("");
    const [selectedChapter, setSelectedChapter] = useState<{ value: string; label: string } | null>(null);

    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const [currentUser, setCurrentUser] = useState(getFromLocalStorage<any>('persist:auth'));
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<"theory" | "exercise" | "exam" | "general">("theory");
    const [chapters, setChapters] = useState<any[]>([]);
    const [listExercises, setListExercises] = useState<any[]>([]);
    const [listExams, setListExams] = useState<any[]>([]);
    const [exerciseResults, setExerciseResults] = useState<any[] | null>(null);
    const [examResults, setExamResults] = useState<any[] | null>(null);
    const [chaptersForSelect, setChaptersForSelect] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mockData, setMockData] = useState<MockData>({ chapter: [], exercise: [], exam: [] });
    // update bieu do
    const [listAllTheory, setListAllTheory] = useState<any[]>([]);
    const [numberTheoryDone, setNumberTheoryDone] = useState<number>(0);
    const [numberExcersiceDone, setNumberExcersiceDone] = useState<number>(0);
    const [numberExamDone, setNumberExamDone] = useState<number>(0);
    const [listLessons, setListLessons] = useState<any[] | null>(null);
    const [exams2, setExams2] = useState<IExam[]>([]);
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
    const [chaptersData, setChaptersData] = useState<DataListChapter | undefined>(
        undefined
    )
    const [selectedExam, setSelectedExam] = useState<any | null>(null);
    const [resultExam, setResultExam] = useState<any[] | null>(null);
    const [resultExercises, setResultExercises] = useState<any[] | null>(null);
    const dispatch = useDispatch<AppDispatch>()
    const userRedux = useSelector(selectUser)
    useEffect(() => {
        if (userRedux?.id) {
            dispatch(fetchUser())
        }
    }, []);
    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);
    useEffect(() => {
        const fetchChapterProgress = async () => {
            if (selectedChapterId) {
                const progress = await findProgressByChapter(selectedChapterId)
                setNumberTheoryDone(progress?.data.data.length ?? 0)
            }
        };
        fetchChapterProgress()
    }, [selectedChapterId])
    
    const fetchChaptersAll = async (params?: ListChapterParams) => {
        try {
            const res = await getListChapterNoPaging({ params });
            setChaptersData(res.data);
            if (res.data.data.length > 0) {
                if (res.data.data[0].id) {
                    setSelectedChapterId(res.data.data[0].id);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (userRedux?.grade && selectedSubject) {
            fetchChaptersAll({ subjectId: selectedSubject, grade: userRedux?.grade });
        }
    }, [selectedSubject, userRedux?.grade]);
    const fetchExam2ByChapterId = async (chapterId: string) => {
        try {
            const response = await getExamsByChapterId(chapterId);
            setExams2(response.data.exams);
            return response.data;
        } catch (error) {
            console.error('Error fetching exams:', error);
        }
    };
    useEffect(() => {
        if (selectedChapterId) {
            fetchExam2ByChapterId(selectedChapterId);
        }
    }, [selectedChapterId]);
    useEffect(() => {
        const fetchResultProgress = async () => {
            if (userRedux?.grade && selectedSubject) {
                // danh sách kết quả bài kiểm tra của bài kiểm tra đó
                if (selectedChapterId && selectedExam && listExams.length > 0 && activeTab === 'exam') {
                    const progress = await getListAllDoneResultByUserIdandExamId(selectedExam?.value)
                    // setProgress(progress.data.data)
                    setResultExam(progress.data.data.exams)
                }
                // danh sách kết quả bài tập của chương
                if(selectedChapterId && activeTab === 'exercise') {
                    const progress2 = await getListAllDoneResultByUserIdandChapterId(selectedChapterId)
                    setResultExercises(progress2.data.data.exercises)
                }
                // số bài đã làm
            }
        }
        fetchResultProgress()
    }, [selectedChapterId, selectedExam, activeTab])
    useEffect(() => {
        const fetchProgressBar = async () => {
            if(selectedChapterId) {
                const progress3 = await getListUniqueDoneResultByChapterId(selectedChapterId)
                setNumberExamDone(progress3?.data.data.exams.length ?? 0)
                setNumberExcersiceDone(progress3?.data.data.exercises.length ?? 0)
            }
        }
        fetchProgressBar()
    }
    , [selectedChapterId])

    const fetchTheoryProgress = async () => {
        try {
            const progressLessonsPromises = listLessons?.map(async (lesson) => {
                const progressLessons = await findProgressByLesson(lesson.id);
                return {
                    lessonId: lesson.id,
                    count: progressLessons.data.data.length,
                    theories: progressLessons.data.data,
                };
            })
            const progressCounts = await Promise.all(progressLessonsPromises || []);
            // const progressCounts = await Promise.all(progressPromises);

            const chapterDataMap: { [key: string]: { count: number; theories: any[] } } = {};
            (progressCounts as { lessonId: string; count: number; theories: any[] }[]).forEach(({ lessonId, count, theories }) => {
                chapterDataMap[lessonId] = { count, theories };
            });

            return chapterDataMap;
        } catch (error) {
            console.error(error);
            return {};
        }
    };
    const fetchExamResultProgress = async () => {
        if (currentUser?.currentUser?.id && selectedSubject) {
            if (selectedChapter) {
                const progress = await getListAllDoneResultByUserIdandChapterId(selectedChapter.value);
                setExerciseResults(progress.data.data.exercises);
                setExamResults(progress.data.data.exams);
            }
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            const progressDataMap = await fetchTheoryProgress();
            const updatedChapters = listLessons?.map((lesson) => ({
                ...lesson,
                count: progressDataMap[lesson.id]?.count || 0,
                theories: progressDataMap[lesson.id]?.theories || [],
            }));
    
            if (updatedChapters) {
                setChapters(updatedChapters);
            }
        };
        fetchData();
    }, [listLessons]);
    const fetchChapters = async (params?: ListChapterParams) => {
        setIsLoading(true);
        try {
            const res = await getListChapterNoPaging({ params });
            const chaptersData = res.data.data.map((chapter: any) => ({
                value: chapter.id,
                label: chapter.name,
                count: 0,
                theories: [],
            }));
            setChaptersForSelect(chaptersData);
            setSelectedChapter(chaptersData[0]);
            setSelectedChapterId(chaptersData[0].value);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            if (selectedChapter) {
                const responseExcercises = await getExercisesByChapterId(selectedChapter?.value);
                setListExercises(responseExcercises.data.data);
                const responseExams = await getExamsByChapterId(selectedChapter?.value);
                setListExams(responseExams.data.exams);
                setSelectedExam(
                    responseExams.data.exams.length > 0
                        ? { value: responseExams.data.exams[0].id, label: responseExams.data.exams[0].name }
                        : null
                );
                const responseLesson = await getListLessonByChapterId(selectedChapter?.value);
                setListLessons(responseLesson.data.data);
                if (responseLesson.data.data.length > 0) {
                    const promises = responseLesson.data.data.map(item => {
                        if (item.id) {
                            return getTheoriesByLessonId(item.id);
                        }
                        return Promise.resolve(null);
                    });
                    const results = await Promise.all(promises);
                    setListAllTheory(results.map(result => result?.data.theories));
                }
                await fetchExamResultProgress();
            }
        };
        fetchData();
    }, [selectedChapter]);


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get("page") || "1", 10);
        const currentGrade = parseInt(queryParams.get("grade") || currentUser?.currentUser?.grade, 10);
        const currentSubject = queryParams.get("subject") || "subject1";
        setSelectedSubject(currentSubject);

        if (currentSubject && currentGrade && currentPage) {
            fetchChapters({ subjectId: currentSubject, grade: currentGrade });
        }
    }, [location.search, activeTab]);

    useEffect(() => {
        const fetchData = async () => {
            if (chapters.length > 0) {
                setMockData({ chapter: chapters, exercise: [], exam: [] });
            }
            if (exerciseResults === null && examResults === null) {
                await fetchExamResultProgress();
            }
        };
        fetchData();
    }, [chapters, activeTab]);

    const handleChapterChange = async (selectedChapter: any) => {
        setSelectedChapter(selectedChapter);
        setSelectedChapterId(selectedChapter.value);
    };
    const handleExamChange = async (selectedExam: any) => {
        setSelectedExam(selectedExam);
    }
    const handleFilter = async (filter: IDateFilter) => {
        try {
            if (!filter.from && !filter.to) {
                return;
            }
            const fromDate = filter.from ? new Date(filter.from) : new Date();
            const toDate = filter.to ? new Date(filter.to) : new Date();
            if (toDate < fromDate) {
                toast.error("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.");
                return;
            }

            if (userRedux?.grade && selectedSubject) {
                if (selectedChapterId && selectedExam && listExams.length > 0 && activeTab === 'exam') {
                    const progress = await getListAllDoneResultByUserIdandExamId(selectedExam?.value, {
                        from: filter.from,
                        to: filter.to
                    })
                    setResultExam(progress.data.data.exams)
                }
                if (selectedChapterId && activeTab === 'exercise') {
                    const progress2 = await getListAllDoneResultByUserIdandChapterId(selectedChapterId, {
                        from: filter.from,
                        to: filter.to
                    }
                    )
                    setResultExercises(progress2.data.data.exercises)
                }
            }
        } catch (err) {
            toast.error("Đã xảy ra lỗi khi lọc dữ liệu.");
        }
    };
    useEffect(() => {
        if (activeTab !== "theory") return;
    
        const ctx = document.getElementById("theoryChart") as HTMLCanvasElement;
        if (ctx) {
            const totalTheoriesPerLesson = listAllTheory.map(theories => theories ? theories.length : 0);
            const progressCounts = mockData.chapter.map(item => item.count);
            const remainingLessons = totalTheoriesPerLesson.map((total, index) => {
                const completed = progressCounts[index] || 0;
                return total - completed;
            });
    
            // Chuẩn bị dữ liệu cho biểu đồ
            const labels = listLessons?.map(item => item.name);
    
            const chart = new ChartJS(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Các bài đã học",
                            data: progressCounts,
                            backgroundColor: "rgba(54, 162, 235, 0.7)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                        },
                        {
                            label: "Các bài chưa học",
                            data: remainingLessons,
                            backgroundColor: "rgba(192, 192, 192, 0.5)",
                            borderColor: "rgba(192, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            beginAtZero: true,
                            stacked: true,
                            ticks: {
                                stepSize: 1,
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                    return null;
                                },
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                title: function (context) {
                                    return context[0].label;
                                },
                                label: function (context) {
                                    const datasetLabel = context.dataset.label || '';
                                    const value = context.parsed.y;
                                    return `${datasetLabel}: ${value}`;
                                },
                                afterBody: function (context) {
                                    const index = context[0].dataIndex;
                        
                                    const allTheories = listAllTheory[index] || [];
                                    const learnedLessons = mockData.chapter[index]?.theories || [];
                        
                                    const learnedTheoryIds = new Set(learnedLessons.map(theory => theory.id));
                        
                                    const learnedTheories = allTheories.filter((theory: { id: any; }) => learnedTheoryIds.has(theory.id));
                                    const unlearnedTheories = allTheories.filter((theory: { id: any; }) => !learnedTheoryIds.has(theory.id));
                        
                                    const lines = [];
                        
                                    if (learnedTheories.length > 0) {
                                        lines.push('Đã học:');
                                        learnedTheories.forEach((theory: { name: any; }) => {
                                            lines.push(`• ${theory.name}`);
                                        });
                                    }
                        
                                    if (unlearnedTheories.length > 0) {
                                        lines.push('Chưa học:');
                                        unlearnedTheories.forEach((theory: { name: any; }) => {
                                            lines.push(`• ${theory.name}`);
                                        });
                                    }
                        
                                    return lines;
                                },
                            },
                        },
                    
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                },
            });
            return () => chart.destroy();
        }
    }, [activeTab, mockData]);
    useEffect(() => {
        if (activeTab !== "exercise") return;
        if (!listExercises.length) return;
    
        const ctx = document.getElementById("exerciseChart") as HTMLCanvasElement;
        if (ctx) {
            const groupedData = listExercises.map(exercise => {
                const results = resultExercises?.filter(result => result.examId === exercise.id);
                return {
                    name: exercise.name,
                    scores: results?.map(result => ({
                        yourScore: result.yourScore,
                        totalScore: result.totalScore,
                        score: calculateScore(result.totalScore, result.yourScore),
                        createdAt: result.createdAt,
                    })),
                };
            }).filter(group => group.scores && group.scores.length > 0);
    
            const labels = groupedData.map(group => group.name);
    
            const maxScoresPerExercise = Math.max(...groupedData.map(group => (group.scores ?? []).length));
            const datasets = Array.from({ length: maxScoresPerExercise }).map((_, index) => ({
                label: `Lần kiểm tra ${index + 1}`,
                data: groupedData.map(group => group.scores?.[index]?.score || null),
                backgroundColor: `rgba(${54 + index * 30}, 162, 235, 0.2)`,
                borderColor: `rgba(${54 + index * 30}, 162, 235, 1)`,
                borderWidth: 2,
            }));
    
            const chart = new ChartJS(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'category',
                            title: {
                                display: true,
                                text: 'Tên bài tập',
                            },
                            ticks: {
                                autoSkip: false,
                                maxRotation: 45,
                                minRotation: 45,
                                padding: 45,
                            },
                        },
                        y: {
                            beginAtZero: true,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Điểm',
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            callbacks: {
                                title: function (context) {
                                    return context[0].label;
                                },
                                label: function (context) {
                                    const datasetIndex = context.datasetIndex;
                                    const dataIndex = context.dataIndex;
                                    const group = groupedData[dataIndex];
                                    const score = group.scores?.[datasetIndex] || null;
                                    if (score) {
                                        return `${score.yourScore}/${score.totalScore} (${score.score} điểm) - Ngày: ${new Date(score.createdAt).toLocaleDateString()}`;
                                    }
                                    return 'Không có dữ liệu';
                                },
                            },
                        },
                    },
                },
                plugins: [
                    {
                        id: "addLabels",
                        afterDatasetsDraw(chart) {
                            const ctx = chart.ctx;
                            chart.data.datasets.forEach((dataset, datasetIndex) => {
                                const meta = chart.getDatasetMeta(datasetIndex);
                                meta.data.forEach((bar, index) => {
                                    const score = groupedData[index]?.scores?.[datasetIndex];
                                    if (score) {
                                        const x = bar.x;
                                        const y = chart.scales.y.bottom + 20;
                                        ctx.save();
                                        ctx.fillStyle = "black";
                                        ctx.font = "12px Arial";
                                        ctx.textAlign = "center";
                                        ctx.textBaseline = "middle";
                                        const dateLabel = `${new Date(score.createdAt).toLocaleDateString()}`;
                                        ctx.fillText(dateLabel, x, y);
                                        const testLabel = `Lần ${datasetIndex + 1}`;
                                        ctx.fillText(testLabel, x, y + 15);
                                        ctx.restore();
                                    }
                                });
                            });
                        },
                    },
                ],
            });
    
            return () => chart.destroy();
        }
    }, [activeTab, resultExercises]);
    
    // useEffect(() => {
    //     if (activeTab !== "exercise") return;
    //     if (!listExercises.length) return;
    
    //     const ctx = document.getElementById("exerciseChart") as HTMLCanvasElement;
    //     if (ctx) {
    //         // Chuẩn bị dữ liệu
    //         const groupedData = listExercises.map(exercise => {
    //             const results = resultExercises?.filter(result => result.examId === exercise.id);
    //             return {
    //                 name: exercise.name,
    //                 scores: results?.map(result => ({
    //                     yourScore: result.yourScore,
    //                     totalScore: result.totalScore,
    //                     score: calculateScore(result.totalScore, result.yourScore),
    //                     createdAt: result.createdAt,
    //                 })),
    //             };
    //         }).filter(group => group.scores && group.scores.length > 0);
    
    //         console.log('Grouped Data:', groupedData);
    
    //         // Tạo labels (tên bài tập)
    //         const labels = groupedData.map(group => group.name);
    
    //         // Tạo dataset cho mỗi lần kiểm tra
    //         const maxScoresPerExercise = Math.max(...groupedData.map(group => (group.scores ?? []).length)); // Tìm số lần kiểm tra nhiều nhất
    //         const datasets = Array.from({ length: maxScoresPerExercise }).map((_, index) => ({
    //             label: `Lần kiểm tra ${index + 1}`,
    //             data: groupedData.map(group => group.scores?.[index]?.score || null), // Điểm cho mỗi bài tập ở lần kiểm tra này
    //             backgroundColor: `rgba(${54 + index * 30}, 162, 235, 0.2)`, // Màu nền thay đổi theo lần kiểm tra
    //             borderColor: `rgba(${54 + index * 30}, 162, 235, 1)`, // Màu viền thay đổi theo lần kiểm tra
    //             borderWidth: 2,
    //         }));
    
    //         console.log('Datasets:', datasets);
    
    //         // Vẽ biểu đồ
    //         const chart = new ChartJS(ctx, {
    //             type: "bar",
    //             data: {
    //                 labels: labels, // Nhãn là tên bài tập
    //                 datasets: datasets, // Các cột trong mỗi nhóm
    //             },
    //             options: {
    //                 responsive: true,
    //                 maintainAspectRatio: false,
    //                 scales: {
    //                     x: {
    //                         type: 'category', // Trục X dạng danh mục
    //                         title: {
    //                             display: true,
    //                             text: 'Tên bài tập',
    //                         },
    //                         ticks: {
    //                             autoSkip: false,
    //                             maxRotation: 45,
    //                             minRotation: 45,
    //                         },
    //                     },
    //                     y: {
    //                         beginAtZero: true, // Bắt đầu từ 0
    //                         max: 10, // Điểm tối đa là 10
    //                         title: {
    //                             display: true,
    //                             text: 'Điểm',
    //                         },
    //                     },
    //                 },
    //                 plugins: {
    //                     legend: {
    //                         position: "top",
    //                         display: false // Vị trí của chú thích
    //                     },
    //                     tooltip: {
    //                         callbacks: {
    //                             title: function (context) {
    //                                 return context[0].label; // Hiển thị tên bài tập
    //                             },
    //                             label: function (context) {
    //                                 const datasetIndex = context.datasetIndex;
    //                                 const dataIndex = context.dataIndex;
    //                                 const group = groupedData[dataIndex];
    //                                 const score = group.scores?.[datasetIndex] || null;
    //                                 if (score) {
    //                                     return `${score.yourScore}/${score.totalScore} (${score.score} điểm) - Ngày: ${new Date(score.createdAt).toLocaleDateString()}`;
    //                                 }
    //                                 return 'Không có dữ liệu';
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         });
    
    //         return () => chart.destroy();
    //     }
    // }, [activeTab, resultExercises]);
    
    
    // useEffect(() => {
    //     if (activeTab !== "exercise") return;
    //     if (!listExercises.length) return;
    
    //     const ctx = document.getElementById("exerciseChart") as HTMLCanvasElement;
    //     if (ctx) {
    //         // Chuẩn bị dữ liệu
    //         const dataset = resultExercises?.map(result => {
    //             const exercise = listExercises.find(ex => ex.id === result.examId); // Tìm bài kiểm tra tương ứng
    //             if (!exercise) return null; // Nếu không tìm thấy bài kiểm tra tương ứng, bỏ qua kết quả này
    
    //             return {
    //                 examId: result.examId,
    //                 name: exercise.name,
    //                 yourScore: result.yourScore,
    //                 totalScore: result.totalScore,
    //                 score: calculateScore(result.totalScore, result.yourScore),
    //                 createdAt: result.createdAt,
    //             };
    //         }).filter(Boolean);
    
    //         console.log('Dataset:', dataset);
    
    //         // Tạo `labels` cho từng cột riêng biệt
    //         const labels = (dataset ?? []).map(item => `${item?.name} - ${new Date(item?.createdAt).toLocaleDateString()}`);
    
    //         // Chuẩn bị `data` tương ứng với `labels`
    //         const data = dataset?.map(item => item?.score);
    
    //         // Vẽ biểu đồ
    //         const chart = new ChartJS(ctx, {
    //             type: "bar",
    //             data: {
    //                 labels: labels, // Nhãn riêng biệt cho từng cột
    //                 datasets: [{
    //                     label: 'Điểm',
    //                     data: data, // Điểm tương ứng với từng nhãn
    //                     backgroundColor: "rgba(54, 162, 235, 0.2)",  // Màu nền của cột
    //                     borderColor: "rgba(54, 162, 235, 1)",  // Màu viền của cột
    //                     borderWidth: 2,  // Độ dày viền
    //                 }]
    //             },
    //             options: {
    //                 responsive: true,
    //                 maintainAspectRatio: false,
    //                 scales: {
    //                     x: {
    //                         type: 'category',  // Trục X là dạng danh mục
    //                         title: {
    //                             display: true,
    //                             text: 'Tên bài tập và ngày', // Tiêu đề trục X
    //                         },
    //                         ticks: {
    //                             autoSkip: false,  // Hiển thị tất cả nhãn
    //                             maxRotation: 45,
    //                             minRotation: 45,
    //                         },
    //                     },
    //                     y: {
    //                         beginAtZero: true,  // Bắt đầu từ 0
    //                         max: 10,  // Điểm tối đa là 10
    //                         title: {
    //                             display: true,
    //                             text: 'Điểm',  // Tiêu đề trục Y
    //                         },
    //                     },
    //                 },
    //                 plugins: {
    //                     legend: {
    //                         position: "top",  // Vị trí của chú thích (legend)
    //                     },
    //                     tooltip: {
    //                         callbacks: {
    //                             title: function (context) {
    //                                 const index = context[0].dataIndex;
    //                                 const item = dataset ? dataset[index] : null;
    //                                 return `Bài tập: ${item?.name} - Ngày: ${new Date(item?.createdAt).toLocaleDateString()}`;
    //                             },
    //                             label: function (context) {
    //                                 const index = context.dataIndex;
    //                                 const item = dataset ? dataset[index] : null;
    //                                 return item ? `${item?.yourScore}/${item?.totalScore} (${item?.score} điểm)` : 'Không có dữ liệu';
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         });
    
    //         return () => chart.destroy();
    //     }
    // }, [activeTab, resultExercises]);
    
    

    useEffect(() => {
        if (activeTab !== "exam") return;
        
        const ctx = document.getElementById("examChart") as HTMLCanvasElement;
        if (ctx) {
            const mergedExamData = resultExam && resultExam.length > 0 ? resultExam.map(result => {
                const exam = listExams?.find(e => e.id === result.examId);
                return {
                    examDate: exam?.createdAt ? new Date(exam.createdAt) : null,
                    yourScore: result ? result.yourScore : 0,
                    totalScore: result ? result.totalScore : 0,
                };
            }).filter(item => item.examDate) : [];
    
            const labels = mergedExamData.length > 0 ? mergedExamData.map(item => item.examDate?.toLocaleDateString()) : ['Không có dữ liệu'];
            const data = mergedExamData.length > 0 ? mergedExamData.map(item => calculateScore(item.totalScore, item.yourScore)) : [0];
    
            mergedExamData.sort((a, b) => (a.examDate?.getTime() || 0) - (b.examDate?.getTime() || 0));
    
            const chart = new ChartJS(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Điểm bài kiểm tra",
                        data: data,
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Ngày làm bài',
                            },
                            ticks: {
                                autoSkip: true,
                                maxRotation: 45,
                                minRotation: 45,
                            },
                        },
                        y: {
                            beginAtZero: true,
                            max: 10,
                            title: {
                                display: true,
                                text: 'Điểm',
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        tooltip: {
                            callbacks: {
                                title: function (context) {
                                    const index = context[0].dataIndex;
                                    const item = mergedExamData[index];
                                    return `Ngày làm bài: ${item?.examDate?.toLocaleDateString() || 'N/A'}`;
                                },
                                label: function (context) {
                                    const index = context.dataIndex;
                                    const item = mergedExamData[index];
                                    return item ? `${item?.yourScore}/${item?.totalScore} (${calculateScore(item?.totalScore, item?.yourScore)} điểm)` : 'Không có dữ liệu';
                                },
                            },
                        },
                    },
                },
            });
    
            return () => chart.destroy();
        }
    }, [resultExam, activeTab]);
    
    
    const handleTabClick = (tabId: "theory" | "exercise" | "exam") => {
        setActiveTab(tabId);
        setExamResults(null);
        setExerciseResults(null);
        setMockData({ chapter: [], exercise: [], exam: [] });
    };
    return (
        <div className="tw-flex">
            {/* Sidebar */}
            <div className={`tw-min-h-screen tw-bg-gray-800 tw-text-white tw-transition-all tw-duration-300 ${isSidebarOpen ? "tw-w-64" : "tw-w-16"}`}>
                <div className="tw-p-4">
                    <div className="tw-flex tw-items-center tw-justify-between">
                        {isSidebarOpen && <h2 className="tw-text-xl tw-font-bold">Biểu đồ</h2>}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="tw-p-2 hover:tw-bg-gray-700 tw-rounded-lg"
                        >
                            <MenuIcon />
                        </button>
                    </div>
                </div>
                <nav className="tw-mt-4">
                    {[
                        // { icon: <ChromeReaderModeIcon />, label: "Số liệu chung", id: "general" },
                        { icon: <AutoStoriesIcon />, label: "Bài giảng", id: "theory" },
                        { icon: <AssignmentIcon />, label: "Bài tập", id: "exercise" },
                        { icon: <BorderColorIcon />, label: "Bài kiểm tra", id: "exam" },
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleTabClick(item.id as "theory" | "exercise" | "exam")}
                            className={`tw-flex tw-items-center tw-px-4 tw-py-3 tw-cursor-pointer ${activeTab === item.id ? "tw-bg-blue-600" : "hover:tw-bg-gray-700"
                                }`}
                        >
                            {item.icon}
                            {isSidebarOpen && <span className="tw-ml-3">{item.label}</span>}
                        </div>
                    ))}
                </nav>
            </div>
            {/* Main Content */}
            <div className="tw-flex-1 tw-flex tw-justify-center tw-bg-slate-200">
                <div className="tw-px-6 tw-flex tw-flex-col tw-pt-10 tw-items-center tw-w-full">
                    <h1 className="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-6">
                        BIỂU ĐỒ TIẾN TRÌNH HỌC TẬP
                    </h1>
                    {/* Filter Section */}
                    {activeTab !== "theory" && (
                    <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md tw-mb-6">
                        <div className="tw-flex tw-items-center tw-gap-4 tw-flex-wrap">
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <FilterAltIcon className="tw-text-gray-600" />
                                <span className="tw-text-gray-700 tw-font-medium">Bộ lọc:</span>
                                <div className="tw-flex tw-items-center">
                                    <QCDateFilter
                                        key={activeTab}
                                        onChange={(filter) => {
                                            handleFilter(filter);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                    {/* Dashboard Content */}
                    {isLoading ? (
                        <div>Đang tải...</div>
                    ) : (
                            <div className="tw-grid tw-grid-cols-1 tw-gap-6 tw-w-full">
                                {activeTab === "theory" && (
                                    <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                                        <div className='tw-flex tw-w-3/5 tw-py-2'>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div>Tiến trình: </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div className='tw-font-bold tw-text-xl'>
                                                    {numberTheoryDone}/{chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.theoryCount || 0}
                                                </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-3/5'>
                                                <ProgressBar
                                                    bgColor='orange'
                                                    className='tw-w-full tw-items-center'
                                                    maxCompleted={100}
                                                    isLabelVisible={false}
                                                    completed={numberTheoryDone / (chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.theoryCount || 0) * 100}
                                                />
                                            </div>
                                        </div>
                                        <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Thống kê các bài đã học theo từng chương</h2>
                                        <Select
                                            value={selectedChapter}
                                            onChange={handleChapterChange}
                                            options={chaptersForSelect.map(chapter => ({ value: chapter.value, label: chapter.label })) as any}
                                            placeholder="Chọn"
                                            className="tw-w-3/5 tw-rounded-full tw-py-1 tw-px-2 tw-text-sm tw-z-10"
                                        />
                                        <div className="tw-h-[500px]">
                                            <canvas id="theoryChart"></canvas>
                                        </div>
                                    </div>
                                )}
                                {/* {activeTab === "general" && (
                                <div>
                                    <div className='tw-space-y-3 tw-w-3/5'>
                                        <Select
                                            value={selectedChapter}
                                            onChange={handleChapterChange}
                                            options={chaptersForSelect.map(chapter => ({ value: chapter.value, label: chapter.label })) as any}
                                            placeholder="Chọn"
                                            className="tw-w-3/5 tw-rounded-full tw-py-1 tw-px-2 tw-text-sm tw-z-10"
                                        />
                                        <div className='tw-flex tw-w-full'>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div>Bài lý thuyết: </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div className='tw-font-bold tw-text-xl'>
                                                    {numberTheoryDone}/{chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.theoryCount || 0}
                                                </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-3/5'>
                                                <ProgressBar
                                                    bgColor='orange'
                                                    className='tw-w-full tw-items-center'
                                                    maxCompleted={100}
                                                    isLabelVisible={false}
                                                    completed={numberTheoryDone / (chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.theoryCount || 0) * 100}
                                                />
                                            </div>
                                        </div>
                                        <div className='tw-flex tw-w-full'>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div>Bài tập: </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>

                                                <div className='tw-font-bold tw-text-xl'>
                                                    {numberExcersiceDone}/{chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.examCount || 0}
                                                </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-3/5'>
                                                <ProgressBar
                                                    bgColor='orange'
                                                    className='tw-w-full tw-items-center'
                                                    maxCompleted={100}
                                                    isLabelVisible={false}
                                                    completed={numberExcersiceDone / (chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.examCount || 0) * 100}
                                                />
                                            </div>
                                        </div>
                                        <div className='tw-flex tw-w-full'>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div>Bài kiểm tra: </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div className='tw-font-bold tw-text-xl'>
                                                    {numberExamDone}/{exams2?.length}
                                                </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-3/5'>
                                                <ProgressBar
                                                    bgColor='orange'
                                                    className='tw-w-full tw-items-center'
                                                    maxCompleted={100}
                                                    isLabelVisible={false}
                                                    completed={numberExamDone / exams2?.length * 100}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                )} */}
                                {activeTab === "exercise" && (
                                    <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                                        <div className='tw-flex tw-w-3/5 tw-py-4'>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div>Bài tập: </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>

                                                <div className='tw-font-bold tw-text-xl'>
                                                    {numberExcersiceDone}/{chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.examCount || 0}
                                                </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-3/5'>
                                                <ProgressBar
                                                    bgColor='orange'
                                                    className='tw-w-full tw-items-center'
                                                    maxCompleted={100}
                                                    isLabelVisible={false}
                                                    completed={numberExcersiceDone / (chaptersData?.data.find((chapter: IChapter) => chapter.id === selectedChapterId)?.examCount || 0) * 100}
                                                />
                                            </div>
                                        </div>
                                        <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Thống kê điểm bài tập</h2>
                                        <div className='tw-flex tw-items-center tw-space-x-4 tw-w-3/5 tw-p-1'>
                                            <div className='tw-font-semibold'>Chọn chương: </div>
                                            <Select
                                                value={selectedChapter}
                                                onChange={handleChapterChange}
                                                options={chaptersForSelect.map(chapter => ({ value: chapter.value, label: chapter.label })) as any}
                                                placeholder="Chọn"
                                                className="tw-w-3/5 tw-rounded-full tw-py-1 tw-px-2 tw-text-sm tw-z-10"
                                            />
                                        </div>
                                        <div className="tw-h-[500px]">
                                            <canvas id="exerciseChart"></canvas>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "exam" && (
                                    <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                                        <div className='tw-flex tw-w-3/5 tw-py-4'>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div>Bài kiểm tra: </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-1/5'>
                                                <div className='tw-font-bold tw-text-xl'>
                                                    {numberExamDone}/{exams2?.length}
                                                </div>
                                            </div>
                                            <div className='tw-flex tw-justify-start tw-items-center tw-w-3/5'>
                                                <ProgressBar
                                                    bgColor='orange'
                                                    className='tw-w-full tw-items-center'
                                                    maxCompleted={100}
                                                    isLabelVisible={false}
                                                    completed={numberExamDone / exams2?.length * 100}
                                                />
                                            </div>
                                        </div>
                                        <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Thống kê điểm bài kiểm tra</h2>
                                        <div className="tw-flex">
                                        <div className='tw-flex tw-items-center tw-space-x-4 tw-w-3/5 tw-p-1'>
                                            <div className='tw-font-semibold'>Chọn chương: </div>
                                            <Select
                                                value={selectedChapter}
                                                onChange={handleChapterChange}
                                                options={chaptersForSelect.map(chapter => ({ value: chapter.value, label: chapter.label })) as any}
                                                placeholder="Chọn"
                                                className="tw-w-3/5 tw-rounded-full tw-py-1 tw-px-2 tw-text-sm tw-z-10"
                                            />
                                        </div>
                                        <div className='tw-flex tw-items-center tw-space-x-4 tw-w-3/5 tw-p-1'>
                                            <div className='tw-font-semibold'>Chọn bài kiểm tra: </div>
                                            <Select
                                                value={selectedExam}
                                                onChange={handleExamChange}
                                                options={listExams.map(exam => ({ value: exam.id, label: exam.name })) as any}
                                                placeholder="Chọn"
                                                className="tw-w-3/5 tw-rounded-full tw-py-1 tw-px-2 tw-text-sm tw-z-10"
                                            />
                                        </div>
                                        </div>
                                        <div className="tw-h-[500px]">
                                            <canvas id="examChart"></canvas>
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chart;