import { getLessonsandExams } from 'api/lesson/lesson.api';
import { DataListLessonandExam, ListLessonandExamParams } from 'api/lesson/lesson.interface';
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Select from 'react-select'
import { styled } from '@mui/system'
import { Pagination } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { getListSubject } from 'api/subject/subject.api';
import ROUTES from 'routes/constant';
import { useTranslation } from 'react-i18next'
import thumnail from '../../assets/thumnail.png';
import thumnail_exercise from '../../assets/thumnail_exercises.png';
import thumnail_exam from '../../assets/thumnail_exam.png';
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
function SearchResultPage() {
  const CustomPagination = styled(Pagination)({
    '.MuiPagination-ul': {
      display: 'inline-flex',
      fontSize: 'large',
      listStyle: 'none',
      margin: '10px',
      '@media (max-width: 600px)': {
        margin: '5px'
      }
    },
    '.MuiPaginationItem-root': {
      fontSize: 'large',
      fontWeight: 'bold',
      borderRadius: '4px',
      margin: '2px',
      border: '1px solid #cbd5e0',
      backgroundColor: 'white',
      color: '#718096',
      '&:hover': {
        backgroundColor: '#667eea',
        color: 'white'
      },
      '@media (max-width: 600px)': {
        margin: '0px'
      }
    },
    '.MuiPaginationItem-firstLast': {
      borderRadius: '4px'
    },
    '.MuiPaginationItem-previousNext': {
      borderRadius: '4px',
      margin: '10px',
      '@media (min-width: 600px)': {
        margin: '20px'
      },
      '@media (max-width: 600px)': {
        fontSize: 'medium',
        margin: '0px'
      }
    },
    '.MuiPaginationItem-page.Mui-selected': {
      color: '#667eea',
      fontWeight: 'bold',
      border: '2px solid #667eea',
      '&:hover': {
        backgroundColor: '#667eea',
        color: 'white'
      }
    },
    '.MuiPaginationItem-ellipsis': {
      color: '#a0aec0',
      border: '1px solid #cbd5e0',
      backgroundColor: 'white',
      padding: '2px',
      margin: '0',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })
  const { t } = useTranslation();
  const navigate = useNavigate();
  const query = useQuery();
  const initialPage = parseInt(query.get('page') || '1', 10);
  const [page, setPage] = useState<number>(initialPage);

  const location = useLocation();
  const [results, setResults] = useState<DataListLessonandExam | null>(null);
  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');
  const fetchResults = async (params?: ListLessonandExamParams) => {

    const response = await getLessonsandExams({ params });
    setResults(response.data);
    console.log(response.data);
  }
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page') || '1', 10);
    const currentGrade = queryParams.get('grade');
    const currentSubject = queryParams.get('subject');
    const currentType = queryParams.get('type');
    setPage(currentPage);
    setSelectedGrade(currentGrade);
    setSelectedSubject(currentSubject);
    setSelectedType(currentType);
    console.log(currentPage);
    fetchResults({ page: currentPage, search: name || undefined, grade: Number(currentGrade) || undefined, subjectId: currentSubject || undefined, type: currentType || undefined });
  }, [location.search]);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<{ value: string; label: string }[]>([]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    const grade = queryParams.get('grade');
    const subject = queryParams.get('subject');

    setSelectedType(type ? type : null);
    setSelectedGrade(grade ? grade : null);
    setSelectedSubject(subject ? subject : null);
  }, [location.search]);
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getListSubject();
        console.log(response.data.data);
        const subjects = response?.data?.data.map((subject: { id: any; name: any; }) => ({
          value: subject.id,
          label: subject.name
        }));
        setSubjects(subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);
  const typeOptions: { value: string; label: string }[] = [
    { value: 'lesson', label: 'Bài lí thuyết' },
    { value: 'exam', label: 'Bài tập và bài kiểm tra' },
  ];

  const classOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
  ];

  useEffect(() => {
    if (selectedSubject !== null) {
      console.log(selectedSubject);
    }
  }, [selectedSubject]);

  const handleSubjectChange = (option: any) => {
    setSelectedSubject(option.value);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', '1');
    queryParams.set('subject', option.value);
    navigate(`?${queryParams.toString()}`);
  };

  const handleTypeChange = (option: any) => {
    setSelectedType(option.value);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', '1');
    queryParams.set('type', option.value);
    navigate(`?${queryParams.toString()}`);
  };

  const handleClassChange = (option: any) => {
    setSelectedGrade(option.value);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', '1');
    queryParams.set('grade', option.value);
    navigate(`?${queryParams.toString()}`);
  };
  const totalPage = useMemo(() => {
    const size = (results?.data != null) ? results?.size : 5;
    const totalRecord = (results?.data != null) ? results?.totalRecords : 5;
    return Math.ceil(totalRecord / size);
  }, [results?.data]);
  const handleChangeResultPagination = (value: number) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', value.toString());
    navigate(`?${queryParams.toString()}`);
  };
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const handleLessonExamClick = (type: 'theory' | 'exam' | 'lesson', id: string) => {
    console.log(type, id);
    if (type === 'lesson') {
      navigate(`${ROUTES.lessonDetail}?lessonId=${id}`);
    } else if (type === 'exam') {
      // Xử lý khi type là 'exam'
      // lam tiep di Nam
      navigate(`${ROUTES.skill_practice}?examId=${id}`);
      alert(`Exam ID: ${id}`);
    }
  };
  const formatOptionLabelSubject = ({ label }: { label: string }) => {
    switch (label) {
      case 'Toán':
        return t('search.math');
      case 'Tiếng Việt':
        return t('search.literature');
      default:
        return label;
    }
  };
  const formatOptionLabelType = ({ label }: { label: string }) => {
    switch (label) {
      case 'Exam':
        return t('search.exam');
      case 'Lesson':
        return t('search.lesson');
      default:
        return label;
    }
  };
  const formatOptionLabelGrade = ({ label }: { label: string }) => `${t('search.grade')} ${label}`;
  const handleLessonExamExerciseClick = (type: string, id: string) => {
    switch (type.toLowerCase()) {
      case 'lesson':
        navigate(`${ROUTES.lessonDetail}?lessonId=${id}`);
        break;
      case 'exam':
        navigate(`${ROUTES.skill_practice}?examId=${id}`);
        break;
      case 'exercise':
        navigate(`${ROUTES.skill_practice2}?examId=${id}`);
        break;
      default:
        console.warn(`Unhandled type: ${type}`);
        break;
    }
  };
  return (
    <div className="tw-text-lg tw-mt-4 tw-flex tw-items-center tw-flex-col tw-min-h-screen">
      <div className='tw-w-4/5 tw-p-2'>
        <h2 className="tw-text-lg tw-font-bold">{t('search.search_filter')}</h2>
        <div className="tw-flex tw-space-x-4 tw-mb-4">
          <div className="tw-w-1/3">
            <label className="tw-block tw-mb-1">{t('search.choose_subject')}:</label>
            <Select
              options={subjects}
              value={subjects.find(option => option.value === selectedSubject)}
              onChange={handleSubjectChange}
              placeholder={t('search.allSubject')}
              formatOptionLabel={formatOptionLabelSubject}
            />
          </div>

          <div className="tw-w-1/3">
            <label className="tw-block tw-mb-1">{t('search.choose_learning_materials')}:</label>
            <Select
              options={typeOptions as any}
              value={typeOptions.find(option => option.value === selectedType)}
              onChange={handleTypeChange}
              placeholder={t('search.allLearningMaterials')}
              formatOptionLabel={formatOptionLabelType}
            />
          </div>

          <div className="tw-w-1/3">
            <label className="tw-block tw-mb-1">{t('search.choose_grade')}:</label>
            <Select
              options={classOptions as any}
              value={classOptions.find(option => option.value === Number(selectedGrade))}
              onChange={handleClassChange}
              placeholder={t('search.allGrade')}
              formatOptionLabel={formatOptionLabelGrade}
            />
          </div>
        </div>
      </div>
      <div className='tw-w-4/5 tw-p-2'>
        <h2 className="tw-text-lg tw-font-bold">{t('search.search_result')}:</h2>
        <div className='tw-flex tw-flex-col tw-space-y-3'>
          {results?.data?.length > 0 ? (
            results?.data.map((result: any) => (
              <div key={result.id}>
                <div
                  className="tw-py-2 tw-border-b tw-rounded-md tw-cursor-pointer tw-bg-slate-200 tw-p-2"
                  onClick={() => handleLessonExamExerciseClick(result.type, result.id)}
                >
                  <div className="tw-flex tw-space-x-2">
                    <img
                      src={
                        result.type?.toLowerCase() === 'lesson'
                          ? thumnail
                          : result.type?.toLowerCase() === 'exercise'
                            ? thumnail_exercise
                            : result.type?.toLowerCase() === 'exam'
                              ? thumnail_exam
                              : thumnail
                      }
                      alt={`${result.type} thumbnail`}
                      className="tw-w-36 tw-h-36 tw-border tw-border-zinc-950"
                    />
                    <div className='tw-flex tw-flex-col tw-space-y-4'>
                      <div>
                        {result.type?.toLowerCase() === 'exercise' ? (
                          <div>
                            <div>{result.subjectName} {result.Lesson.Chapter?.grade}</div>
                            <div>{result.Lesson?.Chapter?.name}</div>
                          </div>
                        ) : (
                          <>
                            <div>{result.Chapter?.Subject?.name} {result.Chapter?.grade}</div>
                            <div>{result.Chapter?.name}</div>
                          </>
                        )}
                      </div>
                      <div className="tw-font-bold">
                        {result.type?.toLowerCase() === 'lesson'
                          ? 'Bài học'
                          : result.type?.toLowerCase() === 'exam'
                            ? 'Bài kiểm tra'
                            : result.type?.toLowerCase() === 'exercise'
                              ? 'Bài tập'
                              : capitalizeFirstLetter(result.type)}: {result.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không có kết quả nào.</p>
          )}
        </div>
      </div>
      <div className='tw-flex tw-justify-center tw-mt-10 md:tw-mt-5 lg:tw-mt-3'>
        <CustomPagination
          count={totalPage}
          page={page}
          onChange={(_, page) => handleChangeResultPagination(page)}
          boundaryCount={1}
          siblingCount={1}
        />
      </div>
    </div>
  );
}

export default SearchResultPage;
