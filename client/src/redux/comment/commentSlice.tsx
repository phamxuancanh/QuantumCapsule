import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AxiosResponse } from 'axios';
import { getListActiveCommentByTheoryId } from '../../api/comment/coment.api';

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

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk<Comment[], string>(
  'comments/fetchComments',
  async (theoryId) => {
    const response: AxiosResponse<any> = await getListActiveCommentByTheoryId(theoryId);
    return response.data.comments;
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    postComment: (state, action: PayloadAction<Comment>) => {
        console.log(action.payload, 'action.payload');
        if (!state.comments) {
          state.comments = []; // Khởi tạo mảng nếu chưa tồn tại
        }
        state.comments.unshift(action.payload); // Thêm bình luận mới lên đầu danh sách
      },
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      });
  },
});

// Xuất các action và reducer
export const { postComment, setComments, clearComments } = commentSlice.actions;
export const selectComments = (state: RootState) => state.comments.comments;
export const selectLoading = (state: RootState) => state.comments.loading;
export const selectError = (state: RootState) => state.comments.error;

export default commentSlice.reducer;
