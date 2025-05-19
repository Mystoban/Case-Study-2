import { createSlice } from "@reduxjs/toolkit";

const UserRedux = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    token: localStorage.getItem('token') || null,
    status: 'idle',
    loginStatus: false,
  },
  reducers: {
    LoginUser: (state, action) => {
      state.currentUser = action.payload;
      state.token = action.payload.token;
      state.status = 'success';
      state.loginStatus = true;
    },
    LogoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.status = 'idle';
      state.loginStatus = false;
      localStorage.removeItem('token');
    },
  }
});

export const { LoginUser, LogoutUser } = UserRedux.actions;
export default UserRedux.reducer;

