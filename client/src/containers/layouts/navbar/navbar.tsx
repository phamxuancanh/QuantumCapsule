import React, { useCallback, useMemo, FC, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'services/i18n'
import CryptoJS from 'crypto-js'
import ROUTES from 'routes/constant'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import Notifications from '../../../components/dropdown/dropdown_notification'
import UserMenu from '../../../components/dropdown/dropdown_usermenu'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { getFromLocalStorage } from 'utils/functions'
import SearchIcon from '@mui/icons-material/Search';
import { getLessonsandExams, getSuggestions } from 'api/lesson/lesson.api'
import { debounce } from 'lodash'
import { DataListLessonandExam } from 'api/lesson/lesson.interface'
import Select, { ActionMeta, SingleValue } from 'react-select';

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const [currentUser, setCurrentUser] = useState(getFromLocalStorage<any>('persist:auth'))
  const userRole = currentUser?.currentUser.key
  const userGrade = currentUser?.currentUser.grade
  const classes = [
    { value: 1, label: 'Lớp 1' },
    { value: 2, label: 'Lớp 2' },
    { value: 3, label: 'Lớp 3' },
    { value: 4, label: 'Lớp 4' },
    { value: 5, label: 'Lớp 5' },
];
  const [selectedClass, setSelectedClass] = useState<{ value: number; label: string } | null>(null);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const gradeParam = searchParams.get('grade');
    if (gradeParam) {
        const initialClass = classes.find(cls => cls.value === parseInt(gradeParam, 10));
        setSelectedClass(initialClass || null);
    } else if (userGrade) {
        const initialClass = classes.find(cls => cls.value === userGrade);
        setSelectedClass(initialClass || null);
    }
}, [location.search, userGrade]);
  const handleClassChange = (selectedClass: any) => {
    setSelectedClass(selectedClass);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('chapterId', '');
    searchParams.set('lessonId', '');
    searchParams.set('grade', selectedClass.value); // Cập nhật giá trị grade trong URL
    navigate({ search: searchParams.toString() }); // Thay đổi URL với giá trị mới
  };
//   const handleClassChange = (newValue: SingleValue<{ value: number; label: string }>, actionMeta: ActionMeta<{ value: number; label: string }>) => {
//     if (newValue) {
//         // const queryParams = new URLSearchParams(location.search);
//         // queryParams.set('grade', newValue.value.toString());
//         // queryParams.set('page', '1');
//         // navigate(`?${queryParams.toString()}`);
//     }
// };

  let data: string | undefined
  if (userRole) {
    try {
      const giaiMa = CryptoJS.AES.decrypt(userRole, 'Access_Token_Secret_#$%_ExpressJS_Authentication')
      data = giaiMa.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Decryption error:', error)
    }
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: string; name: string; type: string, Chapter: any }[]>([])
  const fetchSuggestions = debounce(async (value: string) => {
    try {
      const response = await getSuggestions(value);
      console.log(response);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 300);
  const handleSearchClick = async () => {
    const response = await getLessonsandExams({ params: { search: searchTerm } });
    console.log(response.data);
    setSuggestions([])
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    navigate(`${ROUTES.search_result}?name=${encodedSearchTerm}`);
  };
  const handleSearch = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };
  return (
    <header className='tw-text-lg tw-sticky tw-top-0 tw-bg-white tw-border-b tw-border-slate-200 tw-z-30 tw-shadow-bottom tw-flex-col'>
      <div className='tw-w-full tw-flex tw-justify-center'>
        <div className="tw-flex tw-h-16 tw-w-full tw-justify-center">
          <div className="tw-flex tw-w-1/6">
            <a href="/" className="tw-flex-shrink-0 tw-flex tw-items-center">
              <p className="tw-font-bold">
                <span className="sm:tw-text-sm md:tw-text-base lg:tw-text-xl xl:tw-text-xl tw-text-teal-600">Quantum</span>
                <span className="sm:tw-text-sm md:tw-text-base lg:tw-text-xl xl:tw-text-xl tw-text-amber-800">Capsule</span>
              </p>
            </a>
          </div>
          <div className='tw-w-2/6 tw-flex tw-items-center'>
            {data !== 'R1' && data !== 'R2' ? (
              <>
                {/* <div className='tw-w-full tw-transition-all tw-duration-300 tw-ease-in-out tw-h-2 tw-bg-red-400'></div> */}
                <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2 tw-relative tw-w-full">
                  <div className="tw-flex-grow tw-mx-4 tw-justify-center tw-items-center">
                    <div className="tw-relative">
                      <input
                        type="text"
                        placeholder={t('navbar.search_placeholder')}
                        value={searchTerm}
                        onChange={handleSearch}
                        onKeyDown={handleKeyPress}
                        className="tw-w-full tw-pl-10 tw-pr-4 tw-py-2 tw-rounded-full tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500"
                      />
                      <SearchIcon className="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-400" />
                    </div>

                    {suggestions?.length > 0 && (
                      <ul className="tw-absolute tw-bg-white tw-border tw-border-gray-300 tw-mt-1 tw-w-full tw-max-h-96 tw-overflow-y-auto tw-z-50 tw-shadow-2xl tw-rounded-b-lg">
                        {suggestions?.map((suggestion) => (
                          <li
                            key={suggestion.id}
                            className="tw-p-2 hover:tw-bg-gray-100 hover:tw-font-bold tw-cursor-pointer tw-flex tw-justify-between"
                            onClick={() => setSearchTerm(suggestion.name)}
                          >
                            <div>{suggestion.name}</div>
                            <div className="tw-text-base">
                              ({
                                suggestion.type === 'Lesson'
                                  ? 'bài học'
                                  : suggestion.type === 'Exam'
                                    ? 'bài kiểm tra'
                                    : suggestion.type === 'Exercise'
                                      ? 'bài tập'
                                      : suggestion.type
                              })
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button
                    onClick={handleSearchClick}
                    className="tw-font-bold tw-ml-4 tw-px-4 tw-py-2 tw-bg-green-500 tw-text-white tw-rounded-full hover:tw-bg-green-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-500 tw-flex-shrink-0"
                  >
                    {t('navbar.search')}
                  </button>
                </div>
              </>
            ) : (
              <div className='tw-w-full tw-h-2'></div>
            )}
          </div>
          {(ROUTES.home == pathname || ROUTES.dashboard_report == pathname) && data !== 'R1' && data !== 'R2' && (
        <div className="tw-flex tw-items-center tw-space-x-2 tw-w-auto">
          <hr className="tw-w-px tw-h-6 tw-bg-slate-200 tw-mx-3" />
          {/* <div className="tw-py-1">
            <span className="tw-font-bold">Nội dung:</span>
          </div> */}
          <Select
            value={selectedClass}
            onChange={handleClassChange}
            options={classes}
            placeholder="Chọn lớp"
            className="tw-w-auto tw-rounded-full tw-py-1 tw-px-2 tw-text-sm"
          />
          <hr className="tw-w-px tw-h-6 tw-bg-slate-200 tw-mx-3" />
        </div>
      )}
          <div className="tw-flex tw-items-center tw-space-x-3 tw-w-auto tw-justify-end">
            <div className="tw-flex tw-items-center tw-space-x-3">

              {data !== 'R1' && data !== 'R2' && <Notifications align="right" />}
              <hr className="tw-w-px tw-h-6 tw-bg-slate-200 tw-mx-3" />
              <UserMenu align="right" />
            </div>
          </div>

          {/* <div className="tw-flex tw-items-center tw-space-x-3 tw-w-1/5 tw-justify-end">
            <div className="tw-flex tw-items-center tw-space-x-3">
              {data !== 'R1' && data !== 'R2' && <Notifications align="right" />}
              <hr className="tw-w-px tw-h-6 tw-bg-slate-200 tw-mx-3" />
              <UserMenu align="right" />
              <div className='tw-flex tw-bg-red-500'>
                <div>Nội dung:</div>
                <Select
                  value={selectedClass}
                  onChange={handleClassChange}
                  options={classes}
                  placeholder="Select Class"
                  className="tw-w-1/3"
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {data !== 'R1' && data !== 'R2' && (
        <div className='tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-w-full tw-flex tw-justify-center tw-bg-green-400'>
          <div className="tw-flex tw-items-center tw-justify-between tw-h-16 tw--mb-px tw-w-3/5">
            <div className="tw-flex tw-items-center tw-justify-center tw-flex-1 tw-space-x-2">
              <Link to="/" className={`tw-block tw-p-4 tw-font-bold ${pathname === '/skill_list' ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
                {t('navbar.learning')}
              </Link>
              <Link to="/result_history" className={`tw-block tw-p-4 tw-font-bold ${pathname === '/result_history' ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
                {t('navbar.journal')}
              </Link>
              <Link to="/dashboard_report" className={`tw-block tw-p-4 tw-font-bold ${pathname === '/dashboard_report' ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
                {t('navbar.evaluation')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
