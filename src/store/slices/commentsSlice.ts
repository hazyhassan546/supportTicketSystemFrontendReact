import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commentsApi from "../../api/commentsApi";
import type { Comment } from "../../api/commentsApi";

type CommentsState = {
  comments: Comment[];
  loading: boolean;
  posting: boolean;
  deleting: boolean;
  error: string | null;
};

const initialState: CommentsState = {
  comments: [],
  loading: false,
  posting: false,
  deleting: false,
  error: null,
};

export const fetchComments = createAsyncThunk<Comment[], number>(
  "comments/fetchAll",
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await commentsApi.getComments(ticketId);
      return response.data.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to load comments.";
      return rejectWithValue(message);
    }
  },
);

export const postCommentAction = createAsyncThunk<
  Comment,
  { ticketId: number; comment: string }
>("comments/post", async ({ ticketId, comment }, { rejectWithValue }) => {
  try {
    const response = await commentsApi.postComment(ticketId, comment);
    return response.data.data;
  } catch (err: unknown) {
    const message =
      (err as { response?: { data?: { message?: string } } }).response?.data
        ?.message ?? "Failed to post comment.";
    return rejectWithValue(message);
  }
});

export const deleteCommentAction = createAsyncThunk<
  number,
  { ticketId: number; commentId: number }
>(
  "comments/delete",
  async ({ ticketId, commentId }, { rejectWithValue }) => {
    try {
      await commentsApi.deleteComment(ticketId, commentId);
      return commentId;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to delete comment.";
      return rejectWithValue(message);
    }
  },
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments(state) {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(postCommentAction.pending, (state) => {
        state.posting = true;
        state.error = null;
      })
      .addCase(postCommentAction.fulfilled, (state, action) => {
        state.posting = false;
        state.comments.push(action.payload);
      })
      .addCase(postCommentAction.rejected, (state, action) => {
        state.posting = false;
        state.error = action.payload as string;
      })

      .addCase(deleteCommentAction.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCommentAction.fulfilled, (state, action) => {
        state.deleting = false;
        state.comments = state.comments.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCommentAction.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
