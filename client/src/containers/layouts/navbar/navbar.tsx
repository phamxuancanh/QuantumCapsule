import React, { useCallback, useMemo, FC, useState } from 'react'
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
const Navbar = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const [currentUser, setCurrentUser] = useState(getFromLocalStorage<any>('persist:auth'))
  const userRole = currentUser?.currentUser.key
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
    setSuggestions([]);
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
    <header className='tw-sticky tw-top-0 tw-bg-white tw-border-b tw-border-slate-200 tw-z-30 tw-shadow-bottom tw-flex-col'>
      <div className='tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-w-full tw-flex tw-justify-center'>
        <div className="tw-flex tw-h-16 tw--mb-px tw-space-x-4 tw-w-3/4 tw-justify-center tw-px-2">
          <div className="tw-flex tw-w-1/5">
            <a href="/" className="tw-flex-shrink-0 tw-flex tw-items-center">
              <p className="tw-font-bold">
                <span className="sm:tw-text-sm md:tw-text-base lg:tw-text-xl xl:tw-text-xl tw-text-teal-600">Quantum</span>
                <span className="sm:tw-text-sm md:tw-text-base lg:tw-text-xl xl:tw-text-xl tw-text-amber-800">Capsule</span>
              </p>
            </a>
          </div>
          <div className='tw-w-3/5'>
  {data !== 'R1' && data !== 'R2' ? (
    <>
      <div className='tw-w-full tw-transition-all tw-duration-300 tw-ease-in-out tw-h-2'></div>
      <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2 tw-relative">
        <div className="tw-flex-grow tw-mx-4">
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

          {/* Gợi ý tìm kiếm */}
          {suggestions?.length > 0 && (
            <ul className="tw-absolute tw-bg-white tw-border tw-border-gray-300 tw-mt-1 tw-w-full tw-max-h-96 tw-overflow-y-auto tw-z-50 tw-shadow-2xl tw-rounded-b-lg">
              {suggestions?.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="tw-p-2 hover:tw-bg-gray-100 hover:tw-font-bold tw-cursor-pointer tw-flex tw-justify-between"
                  onClick={() => setSearchTerm(suggestion.name)}
                >
                  <div>{suggestion.name}</div>
                  <div className="tw-text-sm">({suggestion.type})</div>
                  {/* <div>{suggestion?.Chapter?.grade}</div> */}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Nút tìm */}
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
          <div className="tw-flex tw-items-center tw-space-x-3 tw-w-1/5 tw-justify-end">
            <div className="tw-flex tw-items-center tw-space-x-3">
            {data !== 'R1' && data !== 'R2' && <Notifications align="right" />}
              <hr className="tw-w-px tw-h-6 tw-bg-slate-200 tw-mx-3" />
              <UserMenu align="right" />

            </div>
          </div>
        </div>
      </div>
      {data !== 'R1' && data !== 'R2' && (
        <div className='tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-w-full tw-flex tw-justify-center tw-bg-green-400'>
          <div className="tw-flex tw-items-center tw-justify-between tw-h-16 tw--mb-px tw-w-3/5">
            <div className="tw-flex tw-items-center tw-justify-center tw-flex-1 tw-space-x-2">
              <Link to="/skill_list" className={`tw-block tw-p-4 tw-font-bold ${pathname === '/skill_list' ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
                {t('navbar.learning')}
              </Link>
              <Link to="/result_history" className={`tw-block tw-p-4 tw-font-bold ${pathname === '/result_history' ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
                {t('navbar.journal')}
              </Link>
              <Link to="/dashboard-report" className={`tw-block tw-p-4 tw-font-bold ${pathname === '/dashboard-report' ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname === '/' && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
                {t('navbar.evaluation')}
              </Link>
              <Link to="/news" className={`tw-block tw-p-4 tw-font-bold ${pathname.includes('news') ? 'tw-text-white tw-bg-green-700' : 'tw-text-white'} tw-truncate tw-transition tw-duration-150 ${pathname.includes('contact') && 'hover:tw-text-slate-200'} tw-rounded px-2`}>
                {t('navbar.news')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
