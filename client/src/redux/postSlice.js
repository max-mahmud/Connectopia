import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../utils";

export const update_user = createAsyncThunk(
  "user/update_user",
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
      const { data } = await axios.put(`${baseURL}/post/create-post`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  posts: {},
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts(state, action) {
      state.posts = action.payload;
    },
  },
});

export default postSlice.reducer;
