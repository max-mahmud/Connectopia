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
export const user_details = createAsyncThunk(
  "user/user_details",
  async (_, { rejectWithValue, getState }) => {
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
      const { data } = await axios.get(`${baseURL}/user/user-details`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const suggested_friends = createAsyncThunk(
  "user/suggested_friends",
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
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
      const { data } = await axios.post(`${baseURL}/user/suggested-friends`, _, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const friend_request = createAsyncThunk(
  "user/friend_request",
  async (frnId, { rejectWithValue, fulfillWithValue, getState }) => {
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
      const { data } = await axios.post(`${baseURL}/user/friend-request`, frnId, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_friend_request = createAsyncThunk(
  "user/get_friend_request",
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
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
      const { data } = await axios.post(`${baseURL}/user/get-friend-request`, _, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const accept_request = createAsyncThunk(
  "user/accept_request",
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
      const { data } = await axios.post(`${baseURL}/user/accept-request`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const profile_view = createAsyncThunk(
  "user/profile_view",
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
      const { data } = await axios.post(`${baseURL}/user/profile-view`, id, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const storedUser = window?.localStorage.getItem("user");
const initialState = {
  token: storedUser ? storedUser : null,
  userData: "",
  edit: false,
  successMessage: "",
  errorMessage: "",
  loader: false,
  suggetedFriends: "",
  friendRequest: "",
  userDetails: "",
  pendingRequest: [],
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
    RequestPending: (state, { payload }) => {
      // console.log(payload);
      state.pendingRequest.push({ requestTo: payload });
    },
  },
  extraReducers: {
    [user_register.pending]: (state, { payload }) => {
      state.loader = true;
    },
    [user_register.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
    [user_register.rejected]: (state, { payload }) => {
      state.errorMessage = payload.message;
      state.loader = false;
    },
    [user_login.pending]: (state, { payload }) => {
      state.loader = true;
    },
    [user_login.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.token = payload.token;
      state.loader = false;
    },
    [user_login.rejected]: (state, { payload }) => {
      state.errorMessage = payload.message;
      state.loader = false;
    },
    [get_User.fulfilled]: (state, { payload }) => {
      state.userDetails = payload.user;
    },
    [suggested_friends.fulfilled]: (state, { payload }) => {
      state.suggetedFriends = payload.data;
      state.pendingRequest = payload.pending;
    },
    [get_friend_request.fulfilled]: (state, { payload }) => {
      state.friendRequest = payload.data;
    },
    [friend_request.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
    },
    [friend_request.rejected]: (state, { payload }) => {
      state.errorMessage = payload.message;
    },
    [accept_request.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.friendRequest = payload.data;
    },
    [user_details.fulfilled]: (state, { payload }) => {
      state.userData = payload.userData;
    },
    [update_user.pending]: (state, { payload }) => {
      state.loader = true;
    },
    [update_user.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.userData = payload.updatauser;
    },
    [update_user.rejected]: (state, { payload }) => {
      state.errorMessage = payload.message;
      state.loader = false;
    },
  },
});
export const { messageClear, logout, RequestPending } = userSlice.actions;
export default userSlice.reducer;
