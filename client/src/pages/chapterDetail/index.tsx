// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getLessonByChapterId } from 'api/lesson/lesson.api';
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
// import { IChapter } from 'api/chapter/chapter.interface';
// import { getChapterById } from 'api/chapter/chapter.api';
// import ROUTES from 'routes/constant';
// import { ILesson } from 'api/lesson/lesson.interface';
// import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import { IExam } from 'api/exam/exam.interface';
// import { ITheory } from 'api/theory/theory.interface';
// import { getExamsByLessonId } from 'api/exam/exam.api';
// import { getTheoriesByLessonId } from 'api/theory/theory.api';
// const ChapterDetail = () => {
//   const navigate = useNavigate();
//   const subjects = [
//     { id: 'subject1', name: 'Toán' },
//     { id: 'subject2', name: 'Tiếng Việt' }
//   ];

//   const getSubjectName = (subjectId: string) => {
//     const subject = subjects.find(subject => subject.id === subjectId);
//     return subject ? subject.name : 'Unknown Subject';
//   };

//   const handleTitleClick = () => {
//     if (chapter) {
//       const params = new URLSearchParams({
//         subject: chapter.subjectId || '',
//         grade: chapter.grade?.toString() || ''
//       });
//       navigate(`${ROUTES.home}?${params.toString()}`);
//     }
//   };

//   const [chapter, setChapter] = useState<IChapter | null>(null);
//   const [lessons, setLessons] = useState<ILesson[]>([]);
//   const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
//   const [theories, setTheories] = useState<{ [key: string]: ITheory[] }>({});
//   const [exams, setExams] = useState<{ [key: string]: IExam[] }>({});

//   const fetchLessons = async () => {
//     try {
//       if (chapter?.id) {
//         const response = await getLessonByChapterId(chapter.id);
//         console.log(response);
//         setLessons(response.data.data);
//       } else {
//         console.error('Chapter ID is undefined');
//       }
//     } catch (error) {
//       console.error('Error fetching lessons:', error);
//     }
//   };

//   useEffect(() => {
//     fetchLessons();
//   }, [chapter]);

//   const fetchTheoriesAndExams = async (lessonId: string) => {
//     try {
//       const [theoriesResponse, examsResponse] = await Promise.all([
//         getTheoriesByLessonId(lessonId),
//         getExamsByLessonId(lessonId),
//       ]);

//       setTheories((prevState) => ({
//         ...prevState,
//         [lessonId]: theoriesResponse.data.data,
//       }));
//       setExams((prevState) => ({
//         ...prevState,
//         [lessonId]: examsResponse.data.data,
//       }));
//     } catch (error) {
//       console.error('Error fetching theories and exams:', error);
//     }
//   };

//   useEffect(() => {
//     const queryParams = new URLSearchParams(window.location.search);
//     const chapterId = queryParams.get('chapter');
//     console.log(chapterId);

//     const fetchChapter = async () => {
//       try {
//         if (chapterId) {
//           const response = await getChapterById(chapterId);
//           setChapter(response.data.chapter);
//         } else {
//           console.error('ChapterId ID is undefined');
//         }
//       } catch (error) {
//         console.error('Error fetching chapter:', error);
//       }
//     };

//     if (!chapter) {
//       fetchChapter();
//     }
//   }, [chapter]);

//   // Toggle the expanded state of a lesson
//   // const toggleLessonExpand = (lessonId: string) => {
//   //   setExpandedLessons((prevExpandedLessons) =>
//   //     prevExpandedLessons.includes(lessonId)
//   //       ? prevExpandedLessons.filter((id) => id !== lessonId)
//   //       : [...prevExpandedLessons, lessonId]
//   //   );
//   // };

//   const toggleLessonExpand = (lessonId: string) => {
//     if (expandedLessons.includes(lessonId)) {
//       setExpandedLessons((prevExpandedLessons) =>
//         prevExpandedLessons.filter((id) => id !== lessonId)
//       );
//     } else {
//       setExpandedLessons((prevExpandedLessons) => [...prevExpandedLessons, lessonId]);
//       fetchTheoriesAndExams(lessonId);
//     }
//   };
//   return (
//     <div className='tw-flex tw-items-center tw-justify-center'>
//       {chapter ? (
//         <div className='tw-w-4/5 tw-space-y-2'>
//           <div className='tw-flex tw-items-center'>
//             <div
//               onClick={handleTitleClick}
//               className='tw-font-bold tw-text-xl tw-inline-flex tw-items-center tw-cursor-pointer tw-text-gray-500 hover:tw-text-green-500'
//             >
//               {getSubjectName(chapter?.subjectId || '')} {chapter?.grade} - Chân trời sáng tạo
//             </div>
//           </div>
//           <div className='tw-font-bold tw-text-3xl'>{chapter.name}</div>
//           <div className='tw-flex tw-flex-col tw-space-y-4 tw-border tw-rounded-lg'>
//             {lessons?.map((lesson) => (
//               <div key={lesson.id}>
//                 <div
//                   onClick={() => toggleLessonExpand(lesson.id ?? '')}
//                   className='tw-flex tw-items-center tw-justify-between tw-border tw-rounded-lg tw-p-4 tw-cursor-pointer tw-w-full tw-bg-slate-100'
//                 >
//                   <div className='tw-flex tw-flex-col'>
//                     <div className='tw-font-bold tw-text-lg'>{lesson.name}</div>
//                   </div>
//                   {expandedLessons.includes(lesson.id ?? '') ? <RemoveIcon /> : <AddIcon />}
//                 </div>

//                 {/* Expand section for theories and practice only if the lesson is expanded */}
//                 {expandedLessons.includes(lesson.id ?? '') && (
//                   <div className='tw-flex tw-flex-col tw-px-6 tw-py-4 tw-space-y-2 tw-bg-gray-50'>
//                     <div className='tw-flex tw-items-center'>
//                       <PlayCircleOutlineIcon className='tw-mr-2' />
//                       <span className='tw-font-semibold'>Lý thuyết</span>

//                     </div>
//                     <div className='tw-flex tw-items-center'>
//                       <CheckCircleOutlineIcon className='tw-mr-2' />
//                       <span className='tw-font-semibold'>Luyện tập</span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <p>No lesson data available.</p>
//       )}
//     </div>
//   );
// };

// export default ChapterDetail;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLessonByChapterId } from 'api/lesson/lesson.api';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { IChapter } from 'api/chapter/chapter.interface';
import { getChapterById } from 'api/chapter/chapter.api';
import ROUTES from 'routes/constant';
import { ILesson } from 'api/lesson/lesson.interface';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { IExam } from 'api/exam/exam.interface';
import { ITheory } from 'api/theory/theory.interface';
import { getExamsByLessonId } from 'api/exam/exam.api';
import { getTheoriesByLessonId } from 'api/theory/theory.api';

const ChapterDetail = () => {
  const navigate = useNavigate();
  const subjects = [
    { id: 'subject1', name: 'Toán' },
    { id: 'subject2', name: 'Tiếng Việt' }
  ];

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(subject => subject.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const handleTitleClick = () => {
    if (chapter) {
      const params = new URLSearchParams({
        subject: chapter.subjectId || '',
        grade: chapter.grade?.toString() || ''
      });
      navigate(`${ROUTES.home}?${params.toString()}`);
    }
  };

  const [chapter, setChapter] = useState<IChapter | null>(null);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
  const [theories, setTheories] = useState<{ [key: string]: ITheory[] }>({});
  const [exams, setExams] = useState<{ [key: string]: IExam[] }>({});

  const fetchLessons = async () => {
    try {
      if (chapter?.id) {
        const response = await getLessonByChapterId(chapter.id);
        console.log(response);
        setLessons(response.data.data);
      } else {
        console.error('Chapter ID is undefined');
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [chapter]);

  const fetchTheoriesAndExams = async (lessonId: string) => {
    try {
      const [theoriesResponse, examsResponse] = await Promise.all([
        getTheoriesByLessonId(lessonId),
        getExamsByLessonId(lessonId),
      ]);
      console.log(theoriesResponse);
      console.log(examsResponse);
      setTheories((prevState) => ({
        ...prevState,
        [lessonId]: theoriesResponse.data.theories,
      }));
      setExams((prevState) => ({
        ...prevState,
        [lessonId]: examsResponse.data.exams,
      }));
    } catch (error) {
      console.error('Error fetching theories and exams:', error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const chapterId = queryParams.get('chapter');
    console.log(chapterId);

    const fetchChapter = async () => {
      try {
        if (chapterId) {
          const response = await getChapterById(chapterId);
          setChapter(response.data.chapter);
        } else {
          console.error('ChapterId ID is undefined');
        }
      } catch (error) {
        console.error('Error fetching chapter:', error);
      }
    };

    if (!chapter) {
      fetchChapter();
    }
  }, [chapter]);

  const toggleLessonExpand = (lessonId: string) => {
    if (expandedLessons.includes(lessonId)) {
      setExpandedLessons((prevExpandedLessons) =>
        prevExpandedLessons.filter((id) => id !== lessonId)
      );
    } else {
      setExpandedLessons((prevExpandedLessons) => [...prevExpandedLessons, lessonId]);
      fetchTheoriesAndExams(lessonId);
    }
  };
  const handleTheoryExamClick = (type: 'theory' | 'exam', id: string) => {
    alert(`${type === 'theory' ? 'Theory' : 'Exam'} ID: ${id}`);
  };

  return (
    <div className='tw-flex tw-items-center tw-justify-center'>
      {chapter ? (
        <div className='tw-w-4/5 tw-space-y-2'>
          <div className='tw-flex tw-items-center'>
            <div
              onClick={handleTitleClick}
              className='tw-font-bold tw-text-xl tw-inline-flex tw-items-center tw-cursor-pointer tw-text-gray-500 hover:tw-text-green-500'
            >
              {getSubjectName(chapter?.subjectId || '')} {chapter?.grade} - Chân trời sáng tạo
            </div>
          </div>
          <div className='tw-font-bold tw-text-3xl'>{chapter.name}</div>
          <div className='tw-flex tw-flex-col tw-space-y-4 tw-border tw-rounded-lg'>
            {lessons?.map((lesson) => (
              <div key={lesson.id}>
                <div
                  onClick={() => toggleLessonExpand(lesson.id ?? '')}
                  className='tw-flex tw-items-center tw-justify-between tw-border tw-rounded-lg tw-p-4 tw-cursor-pointer tw-w-full tw-bg-slate-100'
                >
                  <div className='tw-flex tw-flex-col'>
                    <div className='tw-font-bold tw-text-lg'>{lesson.name}</div>
                  </div>
                  {expandedLessons.includes(lesson.id ?? '') ? <RemoveIcon /> : <AddIcon />}
                </div>

                {expandedLessons.includes(lesson.id ?? '') && (
                  <div className='tw-flex tw-px-6 tw-justify-between tw-mb-2'>

                    <div className='tw-flex tw-flex-col tw-w-1/2 tw-space-y-3'>
                      <div className='tw-flex'>
                        <span className='tw-font-semibold'>Lý thuyết</span>
                      </div>
                      <ul className='tw-space-y-1'>
                        {lesson.id && theories[lesson.id]?.length > 0 ? (
                          theories[lesson.id].map((theory) => (
                            <li className='tw-flex tw-items-center tw-cursor-pointer tw-text-blue-500 hover:tw-underline' key={theory.id} onClick={() => theory.id && handleTheoryExamClick('theory', theory.id)}>
                              <PlayCircleOutlineIcon className='tw-mr-2' />{theory.name}
                            </li>
                          ))
                        ) : (
                          <li>Không có bài lý thuyết.</li>
                        )}
                      </ul>
                    </div>

                    <div className='tw-flex tw-flex-col tw-w-1/2 tw-space-y-3'>
                      <div className='tw-flex'>

                        <span className='tw-font-semibold'>Luyện tập</span>
                      </div>
                      <ul className='tw-space-y-1'>
                        {lesson.id && exams[lesson.id]?.length > 0 ? (
                          exams[lesson.id].map((exam) => (
                            <li className='tw-cursor-pointer tw-text-blue-500 hover:tw-underline' key={exam.id} onClick={() => exam.id && handleTheoryExamClick('exam', exam.id)}>
                              <CheckCircleOutlineIcon className='tw-mr-2' /> {exam.name}
                            </li>
                          ))
                        ) : (
                          <li>Không có bài luyện tập.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No lesson data available.</p>
      )}
    </div>
  );
};

export default ChapterDetail;
