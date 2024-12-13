import React, { useState, useEffect } from "react";
import Select from "react-select";
import ChartJS from 'chart.js/auto';
import QCChapterFilter, { IChapterFilter } from "QCComponents/QCChapterFilter.tsx/ChapterFilter";
import { IChapter } from "api/chapter/chapter.interface";
import { getListAllChapter } from "api/chapter/chapter.api";
import { getListLessonByFilterParams } from "api/lesson/lesson.api";
import { getListExamByFilterParams } from "api/exam/exam.api";
import { ILesson } from "api/lesson/lesson.interface";
import { IExam } from "api/exam/exam.interface";
import { getListTheoryByChapterId } from "api/theory/theory.api";

interface TabOption {
    value: "theory" | "exercise" | "exam";
    label: string;
}

const AdminChart: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"theory" | "exercise" | "exam">("theory");
    const [listChapter, setListChapter] = useState<IChapter[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<IChapter | null>(null);
    const [listLesson, setListLesson] = React.useState<ILesson[]>([])
    const [listExam, setListExam] = React.useState<IExam[]>([])
    const [listTheory, setListTheory] = React.useState<any[]>([])
    const [filter, setFilter] = useState<IChapterFilter>({} as IChapterFilter);
    const [filteredLessons, setFilteredLessons] = useState<ILesson[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<any[]>([]);


    const options: TabOption[] = [
        { value: "theory", label: "Bài giảng" },
        { value: "exercise", label: "Bài tập" },
        { value: "exam", label: "Bài kiểm tra" },
    ];

    const handleFilter = async (data: IChapterFilter) => {
        setFilter(data)
        try {

            const response = await getListAllChapter()
            setListChapter(response.data.data.filter((item) => {
                return (data.grade === 0 || item.grade === data.grade) && (data.subjectId === '' || item.subjectId === data.subjectId)
            }))
            console.log('setSelect')
            // setSelectedChapter(listChapter[0])
            console.log(selectedChapter);
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
        } catch (error: any) {
        }
    }
    useEffect(() => {
        if (listChapter.length > 0) {
            setSelectedChapter(listChapter[0]);
        }
    }, [listChapter]);
    const chapterOptions = listChapter.map((chapter) => ({
        value: chapter.id,
        label: chapter.name,
    }));
    useEffect(() => {
        const fetchTheory = async () => {
            try {
                console.log(selectedChapter);
                if (!selectedChapter) {
                    console.log("selectedChapter is null");
                    return;
                }

                // Gọi API để lấy danh sách bài giảng
                const resTheory = await getListTheoryByChapterId(selectedChapter.id ?? '');
                const theoriesWithChapter = resTheory.data.data.map((theory: any) => ({
                    ...theory,
                    chapterId: selectedChapter.id, // Gắn thêm chapterId từ selectedChapter
                }));

                console.log(theoriesWithChapter);
                setListTheory(theoriesWithChapter);
            } catch (error: any) {
                console.error("Error fetching theories:", error);
            }
        };

        fetchTheory();
    }, [selectedChapter]);
    useEffect(() => {
        if (!selectedChapter) return;

        // Lọc danh sách bài học theo chương được chọn
        const filteredLessons = listLesson.filter(
            (lesson) => lesson.chapterId === selectedChapter.id
        );

        setFilteredLessons(filteredLessons); // Cập nhật danh sách bài học hiển thị
    }, [selectedChapter, listLesson]);
    useEffect(() => {
        handleFilter({
            grade: 1,
            subjectId: 'subject1'
        } as IChapterFilter)
        // setSelectedChapter(listChapter[0])
    }, []);
    useEffect(() => {
        if (!selectedChapter) return;

        // Lọc danh sách bài tập theo chương được chọn
        const filtered = listLesson
            .filter((lesson) => lesson.chapterId === selectedChapter.id) // Lọc bài học thuộc chương
            .flatMap((lesson) => {
                // Tìm tất cả bài tập thuộc bài học này
                return listExam.filter((exercise) => exercise.lessonId === lesson.id);
            });

        setFilteredExercises(filtered);
    }, [selectedChapter, listLesson, listExam]);
    useEffect(() => {
        if (activeTab !== "theory") return;

        const ctx = document.getElementById("theoryChart") as HTMLCanvasElement;
        if (ctx) {
            // Cột X: Tên các bài học trong chương được chọn
            const labels = filteredLessons.map((lesson) => lesson.name);

            // Cột Y: Số lượng bài giảng (theory) theo từng bài học
            const theoryCounts = filteredLessons.map((lesson) => {
                return listTheory.filter((theory) => theory.lessonId === lesson.id).length;
            });

            const chart = new ChartJS(ctx, {
                type: "bar",
                data: {
                    labels: labels, // Cột X: Tên các bài học
                    datasets: [
                        {
                            label: "Số lượng bài giảng",
                            data: theoryCounts, // Cột Y: Số lượng bài giảng
                            backgroundColor: "rgba(75, 192, 192, 0.7)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Tên bài học", // Nhãn cột X
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Số lượng bài giảng", // Nhãn cột Y
                            },
                            ticks: {
                                stepSize: 1, // Hiển thị từng giá trị nguyên
                                callback: function (value: string | number) {
                                    if (Number.isInteger(value)) {
                                        return value as number;
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
                            callbacks: {
                                title: function (context: any[]) {
                                    return context[0].label; // Hiển thị tên bài học
                                },
                                label: function (context: any) {
                                    const index = context.dataIndex; // Lấy index của cột hiện tại
                                    const lessonId = filteredLessons[index]?.id;

                                    // Lấy danh sách tên các bài giảng thuộc bài học
                                    const relatedTheories = listTheory
                                        .filter((theory) => theory.lessonId === lessonId)
                                        .map((theory) => theory.name);

                                    // Hiển thị danh sách bài giảng
                                    if (relatedTheories.length > 0) {
                                        return [`Các bài giảng:`].concat(relatedTheories.map((name) => `• ${name}`));
                                    } else {
                                        return [`Không có bài giảng`];
                                    }
                                },
                            },
                        },
                    },
                    interaction: {
                        mode: "nearest",
                        axis: "x",
                        intersect: false,
                    },
                },
            });

            return () => chart.destroy();
        }
    }, [activeTab, filteredLessons, listTheory]);
    useEffect(() => {
        if (activeTab !== "exercise") return;

        const ctx = document.getElementById("exerciseChart") as HTMLCanvasElement;
        if (ctx) {
            // Cột X: Tên các bài học
            const labels = filteredLessons.map((lesson) => lesson.name);

            // Cột Y: Số lượng bài tập (exercise) theo từng bài học
            const exerciseCounts = filteredLessons.map((lesson) => {
                return filteredExercises.filter((exercise) => exercise.lessonId === lesson.id).length;
            });

            const chart = new ChartJS(ctx, {
                type: "bar",
                data: {
                    labels: labels, // Cột X: Tên bài học
                    datasets: [
                        {
                            label: "Số lượng bài tập",
                            data: exerciseCounts, // Cột Y: Số lượng bài tập
                            backgroundColor: "rgba(255, 159, 64, 0.7)",
                            borderColor: "rgba(255, 159, 64, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Tên bài học", // Nhãn cột X
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Số lượng bài tập", // Nhãn cột Y
                            },
                            ticks: {
                                stepSize: 1, // Hiển thị từng giá trị nguyên
                                callback: function (value: string | number) {
                                    if (Number.isInteger(value)) {
                                        return value as number;
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
                            callbacks: {
                                title: function (context: any[]) {
                                    return context[0].label; // Hiển thị tên bài học
                                },
                                label: function (context: any) {
                                    const index = context.dataIndex; // Lấy index của cột hiện tại
                                    const lessonId = filteredLessons[index]?.id;

                                    // Lấy danh sách tên các bài tập thuộc bài học
                                    const relatedExercises = filteredExercises
                                        .filter((exercise) => exercise.lessonId === lessonId)
                                        .map((exercise) => exercise.name);

                                    // Hiển thị danh sách bài tập
                                    if (relatedExercises.length > 0) {
                                        return [`Các bài tập:`].concat(relatedExercises.map((name) => `• ${name}`));
                                    } else {
                                        return [`Không có bài tập`];
                                    }
                                },
                            },
                        },
                    },
                    interaction: {
                        mode: "nearest",
                        axis: "x",
                        intersect: false,
                    },
                },
            });

            return () => chart.destroy();
        }
    }, [activeTab, filteredLessons, filteredExercises]);

    useEffect(() => {
        if (activeTab !== "exam") return;

        const ctx = document.getElementById("examChart") as HTMLCanvasElement;
        if (ctx) {
            // Cột X: Tên các chương
            const labels = listChapter.map((chapter) => chapter.name);

            // Cột Y: Số lượng bài kiểm tra trong từng chương
            const examCounts = listChapter.map((chapter) => {
                return listExam.filter((exam) => exam.chapterId === chapter.id).length;
            });

            const chart = new ChartJS(ctx, {
                type: "bar",
                data: {
                    labels: labels, // Cột X: Tên các chương
                    datasets: [
                        {
                            label: "Số lượng bài kiểm tra",
                            data: examCounts, // Cột Y: Số lượng bài kiểm tra
                            backgroundColor: "rgba(153, 102, 255, 0.7)",
                            borderColor: "rgba(153, 102, 255, 1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Tên chương", // Nhãn cột X
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Số lượng bài kiểm tra", // Nhãn cột Y
                            },
                            ticks: {
                                stepSize: 1, // Hiển thị từng giá trị nguyên
                                callback: function (value: string | number) {
                                    if (Number.isInteger(value)) {
                                        return value as number;
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
                            callbacks: {
                                title: function (context: any[]) {
                                    return context[0].label; // Hiển thị tên chương
                                },
                                label: function (context: any) {
                                    const index = context.dataIndex; // Lấy index của cột hiện tại
                                    const chapterId = listChapter[index]?.id;

                                    // Lấy danh sách tên các bài kiểm tra thuộc chương
                                    const relatedExams = listExam
                                        .filter((exam) => exam.chapterId === chapterId)
                                        .map((exam) => exam.name);

                                    // Hiển thị danh sách bài kiểm tra
                                    if (relatedExams.length > 0) {
                                        return [`Các bài kiểm tra:`].concat(
                                            relatedExams.map((name) => `• ${name}`)
                                        );
                                    } else {
                                        return [`Không có bài kiểm tra`];
                                    }
                                },
                            },
                        },
                    },
                    interaction: {
                        mode: "nearest",
                        axis: "x",
                        intersect: false,
                    },
                },
            });

            return () => chart.destroy();
        }
    }, [activeTab, listChapter, listExam]);



    return (
        <div className="tw-w-full">
            <div className="tw-font-bold">Chọn loại biểu đồ:</div>
            <Select
                value={options.find((option) => option.value === activeTab)}
                onChange={(selectedOption) => {
                    if (selectedOption) setActiveTab(selectedOption.value);
                }}
                options={options}
                placeholder="Chọn loại biểu đồ"
                className="tw-w-2/5 tw-rounded-full tw-py-2 tw-px-2 tw-text-sm tw-z-10"
            />
            <div className="tw-w-2/5">
                <QCChapterFilter onChange={handleFilter} mode={1} />
            </div>

            {activeTab !== "exam" && (
                <div className="tw-mt-4">
                    <div className="tw-font-bold">Chọn chương:</div>
                    <Select
                        value={selectedChapter ? { value: selectedChapter.id, label: selectedChapter.name } : null}
                        onChange={(selectedOption) => {
                            if (selectedOption) {
                                const chapter = listChapter.find((c) => c.id === selectedOption.value) || null;
                                setSelectedChapter(chapter);
                            }
                        }}
                        options={chapterOptions}
                        placeholder="Chọn chương"
                        className="tw-w-2/5 tw-rounded-full tw-py-1 tw-px-2 tw-text-sm tw-z-10"
                    />
                </div>
            )}
            {activeTab === "theory" && (
                <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                    <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Biểu đồ thống kê các bài giảng</h2>
                    <div className="tw-h-[500px]">
                        <canvas id="theoryChart"></canvas>
                    </div>
                </div>
            )}
            {activeTab === "exercise" && (
                <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                    <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Biểu đồ thống kê các bài ôn tập</h2>
                    <div className="tw-h-[500px]">
                        <canvas id="exerciseChart"></canvas>
                    </div>
                </div>
            )}
            {activeTab === "exam" && (
                <div className="tw-bg-white tw-p-4 tw-rounded-lg tw-shadow-md">
                    <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Biểu đồ thống kê các bài kiểm tra</h2>
                    <div className="tw-h-[500px]">
                        <canvas id="examChart"></canvas>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminChart;
