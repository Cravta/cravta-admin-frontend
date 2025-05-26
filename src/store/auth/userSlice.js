import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = import.meta.env.VITE_API_BASE_URL+'/user';

// Async thunk for updating user
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await api.patch(`${BASE_URL}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Error updating user"
      );
    }
  }
);

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await api.get(`${BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });


      return response.data.data;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching user data"
      );
    }
  }
);

// Async thunk for deleting user
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await api.delete(`${BASE_URL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Error deleting user"
      );
    }
  }
);

// Async thunk for updating user preferences
export const updateUserPreferences = createAsyncThunk(
  "auth/updateUserPreferences",
  async (prefData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await api.patch(`${BASE_URL}/pref`, prefData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Error updating user preferences"
      );
    }
  }
);

// Async thunk for fetching user preferences
export const fetchUserPreferences = createAsyncThunk(
  "auth/fetchUserPreferences",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await api.get(`${BASE_URL}/pref`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Error fetching user preferences"
      );
    }
  }
);

// Initial State
const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  userType: null,
  userPreferences: null,
  status: "idle",
  prefStatus: "idle",
  error: null,
  prefError: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null;
      state.userPreferences = null;
      state.status = "idle";
      state.prefStatus = "idle";
      state.error = null;
      state.prefError = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
      state.prefError = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    resetStatus: (state) => {
      state.status = "idle";
      state.prefStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle updateUser
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userType = action.payload.user_type;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle fetchUserData
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userType = action.payload.user_type;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        // If token is invalid, clear authentication
        if (action.payload === "No auth token found") {
          state.isAuthenticated = false;
          state.token = null;
          localStorage.removeItem("token");
        }
      })

      // Handle deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
        state.token = null;
        state.userType = null;
        state.userPreferences = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle updateUserPreferences
      .addCase(updateUserPreferences.pending, (state) => {
        state.prefStatus = "loading";
        state.prefError = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.prefStatus = "succeeded";
        state.userPreferences = action.payload;
        state.prefError = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.prefStatus = "failed";
        state.prefError = action.payload;
      })

      // Handle fetchUserPreferences
      .addCase(fetchUserPreferences.pending, (state) => {
        state.prefStatus = "loading";
        state.prefError = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.prefStatus = "succeeded";
        state.userPreferences = action.payload;
        state.prefError = null;
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.prefStatus = "failed";
        state.prefError = action.payload;
      });
  },
});

// Selectors
export const selectUserType = (state) => state.auth.userType;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthUser = (state) => state.auth.user;
export const selectUserDetails = (state) => state.user.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectUserPreferences = (state) => state.user.userPreferences;
export const selectPrefStatus = (state) => state.user.prefStatus;
export const selectPrefError = (state) => state.auth.prefError;

// Actions & Reducer
export const { logout, clearError, setToken, resetStatus } = authSlice.actions;
export default authSlice.reducer;
