import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../utils";

export const create_post = createAsyncThunk(
  "user/create_post",
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
    const { token } = getState().user;
    if (!token) {
      return rejectWithValue({ message: "Token is missing" });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(`${baseURL}/post/create-post`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_posts = createAsyncThunk(
  "user/get_posts",
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
    const { token } = getState().user;
    if (!token) {
      return rejectWithValue({ message: "Token is missing" });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(`${baseURL}/post/`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_post = createAsyncThunk(
  "user/get_post",
  async (userId, { rejectWithValue, fulfillWithValue, getState }) => {
    const { token } = getState().user;
    if (!token) {
      return rejectWithValue({ message: "Token is missing" });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(`${baseURL}/post/get-user-post/${userId}`, null, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const delete_postt = createAsyncThunk(
  "user/delete_postt",
  async (id, { rejectWithValue, fulfillWithValue, getState }) => {
    const { token } = getState().user;
    if (!token) {
      return rejectWithValue({ message: "Token is missing" });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.delete(`${baseURL}/post/${id}`, null, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const comment_post = createAsyncThunk(
  "user/comment_post",
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
    const { token } = getState().user;
    if (!token) {
      return rejectWithValue({ message: "Token is missing" });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(`${baseURL}/post/comment/${info.id}`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_comments = createAsyncThunk(
  "user/get_comments",
  async (postId, { rejectWithValue, fulfillWithValue, getState }) => {
    const { token } = getState().user;
    if (!token) {
      return rejectWithValue({ message: "Token is missing" });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(`${baseURL}/post/comments/${postId}`, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const like_post = createAsyncThunk(
  "user/like_post",
  async (postId, { rejectWithValue, fulfillWithValue, getState }) => {
    console.log(postId);
    const { token } = getState().user;
    if (!token) {
      return rejectWithValue({ message: "Token is missing" });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.get(`${baseURL}/post/like/${postId}`, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const reply_comment = createAsyncThunk(
  "user/reply_comment",
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
    const { token } = getState().user;
    if (!token) {
      return rejectWithValue({ message: "Token is missing" });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(`${baseURL}/post/reply-comment/${info.id}`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  posts: {},
  UserPost: [],
  comments: [],
  loader: false,
  postSuccess: "",
  postError: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    PostmessageClear: (state, actions) => {
      state.postError = "";
      state.postSuccess = "";
    },
  },
  extraReducers: {
    [create_post.pending]: (state, { payload }) => {
      state.loader = true;
    },
    [create_post.fulfilled]: (state, { payload }) => {
      state.loader = false;
      // state.posts = payload.data;
      state.postSuccess = payload.message;
    },
    [create_post.rejected]: (state, { payload }) => {
      state.loader = false;
      state.postError = payload.message;
    },
    [delete_postt.pending]: (state, { payload }) => {
      state.loader = true;
    },
    [delete_postt.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.postSuccess = payload.message;
    },
    [delete_postt.rejected]: (state, { payload }) => {
      state.loader = false;
      state.postError = payload.message;
    },
    [get_posts.fulfilled]: (state, { payload }) => {
      state.posts = payload.data;
    },
    [get_post.fulfilled]: (state, { payload }) => {
      state.UserPost = payload.data;
    },
    [comment_post.pending]: (state, { payload }) => {
      // state.loader = true;
    },
    [comment_post.fulfilled]: (state, { payload }) => {
      state.postSuccess = payload.message;
      // state.loader = false;
    },
    [comment_post.rejected]: (state, { payload }) => {
      state.postError = payload.message;
      // state.loader = false;
    },
    [get_comments.fulfilled]: (state, { payload }) => {
      state.comments = payload.data;
    },
    [like_post.fulfilled]: (state, { payload }) => {
      state.postSuccess = payload.message;
    },
  },
});
export const { PostmessageClear } = postSlice.actions;
export default postSlice.reducer;
