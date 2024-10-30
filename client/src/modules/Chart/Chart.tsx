import React, { useState, useEffect, useCallback } from "react";
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
import { getListUniqueDoneResultByChapterId } from "api/result/result.api";
import { IGetResultByUserIdFilterParams } from "api/result/result.interface";
interface TheoryData {
    name: string;
    count: number;
}

interface ExamData {
    name: string;
    score: number;
    date: string;
}

interface ExerciseData {
    name: string;
    value: number;
}

interface MockData {
    exam: ExamData[];
    exercise: ExerciseData[];
    chapter: { value: string; label: string; count: number }[];
}

const Chart: React.FC = React.memo(() => {
    const location = useLocation();
    const [selectedDay, setSelectedDay] = useState<string>("all");
    const [selectedChapter, setSelectedChapter] = useState<string>("all");
    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const [currentUser, setCurrentUser] = useState(getFromLocalStorage<any>('persist:auth'))
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [filteredExamData, setFilteredExamData] = useState<ExamData[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<"theory" | "exercise" | "exam">("theory");
    const [chapters, setChapters] = useState<{ value: string; label: string; count: number }[]>([]);
    // TAB LY THUYET
    const fetchTheoryProgress = useCallback(async (chaptersData: { value: string; label: string; count: number }[]) => {
        try {
            const progressPromises = chaptersData.map(async (chapter) => {
                const progressRes = await findProgressByChapter(chapter.value);
                console.log('progressRes');
                console.log(progressRes);
                return {
                    chapterId: chapter.value,
                    count: progressRes.data.data.length,
                };
            });
            const progressCounts = await Promise.all(progressPromises);
            const chapterCounts: { [key: string]: number } = {};
            progressCounts.forEach(({ chapterId, count }) => {
                chapterCounts[chapterId] = count;
            });
            const updatedChapters = chaptersData.map((chapter) => ({
                ...chapter,
                count: chapterCounts[chapter.value] || 0,
            }))
            setChapters(updatedChapters)
        } catch (error) {
            console.error(error)
        }
    }, []);
    
    const fetchChapters = async (params?: ListChapterParams) => {
        try {
            const res = await getListChapterNoPaging({ params });
            const chaptersData = res.data.data.map((chapter: any) => ({
                value: chapter.id,
                label: chapter.name,
                count: 0
            }));
            setChapters(chaptersData);
            await fetchTheoryProgress(chaptersData);
        } catch (error) {
            console.log(error);
        } finally {
        }
    };
    
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const currentPage = parseInt(queryParams.get('page') || '1', 10)
        const currentGrade = parseInt(queryParams.get('grade') || currentUser?.currentUser?.grade, 10)
        const currentSubject = queryParams.get('subject') || 'subject1'
        setSelectedSubject(currentSubject)
        if (currentSubject && currentGrade && currentPage) {
            fetchChapters({ subjectId: currentSubject, grade: currentGrade })
        }
    }, [location.search]);
    
    const handleFilter = async (filter: IDateFilter) => {
        try {
            console.log(filter);
            if (!filter.from || !filter.to) {
                return;
            }
            const fromDate = new Date(filter.from);
            const toDate = new Date(filter.to);
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
    
            const progressCounts = await Promise.all(progressPromises);
    
            const updatedChapters = chapters.map((chapter) => {
                const foundProgress = progressCounts.find((progress) => progress.chapterId === chapter.value);
                return {
                    ...chapter,
                    count: foundProgress?.count || 0
                };
            });
    
            setChapters(updatedChapters);
    
        } catch (err) {
            console.error(err);
            toast.error("Đã xảy ra lỗi khi lọc dữ liệu.");
        }
    };
    
    const mockData: MockData = {
        chapter: chapters,
        exam: [
            { name: "Monday", score: 85, date: "2024-01-01" },
            { name: "Tuesday", score: 75, date: "2024-01-02" },
            { name: "Wednesday", score: 90, date: "2024-01-03" },
            { name: "Thursday", score: 80, date: "2024-01-04" },
            { name: "Friday", score: 88, date: "2024-01-05" },
            { name: "Saturday", score: 92, date: "2024-01-06" },
            { name: "Sunday", score: 78, date: "2024-01-07" }
        ],
        exercise: [
            { name: "Math", value: 30 },
            { name: "Physics", value: 25 },
            { name: "Chemistry", value: 20 },
            { name: "Biology", value: 25 },
        ],
    };

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    useEffect(() => {
        setFilteredExamData(mockData.exam);
    }, []);

    const handleDateFilter = () => {
        if (startDate && endDate) {
            const filteredData = mockData.exam.filter((item) => {
                const itemDate = new Date(item.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return itemDate >= start && itemDate <= end;
            });
            setFilteredExamData(filteredData);
        }
    };

    const Sidebar: React.FC = () => (
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
    );

    const FilterSection: React.FC = () => (
        <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md tw-mb-6">
            <div className="tw-flex tw-items-center tw-gap-4 tw-flex-wrap">
                <div className="tw-flex tw-items-center tw-gap-2">
                    <FilterAltIcon className="tw-text-gray-600" />
                    <span className="tw-text-gray-700 tw-font-medium">Bộ lọc:</span>
                    <div className='tw-flex tw-items-center'>
                        <QCDateFilter
                            onChange={(filter) => {
                                handleFilter(filter);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
    const TheoryDashboard: React.FC = React.memo(() => {
        useEffect(() => {
            const ctx = document.getElementById("theoryChart") as HTMLCanvasElement;
            if (ctx) {
                const chart = new ChartJS(ctx, {
                    type: "bar",
                    data: {
                        labels: mockData.chapter.map(item => item.label),
                        datasets: [{
                            label: "Theory Progress",
                            data: mockData.chapter.map(item => item.count),
                            backgroundColor: "rgba(54, 162, 235, 0.5)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "top"
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const index = context.dataIndex;
                                        const id = mockData.chapter[index].value;
                                        return `ID: ${id}, Value: ${context.raw}`;
                                    }
                                }
                            }
                        }
                    }
                });
                return () => chart.destroy();
            }
        }, []);

        return (
            <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Thống kê tiến trình học lý thuyết</h2>
                <div className="tw-h-[600px]">
                    <canvas id="theoryChart"></canvas>
                </div>
            </div>
        );
    });
    const ExamDashboard: React.FC = () => {
        useEffect(() => {
            const ctx = document.getElementById("examChart") as HTMLCanvasElement;
            if (ctx) {
                const chart = new ChartJS(ctx, {
                    type: "line",
                    data: {
                        labels: filteredExamData.map(item => item.name),
                        datasets: [{
                            label: "Exam Score",
                            data: filteredExamData.map(item => item.score),
                            borderColor: "rgb(75, 192, 192)",
                            tension: 0.1,
                            fill: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "top"
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
                return () => chart.destroy();
            }
        }, [filteredExamData]);

        return (
            <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Thống kê bài kiểm tra</h2>
                <div className="tw-h-[600px]">
                    <canvas id="examChart"></canvas>
                </div>
            </div>
        );
    };

    const ExerciseDashboard: React.FC = () => {
        useEffect(() => {
            const ctx = document.getElementById("exerciseChart") as HTMLCanvasElement;
            if (ctx) {
                const chart = new ChartJS(ctx, {
                    type: "pie",
                    data: {
                        labels: mockData.exercise.map(item => item.name),
                        datasets: [{
                            data: mockData.exercise.map(item => item.value),
                            backgroundColor: COLORS,
                            borderColor: COLORS,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "top"
                            }
                        }
                    }
                });
                return () => chart.destroy();
            }
        }, []);

        return (
            <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Thống kê tiến trình bài tập</h2>
                <div className="tw-h-[600px]">
                    <canvas id="exerciseChart"></canvas>
                </div>
            </div>
        );
    }
    const renderDashboard = () => {
        switch (activeTab) {
            case "theory":
                return <TheoryDashboard />;
            case "exercise":
                return <ExerciseDashboard />;
            case "exam":
                return <ExamDashboard />;
            default:
                return <TheoryDashboard />;
        }
    };

    return (
        <div className="tw-flex">
            <Sidebar />
            <div className="tw-flex-1 tw-flex tw-justify-center">
                <div className="tw-p-6 tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full">
                    <h1 className="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-6">
                        Academic Dashboard
                    </h1>
                    <FilterSection />

                    <div className="tw-grid tw-grid-cols-1 tw-gap-6 tw-w-full">
                        {renderDashboard()}
                    </div>
                </div>
            </div>
        </div>
    );
});
export default Chart;