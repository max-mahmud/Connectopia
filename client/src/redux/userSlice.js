import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../utils";

export const user_register = createAsyncThunk(
  "user/user_register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/auth/register`, info);
      // localStorage.setItem("user", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const user_login = createAsyncThunk(
  "user/user_login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/auth/login`, info);
      window.localStorage.setItem("user", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_User = createAsyncThunk("user/get_User", async (userId, { rejectWithValue, getState }) => {
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
    const { data } = await axios.post(`${baseURL}/user/get-user/${userId}`, null, config);
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
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
      const { data } = await axios.put(`${baseURL}/user/update-user`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const storedUser = window?.localStorage.getItem("user");
const initialState = {
  token: storedUser ? storedUser : null,
  edit: false,
  successMessage: "",
  errorMessage: "",
  loader: false,

  userDetails: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    messageClear: (state, actions) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    logout: (state) => {
      window?.localStorage.removeItem("user");
      state.token = null; // Set the token to null after logout
      state.successMessage = "";
    },
  },
  extraReducers: {
    [user_register.pending]: (state, { payload }) => {
      state.loader = true;
    },
    [user_login.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.token = payload.token;
    },
    [get_User.fulfilled]: (state, { payload }) => {
      state.userDetails = payload.user;
    },
  },
});
export const { messageClear, logout } = userSlice.actions;
export default userSlice.reducer;
