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
    { value: 'lesson', label: 'Lesson' },
    { value: 'exam', label: 'Exam' },
  ];

  const classOptions = [
    { value: 1, label: 'Khối 1' },
    { value: 2, label: 'Khối 2' },
    { value: 3, label: 'Khối 3' },
    { value: 4, label: 'Khối 4' },
    { value: 5, label: 'Khối 5' },
    { value: 6, label: 'Khối 6' },
    { value: 7, label: 'Khối 7' },
    { value: 8, label: 'Khối 8' },
    { value: 9, label: 'Khối 9' },
    { value: 10, label: 'Khối 10' },
    { value: 11, label: 'Khối 11' },
    { value: 12, label: 'Khối 12' }
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
  const handleTheoryExamClick = (type: 'theory' | 'exam' | 'lesson', id: string) => {
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
  return (
    <div className="tw-mt-4 tw-flex tw-items-center tw-flex-col">
      <div className='tw-w-4/5 tw-p-2'>
        <h2 className="tw-text-lg tw-font-bold">Bộ lọc tìm kiếm</h2>
        <div className="tw-flex tw-space-x-4 tw-mb-4">
          <div className="tw-w-1/3">
            <label className="tw-block tw-mb-1">Chọn môn học:</label>
            <Select
              options={subjects}
              value={subjects.find(option => option.value === selectedSubject)}
              onChange={handleSubjectChange}
              placeholder="Tất cả môn học"
            />
          </div>

          <div className="tw-w-1/3">
            <label className="tw-block tw-mb-1">Chọn loại học liệu:</label>
            <Select
              options={typeOptions as any}
              value={typeOptions.find(option => option.value === selectedType)}
              onChange={handleTypeChange}
              placeholder="Tất cả loại"
            />
          </div>

          <div className="tw-w-1/3">
            <label className="tw-block tw-mb-1">Chọn lớp:</label>
            <Select
              options={classOptions as any}
              value={classOptions.find(option => option.value === Number(selectedGrade))}
              onChange={handleClassChange}
              placeholder="Tất cả lớp"
            />
          </div>
        </div>
      </div>
      <div className='tw-w-4/5 tw-p-2'>
        <h2 className="tw-text-lg tw-font-bold">Kết quả tìm kiếm:</h2>
        <div className='tw-flex tw-flex-col tw-space-y-3'>
          {results?.data?.length > 0 ? (
            results?.data?.map((result: any) => (
              <div>
                <div key={result.id} className="tw-py-2 tw-border-b tw-rounded-md tw-cursor-pointer tw-bg-slate-200 tw-p-2" onClick={() => handleTheoryExamClick(result?.type, result?.id)}>
                <div className="tw-flex tw-space-x-2">
                    <div>{result.Chapter?.Subject?.name}</div>
                    <div>{result.Chapter?.grade}</div>
                  </div>
                  <div className='tw-font-bold'>
                    {result.name} ({capitalizeFirstLetter(result.type)}) 
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
