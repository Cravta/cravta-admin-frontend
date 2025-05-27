import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api, { setAccessToken } from '/src/api/axiosInstance';

const BASE_URL = 'https://cravta.com/api/v1';

// Signup thunk
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// Verify OTP thunk
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/verify-otp`, {
        email,
        otp,
      }, { withCredentials: true }); // Set cookie
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

// Login thunk (cookie-based)
export const login = createAsyncThunk(
  'auth/login',
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
  'auth/logout',
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

// Auth check via cookie (on app load or refresh)
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue('Not authenticated');
    }
  }
);
// Auth check via cookie (on app load or refresh)
// export const refreshTokenValidation = createAsyncThunk(
//   'auth/refreshToken',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`${BASE_URL}/auth/refresh_token`, {
//         withCredentials: true,
//       });
//       localStorage.setItem(response.data.token);
//
//       return response.data;
//     } catch (error) {
//       return rejectWithValue('Not authenticated');
//     }
//   }
// );


// Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset request failed');
    }
  }
);

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  otpSent: false,
  otpEmail: null,
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
      state.otpSent = false;
      state.otpEmail = null;
      state.isAuthenticated = false;
      state.tokenCheckComplete = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAuthState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.otpSent = false;
      state.otpEmail = null;
      state.passwordResetRequested = false;
    },
    setTokenCheckComplete: (state, action) => {
      state.tokenCheckComplete = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.otpSent = true;
        state.otpEmail = action.payload.email;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.otpSent = false;
        state.otpEmail = null;
      })

      .addCase(verifyOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data;
        state.otpSent = false;
        state.otpEmail = null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

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


      .addCase(checkAuth.pending, (state) => {
        state.status = 'loading';
        state.tokenCheckComplete = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.tokenCheckComplete = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.isAuthenticated = false;
        state.tokenCheckComplete = true;
      })
      // .addCase(refreshTokenValidation.pending, (state) => {
      //   state.status = 'loading';
      //   state.tokenCheckComplete = false;
      // })
      // .addCase(refreshTokenValidation.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   state.user = action.payload.user;
      //   state.isAuthenticated = true;
      //   state.tokenCheckComplete = true;
      // })
      // .addCase(refreshTokenValidation.rejected, (state) => {
      //   state.status = 'failed';
      //   state.user = null;
      //   state.isAuthenticated = false;
      //   state.tokenCheckComplete = true;
      // })

      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.passwordResetRequested = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.passwordResetRequested = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.passwordResetRequested = false;
      });
  },
});

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectOtpStatus = (state) => ({
  otpSent: state.auth.otpSent,
  otpEmail: state.auth.otpEmail,
});
export const selectPasswordResetStatus = (state) => ({
  passwordResetRequested: state.auth.passwordResetRequested,
  status: state.auth.status,
  error: state.auth.error,
});
export const selectTokenCheckComplete = (state) => state.auth.tokenCheckComplete;

// Exports
export const {
  logoutAuth,
  clearError,
  clearAuthState,
  setTokenCheckComplete,
} = authSlice.actions;

export default authSlice.reducer;
