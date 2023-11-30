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
    console.log(info);
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

const initialState = {
  posts: {},
  UserPost: {},
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts(state, action) {
      state.posts = action.payload;
    },
  },
  extraReducers: {
    [get_posts.fulfilled]: (state, { payload }) => {
      state.posts = payload.data;
    },
    [get_post.fulfilled]: (state, { payload }) => {
      state.UserPost = payload.data;
    },
  },
});

export default postSlice.reducer;
