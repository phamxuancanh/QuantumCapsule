import React, { useState, useEffect } from "react";
import ChartJS from 'chart.js/auto';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MenuIcon from '@mui/icons-material/Menu';
import { ListChapterParams } from "api/chapter/chapter.interface";
import { getListChapterNoPaging } from "api/chapter/chapter.api";
import { useLocation } from "react-router-dom";
import { findProgressByChapter } from "api/progress/progress.api";
import { getFromLocalStorage } from "utils/functions";
import QCDateFilter, { IDateFilter } from "QCComponents/QCDateFilter/QCDateFilter";
import { toast } from 'react-toastify';
import { IGetResultByUserIdFilterParams } from "api/result/result.interface";
import Select from 'react-select';
import { getListUniqueDoneResultByChapterId } from "api/result/result.api";
import { set } from "lodash";
import { getExamsByChapterId, getExercisesByChapterId } from "api/exam/exam.api";
import { calculateScore } from "helpers/Nam-helper/Caculate";

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
    const [activeTab, setActiveTab] = useState<"theory" | "exercise" | "exam">("theory");
    const [chapters, setChapters] = useState<{ value: string; label: string; count: number; theories: any[] }[]>([]);
    const [listExercises, setListExercises] = useState<any[]>([]);
    const [listExams, setListExams] = useState<any[]>([]);
    const [exerciseResults, setExerciseResults] = useState<any[] | null>(null);
    const [examResults, setExamResults] = useState<any[] | null>(null);
    const [chaptersForSelect, setChaptersForSelect] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [mockData, setMockData] = useState<MockData>({ chapter: [], exercise: [], exam: [] });

    const fetchTheoryProgress = async (chaptersData: { value: string; label: string; count: number }[]) => {
        try {
            const progressPromises = chaptersData.map(async (chapter) => {
                const progressRes = await findProgressByChapter(chapter.value);
                return {
                    chapterId: chapter.value,
                    count: progressRes.data.data.length,
                    theories: progressRes.data.data,
                };
            });

            const progressCounts = await Promise.all(progressPromises);

            const chapterDataMap: { [key: string]: { count: number; theories: any[] } } = {};
            progressCounts.forEach(({ chapterId, count, theories }) => {
                chapterDataMap[chapterId] = { count, theories };
            });

            return chapterDataMap;
        } catch (error) {
            console.error(error);
            return {};
        }
    };
    const fetchExamResultProgress = async () => {
        console.log('fetchExamResultProgress')
        if (currentUser?.currentUser?.id && selectedSubject) {
            console.log(selectedChapter)
            if (selectedChapter) {
                const progress = await getListUniqueDoneResultByChapterId(selectedChapter.value);
                setExerciseResults(progress.data.data.exercises);
                setExamResults(progress.data.data.exams);
            }
        }
    };
    const fetchChapters = async (params?: ListChapterParams) => {
        setIsLoading(true);
        console.log('canhcanhcnah')
        try {
            const res = await getListChapterNoPaging({ params });
            const chaptersData = res.data.data.map((chapter: any) => ({
                value: chapter.id,
                label: chapter.name,
                count: 0,
                theories: [],
            }));

            const chapterDataMap = await fetchTheoryProgress(chaptersData);
            const updatedChapters = chaptersData.map((chapter) => ({
                ...chapter,
                count: chapterDataMap[chapter.value]?.count || 0,
                theories: chapterDataMap[chapter.value]?.theories || [],
            }));

            setChapters(updatedChapters);
            setChaptersForSelect(chaptersData);
            setSelectedChapter(chaptersData[0]);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            if (selectedChapter) {
                console.log('fetch lai select')
                const responseExcercises = await getExercisesByChapterId(selectedChapter?.value);
                setListExercises(responseExcercises.data.data);
                const responseExams = await getExamsByChapterId(selectedChapter?.value);
                setListExams(responseExams.data.exams);
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
    }, [location.search]);

    useEffect(() => {
        if (!isLoading && chapters.length > 0) {
            setMockData({ chapter: chapters, exercise: [], exam: [] });
        }
        if (exerciseResults === null && examResults === null) {
            fetchExamResultProgress();
        }
    }, [chapters, selectedChapter]);

    const handleChapterChange = async (selectedChapter: any) => {
        setSelectedChapter(selectedChapter);
    };
    const handleFilter = async (filter: IDateFilter) => {
        console.log(filter);
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

            const progressPromises = chapters.map(async (chapter) => {
                const theoryProgressResponse = await findProgressByChapter(chapter.value, {
                    from: filter.from,
                    to: filter.to
                } as IGetResultByUserIdFilterParams);

                const theoryProgress = theoryProgressResponse?.data?.data || [];
                return {
                    chapterId: chapter.value,
                    count: theoryProgress.length
                };
            });
            if (selectedChapter) {
                const resultExamExercises = await getListUniqueDoneResultByChapterId(selectedChapter.value, {
                    from: filter.from,
                    to: filter.to
                } as IGetResultByUserIdFilterParams);
                console.log('RESULT EXAM EXERCISES:', resultExamExercises.data.data);
                setExerciseResults(resultExamExercises.data.data.exercises);
                setExamResults(resultExamExercises.data.data.exams);
            }


            const progressCounts = await Promise.all(progressPromises);

            const updatedChapters = chapters.map((chapter) => {
                const foundProgress = progressCounts.find((progress) => progress.chapterId === chapter.value);
                console.log('foundProgress')
                console.log(foundProgress)
                return {
                    ...chapter,
                    count: foundProgress?.count || 0
                };
            });
            console.log(updatedChapters);
            setChapters(updatedChapters);
            setChaptersForSelect(updatedChapters);
            setSelectedChapter(updatedChapters[0]);
            console.log(mockData);
        } catch (err) {
            console.error(err);
            toast.error("Đã xảy ra lỗi khi lọc dữ liệu.");
        }
    };
    useEffect(() => {
        console.log('Exam Results Updated1111:', examResults);
    }, [examResults]);
    
    useEffect(() => {
        console.log('Exercise Results Updated111:', exerciseResults);
    }, [exerciseResults]);
    useEffect(() => {
        if (activeTab !== "theory") return;

        const ctx = document.getElementById("theoryChart") as HTMLCanvasElement;
        if (ctx) {
            const chart = new ChartJS(ctx, {
                type: "bar",
                data: {
                    labels: mockData.chapter.map(item => item.label),
                    datasets: [{
                        label: "Tiến trình bài học",
                        data: mockData.chapter.map(item => item.count),
                        backgroundColor: "rgba(54, 162, 235, 0.5)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const index = context.dataIndex;
                                    const theories = mockData.chapter[index].theories;
                                    const theoryNames = theories.map((theory) => `• ${theory.name}`);
                                    return ['Bài học:'].concat(theoryNames);
                                },
                            },
                        },
                    },
                },
            });
            return () => chart.destroy();
        }
    }, [mockData, activeTab]);

    useEffect(() => {
        console.log('Active Tab:', activeTab);
        if (activeTab !== "exercise") return;
        if (!listExercises.length) return;

        const ctx = document.getElementById("exerciseChart") as HTMLCanvasElement;
        if (ctx) {
            const mergedData = listExercises.map(exercise => {
                const result = exerciseResults?.find(r => r.examId === exercise.id);
                return {
                    name: exercise.name,
                    yourScore: result ? result.yourScore : 0,
                    totalScore: result ? result.totalScore : 0,
                };
            });
            const chart = new ChartJS(ctx, {
                type: "line",
                data: {
                    labels: mergedData.map(item => item.name),
                    datasets: [{
                        label: "Điểm bài tập",
                        data: mergedData.map(item => calculateScore(item.totalScore, item.yourScore)),
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 2,
                        fill: true,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
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
                                label: function (context) {
                                    const index = context.dataIndex;
                                    const item = mergedData[index];
                                    return `${item.yourScore}/${item.totalScore} (${calculateScore(item.totalScore, item.yourScore)} điểm)`;
                                },
                            },
                        },
                    },
                },
            });

            return () => chart.destroy();
        }
    }, [activeTab, exerciseResults, listExercises]);

    useEffect(() => {
        if (activeTab !== "exam") return;
        console.log('List Exams:', listExams);
        if (!listExams?.length) return; // Đảm bảo đã có danh sách bài kiểm tra

        const ctx = document.getElementById("examChart") as HTMLCanvasElement;
        if (ctx) {
            const mergedExamData = listExams.map(exam => {
                const result = examResults?.find(r => r.examId === exam.id);
                return {
                    name: exam.name,
                    yourScore: result ? result.yourScore : 0,
                    totalScore: result ? result.totalScore : 0,
                };
            });
            const chart = new ChartJS(ctx, {
                type: "bar",
                data: {
                    labels: mergedExamData.map(item => item.name),
                    datasets: [{
                        label: "Điểm bài kiểm tra",
                        data: mergedExamData.map(item => calculateScore(item.totalScore, item.yourScore)),
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10, // Giới hạn trục y từ 0 đến 10
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
                                label: function (context) {
                                    const index = context.dataIndex;
                                    const item = mergedExamData[index];
                                    return `${item.yourScore}/${item.totalScore} (${calculateScore(item.totalScore, item.yourScore)} điểm)`;
                                },
                            },
                        },
                    },
                },
            });

            return () => chart.destroy();
        }
    }, [examResults, listExams, activeTab]);
    return (
        <div className="tw-flex">
            {/* Sidebar */}
            <div className={`tw-min-h-screen tw-bg-gray-800 tw-text-white tw-transition-all tw-duration-300 ${isSidebarOpen ? "tw-w-64" : "tw-w-16"}`}>
                <div className="tw-p-4">
                    <div className="tw-flex tw-items-center tw-justify-between">
                        {isSidebarOpen && <h2 className="tw-text-xl tw-font-bold">Academic</h2>}
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
                        { icon: <AutoStoriesIcon />, label: "Bài lý thuyết", id: "theory" },
                        { icon: <AssignmentIcon />, label: "Bài tập", id: "exercise" },
                        { icon: <BorderColorIcon />, label: "Bài kiểm tra", id: "exam" },
                    ].map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveTab(item.id as "theory" | "exercise" | "exam")}
                            className={`tw-flex tw-items-center tw-px-4 tw-py-3 tw-cursor-pointer ${activeTab === item.id ? "tw-bg-blue-600" : "hover:tw-bg-gray-700"}`}
                        >
                            {item.icon}
                            {isSidebarOpen && <span className="tw-ml-3">{item.label}</span>}
                        </div>
                    ))}
                </nav>
            </div>
            {/* Main Content */}
            <div className="tw-flex-1 tw-flex tw-justify-center">
                <div className="tw-p-6 tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full">
                    <h1 className="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-6">
                        Academic Dashboard
                    </h1>
                    {/* Filter Section */}
                    <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md tw-mb-6">
                        <div className="tw-flex tw-items-center tw-gap-4 tw-flex-wrap">
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <FilterAltIcon className="tw-text-gray-600" />
                                <span className="tw-text-gray-700 tw-font-medium">Bộ lọc:</span>
                                <div className="tw-flex tw-items-center">
                                    <QCDateFilter
                                        onChange={(filter) => {
                                            handleFilter(filter);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Dashboard Content */}
                    {isLoading ? (
                        <div>Đang tải...</div>
                    ) : (
                        <div className="tw-grid tw-grid-cols-1 tw-gap-6 tw-w-full">
                            {activeTab === "theory" && (
                                <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                                    <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Thống kê tiến trình học lý thuyết</h2>
                                    <div className="tw-h-[500px]">
                                        <canvas id="theoryChart"></canvas>
                                    </div>
                                </div>
                            )}
                            {activeTab === "exercise" && (
                                <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                                    <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Thống kê tiến trình làm bài tập</h2>
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
                                    <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Thống kê tiến trình làm bài kiểm tra</h2>
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