import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api, { setAccessToken } from '/src/api/axiosInstance';

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin`;

// Login thunk (cookie-based)
export const login = createAsyncThunk(
  'admin/login',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${BASE_URL}/auth/login`,
        { email, password, rememberMe },
        { withCredentials: true }
      );
      setAccessToken(response.data.token); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Login thunk (cookie-based)
export const logOut = createAsyncThunk(
  'admin/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const fetchUserData = createAsyncThunk(
  "admin/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await api.get(`${BASE_URL}/user/`, {
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


// Forgot Password
// export const forgotPassword = createAsyncThunk(
//   'auth/forgotPassword',
//   async (email, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
//         email,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Password reset request failed');
//     }
//   }
// );

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  rights: [],
  isAuthenticated: false,
  passwordResetRequested: false,
  tokenCheckComplete: false, // Optional: for route guards
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutAuth: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.rights = [];
      state.isAuthenticated = false;
      state.tokenCheckComplete = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.passwordResetRequested = false;
    },
    setTokenCheckComplete: (state, action) => {
      state.tokenCheckComplete = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(logOut.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data || null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = true;
      })
        .addCase(fetchUserData.pending, (state) => {
            state.status = "loading";
            state.error = null;
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.rights = action.payload.role.rights;
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
    //   .addCase(forgotPassword.pending, (state) => {
    //     state.status = 'loading';
    //     state.error = null;
    //     state.passwordResetRequested = false;
    //   })
    //   .addCase(forgotPassword.fulfilled, (state) => {
    //     state.status = 'succeeded';
    //     state.passwordResetRequested = true;
    //     state.error = null;
    //   })
    //   .addCase(forgotPassword.rejected, (state, action) => {
    //     state.status = 'failed';
    //     state.error = action.payload;
    //     state.passwordResetRequested = false;
    //   });
  },
});

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectTokenCheckComplete = (state) => state.auth.tokenCheckComplete;

// Exports
export const {
  logoutAuth,
  clearError,
  clearAuthState,
  setTokenCheckComplete,
} = authSlice.actions;

export default authSlice.reducer;
