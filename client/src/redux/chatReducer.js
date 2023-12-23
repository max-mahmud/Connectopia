import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../utils";

export const send_message = createAsyncThunk(
  "chat/send_message",
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
    const { token } = getState().user;
    console.log(token);
    if (!token) {
      console.log("token missing");
      return rejectWithValue({ message: "Token is missing" });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.post(`${baseURL}/chat/send-message`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_msg = createAsyncThunk(
  "chat/get_msg",
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
      const { data } = await axios.get(`${baseURL}/chat/get-message/${id}`, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  loader: false,
  successMessage: "",
  errorMessage: "",
  message: [],
  newMsg: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    messageClear: (state, actions) => {
      state.successMessage = "";
      state.errorMessage = "";
    },
    updateMessage: (state, { payload }) => {
      state.message = [...state.message, payload];
    },
    myUpdateMessage: (state, { payload }) => {
      state.message = [...state.message, payload];
    },
  },
  extraReducers: {
    [send_message.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.msg;
      state.newMsg = payload.newMessage;
    },
    [get_msg.fulfilled]: (state, { payload }) => {
      state.message = payload.msg;
    },
  },
});
export const { messageClear, updateMessage, myUpdateMessage } = chatSlice.actions;
export default chatSlice.reducer;
