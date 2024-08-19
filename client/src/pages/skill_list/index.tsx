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

                <div className='tw-flex tw-w-full tw-space-x-20'>
                    <div className='tw-w-1/4 tw-border tw-rounded-2xl tw-bg-white'>FSDFSD</div>
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
                                <div className="tw-bg-blue-200 tw-border tw-rounded-2xl">
                                    <img src={earth}/>
                                </div>
                                <div className="tw-bg-blue-200 tw-border tw-rounded-2xl">
                                    Nội dung của cột 2
                                </div>
                                <div className="tw-bg-blue-200 tw-border tw-rounded-2xl">
                                    Nội dung của cột 3
                                </div>
                                <div className="tw-bg-blue-200 tw-border tw-rounded-2xl">
                                    Nội dung của cột 4
                                </div>
                                <div className="tw-bg-blue-200 tw-border tw-rounded-2xl">
                                    Nội dung của cột 4
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
