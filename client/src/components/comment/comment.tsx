import React, { useRef, useState } from 'react';
import { IComment } from '../../api/comment/comment.interface';
import { calculateTime } from '../../utils/calculate_time';
import { useTranslation } from 'react-i18next';
import angry from '../../assets/learning/angry2.png'
import like from '../../assets/learning/like2.png'
import love from '../../assets/learning/love2.png'
import haha from '../../assets/learning/haha2.png'
import sad from '../../assets/learning/sad2.png'
import wow from '../../assets/learning/wow2.png'
import angryGif from '../../assets/learning/angry.gif'
import likeGif from '../../assets/learning/like.gif'
import loveGif from '../../assets/learning/love.gif'
import hahaGif from '../../assets/learning/haha.gif'
import sadGif from '../../assets/learning/sad.gif'
import wowGif from '../../assets/learning/wow.gif'
interface CommentItemProps {
  comment: IComment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const { t } = useTranslation();
  const [isReact, setIsReact] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const handleMouseEnter = () => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current)
    }
    setIsReact(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsReact(false)
    }, 1000)
  }
  return (
    <div className='tw-flex tw-flex-col tw-justify-center tw-mb-4 tw-space-y-3'>
      <div className='tw-flex tw-items-center'>
        <img className='tw-rounded-full tw-w-10 tw-h-10 tw-border-2 tw-border-green-500' src={comment.User.avatar} />
        <div className='tw-flex tw-font-bold tw-ml-2 tw-items-center'>
          <div>{comment.User.lastName}</div>
          <div>&nbsp;</div>
          <div>{comment.User.firstName}</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div className='tw-text-gray-400 tw-text-sm tw-font-normal'>
            {calculateTime((comment.createdAt ?? '').toString(), {
              'hôm nay': t('fdfd.today'),
              '1 ngày trước': t('fdf.1_day_ago'),
              'ngày trước': t('fd.days_ago'),
              '1 tháng trước': t('fd.one_month_ago'),
              'nửa tháng trước': t('fd.half_month_ago'),
              'tháng trước': t('fd.months_ago'),
              '1 năm trước': t('fd.one_year_ago'),
              'năm trước': t('ffd.years_ago')
            })}
          </div>
        </div>
      </div>
      <div className=''>{comment.content}</div>
          <div className='tw-flex tw-space-x-3'>
              <button className='tw-text-blue-500 tw-font-bold'
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>Thích
              </button>
        <button className='tw-text-blue-500 tw-font-bold'>Phản hồi</button>
        {isReact && (
            <div className='tw-absolute tw-transform tw-p-2 tw-bg-white tw-rounded-3xl tw-shadow-lg tw-inline-block'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
              <div className='tw-flex'>
                <div className='tw-relative tw-mr-4 tw-transform tw-transition-all tw-duration-200 hover:tw-scale-150 hover:-tw-translate-y-2 tw-cursor-pointer tw-w-8 tw-h-8' title="Like">
                  <img className='tw-absolute tw-w-full tw-h-full' src={like} alt="Like Icon" />
                  <img className='tw-absolute tw-w-full tw-h-full tw-opacity-0 hover:tw-opacity-100' src={likeGif} alt="Like Icon Gif" />
                </div>
                <div className='tw-relative tw-mr-4 tw-transform tw-transition-all tw-duration-200 hover:tw-scale-150 hover:-tw-translate-y-2 tw-cursor-pointer tw-w-8 tw-h-8' title="Love">
                  <img className='tw-absolute tw-w-full tw-h-full' src={love} alt="Love Icon" />
                  <img className='tw-absolute tw-w-full tw-h-full tw-opacity-0 hover:tw-opacity-100' src={loveGif} alt="Love Icon Gif" />
                </div>
                <div className='tw-relative tw-mr-4 tw-transform tw-transition-all tw-duration-200 hover:tw-scale-150 hover:-tw-translate-y-2 tw-cursor-pointer tw-w-8 tw-h-8' title="Haha">
                  <img className='tw-absolute tw-w-full tw-h-full' src={haha} alt="Haha Icon" />
                  <img className='tw-absolute tw-w-full tw-h-full tw-opacity-0 hover:tw-opacity-100' src={hahaGif} alt="Haha Icon Gif" />
                </div>
                <div className='tw-relative tw-mr-4 tw-transform tw-transition-all tw-duration-200 hover:tw-scale-150 hover:-tw-translate-y-2 tw-cursor-pointer tw-w-8 tw-h-8' title="Wow">
                  <img className='tw-absolute tw-w-full tw-h-full' src={wow} alt="Wow Icon" />
                  <img className='tw-absolute tw-w-full tw-h-full tw-opacity-0 hover:tw-opacity-100' src={wowGif} alt="Wow Icon Gif" />
                </div>
                <div className='tw-relative tw-mr-4 tw-transform tw-transition-all tw-duration-200 hover:tw-scale-150 hover:-tw-translate-y-2 tw-cursor-pointer tw-w-8 tw-h-8' title="Sad">
                  <img className='tw-absolute tw-w-full tw-h-full' src={sad} alt="Sad Icon" />
                  <img className='tw-absolute tw-w-full tw-h-full tw-opacity-0 hover:tw-opacity-100' src={sadGif} alt="Sad Icon Gif" />
                </div>
                <div className='tw-relative tw-transform tw-transition-all tw-duration-200 hover:tw-scale-150 hover:-tw-translate-y-2 tw-cursor-pointer tw-w-8 tw-h-8' title="Angry">
                  <img className='tw-tw-absolute tw-w-full tw-h-full' src={angry} alt="Angry Icon" />
                  <img className='tw-tw-absolute tw-w-full tw-h-full tw-opacity-0 hover:tw-opacity-100' src={angryGif} alt="Angry Icon Gif" />
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default CommentItem;