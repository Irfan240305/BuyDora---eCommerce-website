import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔐 Helpers
const getUserFromStorage = () => {
  try {
    const raw = localStorage.getItem("userInfo");
    return raw ? JSON.parse(raw) : null;
  } catch {
    console.warn("Corrupted userInfo in localStorage");
    return null;
  }
};

const getGuestId = () => localStorage.getItem("guestId") || null;

// ⚙️ Initial State
const initialState = {
  user: getUserFromStorage(),
  loading: false,
  error: null,
  guestId: getGuestId(),
};

// ✅ Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        { name, email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("userToken", data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Register failed" });
    }
  }
);

// ✅ Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data.user || !data.token) throw new Error("Missing user/token");

      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("userToken", data.token);

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Login failed" });
    }
  }
);

// 🧠 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      state.user = null;
      state.error = null;
      console.log("User logged out");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
