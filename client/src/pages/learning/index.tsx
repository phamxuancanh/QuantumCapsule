import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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
import draftToHtml from "draftjs-to-html"
import { IComment } from 'api/comment/comment.interface'
import { addComment, getListActiveCommentByTheoryId } from 'api/comment/coment.api'
import { useTranslation } from 'react-i18next'
import CommentItem from 'components/comment/comment'
import io from 'socket.io-client'

const socket = io('http://localhost:8000');
socket.on('connect', () => {
  console.log('Connected to server');
});

// socket.on('disconnect', () => {
//   console.log('Disconnected from server');
// });
declare global {
  interface Window {
    YT: any
  }
}
const Learning = () => {
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
  const [comments, setComments] = useState<IComment[]>([]);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const theoryId = queryParams.get('theoryId');

    if (theoryId) {
      fetchTheory(theoryId)
    }
  }, [location])

  const fetchTheory = async (id: string) => {
    try {
      const response = await getTheoryById(id);
      setTheory(response.data.theory);
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
  // const fetchComments = async () => {
  //   try {
  //     if (theory?.id) {
  //       const theoryId = theory.id;
        
  //       const response = await getListActiveCommentByTheoryId(theoryId);
  //       console.log('Response:', response.data.comments);
  //       setComments(response.data.comments);
  //       console.log('Comments:', comments);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching comments');
  //   }
  // };
  // useEffect(() => {
  //   fetchComments();
  // }, [theory])
  // const handleOpenComment = () => {
  //   setIsOpenedComment(true);
  // }
  // const handleCloseComment = () => {
  //   setIsOpenedComment(false);
  // }
  // const handleComment = async () => {
  //   console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  //   try {
  //     const response = await addComment({
  //       content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
  //       theoryId: theory?.id
  //     });
  //   }
  //   catch (error) {
  //     console.error('Error adding comment:', error);
  //   }
  // }
  const fetchComments = async () => {
    try {
      if (theory?.id) {
        const theoryId = theory.id;
        const response = await getListActiveCommentByTheoryId(theoryId);
        setComments(response.data.comments || []); // Cập nhật bình luận từ API
        console.log('Comments:', response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  // Lắng nghe sự kiện Socket.IO cho bình luận mới
  useEffect(() => {
    // Kết nối socket và lắng nghe sự kiện 'newComment'
    socket.on('newComment', (newComment) => {
      console.log('Received new comment via Socket.IO:', newComment);
      if (newComment.theoryId === theory?.id) {
        setComments((prevComments) => [...prevComments, newComment]);
      }
    });

    // Gọi fetchComments khi `theory` thay đổi
    fetchComments();

    // Hủy đăng ký sự kiện khi component bị unmount
    return () => {
      socket.off('newComment');
    };
  }, [theory]);

  // Mở phần bình luận
  const handleOpenComment = () => {
    setIsOpenedComment(true);
  };

  // Đóng phần bình luận
  const handleCloseComment = () => {
    setIsOpenedComment(false);
  };

  // Xử lý khi người dùng gửi bình luận
  const handleComment = async () => {
    const commentContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    
    console.log('Comment content:', commentContent);
    try {
      if (theory?.id && commentContent.trim()) {
        const response = await addComment({
          content: commentContent,
          theoryId: theory.id
        });
        
        // Sau khi bình luận được gửi thành công, thêm nó vào danh sách bình luận
        fetchComments();
        // Reset lại trạng thái editor
        setEditorState(EditorState.createEmpty());
      } else {
        console.error('Missing theoryId or comment content');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  return (
    <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-space-y-4'>
      <div className='tw-bg-blue-200 tw-w-full'>navigation</div>
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
                  defaultEditorState={editorState}
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