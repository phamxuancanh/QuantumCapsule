import React, { useState } from 'react';
import math_on from '../../assets/icon_math_on.png';
import math_off from '../../assets/icon_math_off.png';
import literature_on from '../../assets/icon_vietnamese_literature_on.png';
import literature_off from '../../assets/icon_vietnamese_literature_off.png';
import eng_math_on from '../../assets/icon_math_english_on.png';
import eng_math_off from '../../assets/icon_math_english_off.png';
import icon_category from '../../assets/icon_category.png';
import earth from '../../assets/userCover.png';
import Select from 'react-select'
import ProgressBar from '@ramonak/react-progress-bar'
import VideocamIcon from '@mui/icons-material/Videocam'
import AssignmentIcon from '@mui/icons-material/Assignment'
import DonutLargeIcon from '@mui/icons-material/DonutLarge'
import QuizIcon from '@mui/icons-material/Quiz'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'
const SkillList = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [classes, setClasses] = useState([
        { Id: '1', Name: 'Khối 1' },
        { Id: '2', Name: 'Khối 2' },
        { Id: '3', Name: 'Khối 3' },
        { Id: '4', Name: 'Khối 4' },
        { Id: '5', Name: 'Khối 5' },
        { Id: '6', Name: 'Khối 6' },
        { Id: '7', Name: 'Khối 7' },
        { Id: '8', Name: 'Khối 8' },
        { Id: '9', Name: 'Khối 9' },
        { Id: '10', Name: 'Khối 10' },
        { Id: '11', Name: 'Khối 11' },
        { Id: '12', Name: 'Khối 12' }
    ])
    const [skillType, setSkillType] = useState('math');
    const handleSelectSkill = (skill: any) => {
        setSkillType(skill);
    };
    return (
        <div className='tw-flex tw-items-center tw-justify-center tw-bg-slate-50'>
            <div className='tw-w-3/5 tw-mt-16 tw-space-y-16'>
                <div className='tw-flex tw-space-x-10'>
                    {/* Math */}
                    <div
                        className={`tw-flex tw-space-y-2 tw-flex-col tw-justify-center tw-items-center tw-w-48 tw-bg-slate-100 tw-border tw-p-5 tw-shadow-lg tw-rounded-2xl tw-cursor-pointer hover:tw-bg-white tw-transition-colors tw-duration-300 ${skillType === 'math' ? 'tw-bg-white' : ''}`}
                        onClick={() => handleSelectSkill('math')}
                    >
                        <img src={skillType === 'math' ? math_on : math_off} alt="Math" />
                        <div className='tw-font-bold tw-text-lg'>Toán</div>
                    </div>

                    {/* Literature */}
                    <div
                        className={`tw-flex tw-space-y-2 tw-flex-col tw-justify-center tw-items-center tw-w-48 tw-bg-slate-100 tw-border tw-p-5 tw-shadow-lg tw-rounded-2xl tw-cursor-pointer hover:tw-bg-white tw-transition-colors tw-duration-300 ${skillType === 'literature' ? 'tw-bg-white' : ''}`}
                        onClick={() => handleSelectSkill('literature')}
                    >
                        <img src={skillType === 'literature' ? literature_on : literature_off} alt="Literature" />
                        <div className='tw-font-bold tw-text-lg'>Văn</div>
                    </div>

                    {/* English Math */}
                    <div
                        className={`tw-flex tw-space-y-2 tw-flex-col tw-justify-center tw-items-center tw-w-48 tw-bg-slate-100 tw-border tw-p-5 tw-shadow-lg tw-rounded-2xl tw-cursor-pointer hover:tw-bg-white tw-transition-colors tw-duration-300 ${skillType === 'eng_math' ? 'tw-bg-white' : ''}`}
                        onClick={() => handleSelectSkill('eng_math')}
                    >
                        <img src={skillType === 'eng_math' ? eng_math_on : eng_math_off} alt="English Math" />
                        <div className='tw-font-bold tw-text-lg'>Toán Tiếng Anh</div>
                    </div>
                </div>
                <div className='tw-flex tw-justify-between'>
                    <div className='tw-text-4xl tw-font-bold'>Danh sach chu diem</div>
                    <div className='tw-flex tw-space-x-5'>
                        <Select
                            id="class"
                            value={classes.find(cls => cls.Id === selectedClass) ? { value: selectedClass, label: classes.find(cls => cls.Id === selectedClass)?.Name } : null}
                            onChange={(option) => setSelectedClass(option?.value ?? '')}
                            className="tw-shadow-sm disabled:tw-bg-gray-100 tw-border-sky-500 tw-rounded-2xl"
                            options={classes.map(cls => ({ value: cls.Id, label: cls.Name }))}
                            placeholder="Chọn lớp"
                        />
                        <Select
                            id="class"
                            value={classes.find(cls => cls.Id === selectedClass) ? { value: selectedClass, label: classes.find(cls => cls.Id === selectedClass)?.Name } : null}
                            onChange={(option) => setSelectedClass(option?.value ?? '')}
                            className="tw-shadow-sm disabled:tw-bg-gray-100 tw-border-sky-500 tw-rounded-2xl"
                            options={classes.map(cls => ({ value: cls.Id, label: cls.Name }))}
                            placeholder="Chọn lớp"
                        />
                    </div>
                </div>

                <div className='tw-flex tw-w-full tw-space-x-16'>
                    <div className='tw-w-1/4 tw-border tw-rounded-2xl tw-bg-white tw-h-fit'>
                        <div className='tw-bg-green-400 tw-font-bold tw-text-lg tw-text-center tw-rounded-t-2xl tw-p-3'>Nội dung</div>
                        <div className='tw-border tw-rounded-md tw-p-1 tw-m-2'>
                            <input placeholder='Tim nhanh ki nang'></input>
                        </div>
                        <div className='tw-p-2 tw-h-[1000px] tw-rounded-2xl tw-overflow-y-auto tw-space-y-2'>
                            <div className='tw-bg-blue-200 tw-border tw-rounded-2xl tw-flex tw-p-5 tw-space-x-2'>
                                <PanoramaFishEyeIcon />
                                <div className='tw-flex tw-flex-col'>
                                    <div className='tw-font-bold tw-text-lg'>Cac so tu 0 toi 10</div>
                                    <div className='tw-text-slate-500'>Chu diem: 5</div>
                                    <div className='tw-text-slate-500'>Chu diem: 5</div>
                                </div>
                            </div>
                            <div className='tw-bg-blue-200 tw-border tw-rounded-2xl tw-flex tw-p-5 tw-space-x-2'>
                                <PanoramaFishEyeIcon />
                                <div className='tw-flex tw-flex-col'>
                                    <div className='tw-font-bold tw-text-lg'>Cac so tu 0 toi 10</div>
                                    <div className='tw-text-slate-500'>Chu diem: 5</div>
                                    <div className='tw-text-slate-500'>Chu diem: 5</div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className='tw-flex-col tw-w-3/4 tw-border tw-space-y-10'>
                        <div className='tw-w-full tw-border tw-rounded-2xl tw-bg-white'>
                            <div className='tw-flex tw-justify-between tw-border-b tw-border-dashed tw-p-5 tw-mx-4'>
                                <div className='tw-flex tw-space-x-3 tw-w-1/2'>
                                    <img src={icon_category} alt="icon_category" />
                                    <div className='tw-text-2xl tw-font-bold'>Cac so tu 11 den 20</div>
                                </div>
                                <ProgressBar
                                    bgColor='orange'
                                    className='tw-w-1/3'
                                    maxCompleted={100}
                                    completed={70}
                                />
                            </div>
                            <div className='tw-flex tw-justify-between tw-p-5'>
                                <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                    <div className='tw-font-bold tw-text-2xl'>0/2</div>
                                    <div>Chu diem</div>
                                </div>
                                <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                    <div className='tw-font-bold tw-text-2xl'>0/2</div>
                                    <div>Bai kiem tra</div>
                                </div>
                                <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                    <div className="tw-border-4 tw-border-gray-500 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                    <div>Chua thuc hanh</div>
                                </div>
                                <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                    <div className="tw-border-4 tw-border-sky-700 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                    <div>Dang thuc hanh</div>
                                </div>
                                <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                    <div className="tw-border-4 tw-border-green-700 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                    <div>Da hoan thanh</div>
                                </div>
                                <div className='tw-flex tw-items-center tw-justify-center tw-space-x-1'>
                                    <div className="tw-border-4 tw-border-orange-700 tw-w-5 tw-h-5 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-1"></div>
                                    <div>Chu diem con yeu</div>
                                </div>
                            </div>
                        </div>

                        <div className='tw-bg-white tw-border tw-rounded-2xl'>
                            <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-p-5">
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <div className="tw-relative tw-rounded-t-2xl overflow-hidden">
                                        <img src={earth} className="tw-rounded-t-2xl tw-transition-opacity tw-duration-300 tw-w-full tw-h-auto" />
                                        <div className="tw-absolute tw-inset-0 tw-bg-black tw-opacity-0 hover:tw-opacity-50 tw-transition-opacity tw-duration-300 tw-flex tw-justify-center tw-items-center tw-rounded-t-2xl">
                                            <VideocamIcon className="tw-mx-2 tw-text-white tw-cursor-pointer" />
                                            <AssignmentIcon className="tw-mx-2 tw-text-white tw-cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-cursor-pointer'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-cursor-pointer'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center tw-cursor-pointer'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm tw-cursor-pointer'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm tw-cursor-pointer'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm tw-cursor-pointer'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm tw-cursor-pointer'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='tw-font-bold tw-text-xl tw-px-6 tw-py-2'><QuizIcon fontSize='large' />BAI KIEM TRA</div>
                            <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-p-5">
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tw-bg-white tw-border tw-rounded-2xl tw-space-y-3">
                                    <img src={earth} className="tw-rounded-t-2xl" />
                                    <div className='tw-mx-5 tw-font-bold tw-text-lg'>1. Cac so 1 2 3</div>
                                    <div className='tw-flex tw-justify-between tw-items-center tw-p-4'>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <VideocamIcon />
                                            <div className='tw-text-center tw-text-sm'>VIDEO LY THUYET</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <AssignmentIcon />
                                            <div className='tw-text-center tw-text-sm'>THUC HANH</div>
                                        </div>
                                        <div className='tw-flex tw-flex-col tw-justify-center tw-items-center'>
                                            <DonutLargeIcon />
                                            <div className='tw-text-center tw-text-sm'>TIEN DO</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillList;
