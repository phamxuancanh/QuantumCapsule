import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getTheoryById } from 'api/theory/theory.api'
import { ITheory } from 'api/theory/theory.interface'
import YouTube from 'react-youtube'
import Tooltip from '@mui/material/Tooltip'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ReplayIcon from '@mui/icons-material/Replay'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from 'redux/store'
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { convertToRaw, EditorState } from "draft-js"
import { fetchUser, selectUser } from '../../redux/auth/authSlice'
import { selectComments, postComment, fetchComments, setComments } from '../../redux/comment/commentSlice'
import { addComment } from 'api/comment/coment.api'
import draftToHtml from "draftjs-to-html"
import { useTranslation } from 'react-i18next'
import CommentItem from 'components/comment/comment'
import socket from 'services/socket/socket'
import ROUTES from 'routes/constant'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
interface Comment {
  id?: string;
  theoryId?: string;
  userId?: string;
  status?: boolean;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isView?: boolean;
  User?: any;
}
declare global {
  interface Window {
    YT: any
  }
}
const Learning = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const userRedux = useSelector(selectUser)
  useEffect(() => {
    if (userRedux?.id) {
      dispatch(fetchUser())
    }
  }, []);
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [currentTab, setCurrentTab] = useState(0)
  const [isOpenedComment, setIsOpenedComment] = useState(false)
  const [theory, setTheory] = useState<ITheory | null>(null);
  const location = useLocation();
  const comments = useSelector(selectComments);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const theoryId = queryParams.get('theoryId');

    if (theoryId) {
      fetchTheory(theoryId);
      dispatch(fetchComments(theoryId) as any);
    }

  }, [location, dispatch]);

  const fetchTheory = async (id: string) => {
    try {
      const response = await getTheoryById(id);
      setTheory(response.data.data);
    } catch (error) {
      console.error('Error fetching theory:', error);
    }
  }
  const opts = {
    height: '750',
    width: '100%',
    playerVars: {
      autoplay: 0,
      allowFullscreen: true
    }
  }

  const handleOpenComment = () => {
    setIsOpenedComment(true);
  };

  const handleCloseComment = () => {
    setIsOpenedComment(false);
  };

  useEffect(() => {
    const handleNewComment = (newComment: Comment) => {
      console.log('Received new comment via Socket.IO:', newComment);
      dispatch(postComment(newComment));
    };

    socket.on('newComment', handleNewComment);

    return () => {
      socket.off('newComment', handleNewComment);
    };
  }, [dispatch]);
  const handleComment = async () => {
    const commentContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    console.log('Comment content:', commentContent);
    try {
      if (theory?.id && commentContent.trim()) {
        // Gọi action Redux để thêm bình luận
        const response = await addComment({
          content: commentContent,
          theoryId: theory.id,
        });
        // dispatch(postComment(response.data.data));

        console.log('Comment response:', response.data);

        // Phát sự kiện qua Socket.IO
        socket.emit('newComment', response.data); // Gửi bình luận mới cho tất cả người dùng

        // Reset editor state
        setEditorState(EditorState.createEmpty());
      } else {
        console.error('Missing theoryId or comment content');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  const handleLessonClick = (id: string) => {
    navigate(`${ROUTES.lessonDetail}?lessonId=${id}`);
  };

  return (
    <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-4'>

      <div className=' tw-w-full tw-flex tw-justify-center'>
        <div className='tw-w-4/5 tw-space-x-4 tw-flex tw-items-center tw-pt-4'>
        <div className="tw-flex">
          <a href="/" className="tw-flex-shrink-0 tw-flex tw-items-center">
            <p className="tw-font-bold">
              <span className="sm:tw-text-sm md:tw-text-base lg:tw-text-xl xl:tw-text-xl tw-text-teal-600">Quantum</span>
              <span className="sm:tw-text-sm md:tw-text-base lg:tw-text-xl xl:tw-text-xl tw-text-amber-800">Capsule</span>
            </p>
          </a>
        </div>
        <NavigateNextIcon />
        <div className='tw-font-bold tw-text-xl tw-text-blue-500 tw-cursor-pointer hover:tw-underline' onClick={() => theory?.lessonId && handleLessonClick(theory.lessonId)}>
          {theory?.lessonName}
        </div>
        </div>
      </div>
      <div className='tw-w-4/5 tw-flex tw-flex-col tw-mt-10 tw-space-y-8'>
        <div className='tw-flex tw-flex-col tw-space-y-3'>
          <div className='tw-font-bold tw-text-2xl'>{theory?.name}</div>
        </div>
        <div className="tw-rounded-2xl tw-overflow-hidden 2xl:tw-h-[700px] xl:tw-h-[620px] md:tw-h-[600px] sm:tw-h-[500px] tw-h-[300px]">
          <YouTube
            videoId='-3D3gb5WfI0'
            opts={{ ...opts, width: '100%', height: '100%' }}
            className="tw-top-0 tw-left-0 tw-w-full tw-h-full"
          />
        </div>
      </div>
      <div className='tw-w-full tw-border-y-2 tw-flex tw-justify-center'>
        <div className='tw-flex tw-justify-between tw-w-4/5 tw-p-5'>
          <button className='tw-cursor-pointer tw-p-2 tw-bg-gray-600 tw-text-white tw-rounded-xl tw-font-bold'>Tiep tuc xem</button>
          <div className='tw-flex tw-space-x-4'>
            <div className='tw-text-sm tw-bg-green-300 tw-rounded-md tw-flex tw-justify-center tw-items-center tw-p-2'>
              <AccessTimeIcon className='tw-mr-2' />
              00 : 00
            </div>
            <div className='tw-text-sm tw-flex tw-justify-center tw-items-center tw-p-2'>
              <ReplayIcon className='tw-mr-2' />
              Hoc lai video
            </div>
            <div className='tw-text-sm tw-flex tw-justify-center tw-items-center tw-p-2'>
              <FullscreenIcon />
            </div>
          </div>
        </div>
      </div>
      <div className='tw-w-4/5 tw-mx-auto tw-pt-5'>
        <Tabs selectedIndex={currentTab} onSelect={(index) => setCurrentTab(index)}>
          <TabList className="tw-flex lg:tw-w-2/5 sm:tw-w-4/5 tw-w-full tw-mt-5">
            <Tab className="tw-flex-1 tw-cursor-pointer tw-text-center tw-py-2 tw-rounded-t-lg tw-border-b-0 tw-border-gray-300" selectedClassName='tw-bg-white tw-border-x tw-border-t tw-font-bold'>
              Tóm tắt bài giảng
            </Tab>
            <Tab className="tw-flex-1 tw-cursor-pointer tw-text-center tw-py-2 tw-rounded-t-lg tw-border-b-0 tw-border-gray-300" selectedClassName='tw-bg-white tw-border-x tw-border-t tw-font-bold'>
              Hướng dẫn sử dụng
            </Tab>
          </TabList>
          <div className="tw-border tw-border-gray-300 tw-rounded-b-lg tw-p-1 tw-h-auto">
            <TabPanel className="tw-flex tw-flex-col tw-justify-between">
              <div
                className="tw-overflow-auto tw-h-full tw-p-2 tw-scrollbar-thin tw-scrollbar-thumb-green-600 tw-scrollbar-track-gray-200"
              >
                {theory?.summary ? (
                  <div dangerouslySetInnerHTML={{ __html: theory?.summary }} />
                ) : (
                  <div className='tw-text-inherit tw-bg-gray-500'>Bài học chưa có tóm tắt</div>
                )}
              </div>
            </TabPanel>
            <TabPanel className="tw-flex tw-flex-col tw-justify-between tw-h-full">
              <div className='tw-p-4 tw-space-y-3' >
                <div>
                  Bạn phải xem đến hết Video thì mới được lưu thời gian xem.
                </div>
                <div>
                  Để đảm bảo tốc độ truyền video, QuantumCapsule lưu trữ video trên youtube. Do vậy phụ huynh tạm thời không chặn youtube để con có thể xem được bài giảng.
                </div>
              </div>
            </TabPanel>
          </div>
        </Tabs>
      </div>
      <div className='tw-w-4/5 tw-mx-auto tw-pt-5'>
        <div className='tw-flex tw-flex-col tw-space-y-3'>
          <div className='tw-font-bold tw-text-2xl'>Hỏi đáp</div>
          <div
            className={`tw-rounded tw-border tw-p-5 tw-flex tw-flex-col tw-space-y-4 ${!isOpenedComment ? 'tw-cursor-pointer' : ''}`}
            onClick={!isOpenedComment ? handleOpenComment : undefined}
          >
            <div className='tw-flex tw-items-center'>
              <img className='tw-rounded-full tw-w-10 tw-h-10 tw-border-2 tw-border-green-500' src={userRedux?.avatar} />
              <div className='tw-flex tw-font-bold tw-ml-2'>
                <div>{userRedux?.lastName}</div>
                <div>&nbsp;</div>
                <div>{userRedux?.firstName}</div>
              </div>
            </div>
            {isOpenedComment ? (
              <div className='tw-space-y-4'>
                <Editor
                  editorState={editorState}
                  onEditorStateChange={setEditorState}
                  wrapperClassName="wrapper-class tw-cursor-text"
                  editorClassName="editor-class"
                  toolbarClassName="toolbar-class"
                  placeholder='Nhập bình luận của bạn...'
                />
                <div className='tw-flex tw-justify-center tw-space-x-4 tw-p-2'>
                  <button className='tw-bg-green-500 tw-text-white tw-font-bold tw-p-2 tw-rounded-lg hover:tw-bg-green-700 tw-transition-colors tw-duration-300' onClick={handleComment}>
                    Đăng bình luận
                  </button>
                  <button className='tw-bg-gray-500 tw-text-white tw-font-bold tw-p-2 tw-rounded-lg hover:tw-bg-gray-700 tw-transition-colors tw-duration-300' onClick={handleCloseComment}>
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className='tw-text-sm tw-text-gray-500'>Bạn có thể đăng bình luận về bài học này ở đây</div>
            )}
          </div>

          <div className='tw-flex tw-flex-col tw-rounded tw-border tw-p-5 tw-overflow-auto tw-max-h-96 tw-scrollbar-thin tw-scrollbar-thumb-green-600 tw-scrollbar-track-gray-200'>
            {comments?.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;