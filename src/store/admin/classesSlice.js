import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/classes`;

const getAxiosConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export const fetchClassesAdmin = createAsyncThunk(
    "classes/fetchClassesAdmin",
    async ({page,search}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}?page=${page}&searchTerm=${search??""}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("❌ API Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Error fetching classes data"
            );
        }
    }
);
export const createClass = createAsyncThunk(
  "classes/createClass",
  async (classData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Unauthorized: No token found. Please log in.");
      }

      const response = await api.post(`${BASE_URL}`, classData, getAxiosConfig(token));
      return response.data.data;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create class. Please try again."
      );
    }
  }
);
export const updateClass = createAsyncThunk(
  'classes/updateClass',
  async ({ classId, userId, classData }, { rejectWithValue }) => {
    if (!userId) return rejectWithValue('User ID is required');
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("Unauthorized: No token found. Please log in.");
    }
    try {
      const response = await api.patch(
        `${BASE_URL}/${classId}?userId=${userId}`,
        classData,
        getAxiosConfig(token)
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update class');
    }
  }
);
export const deleteClassbyAdmin = createAsyncThunk(
    "classes/deleteClassbyAdmin",
    async (classId, { rejectWithValue }) => {
        try {
            if (!classId) {
                throw new Error("classId is required");
            }

            const token = localStorage.getItem("token");
            await api.delete(`${BASE_URL}/${classId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return classId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error deleting class");
        }
    }
);
const AdminClassesSlice = createSlice({
    name: "aminClasses",
    initialState: {
        classList: [],
        loading: false,
        error: null,
        status: 'idle',
        currentPage: 1,
        totalPages: 1,
        totalClasses: 0,
    },
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassesAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassesAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.classList = Array.isArray(action?.payload?.data) ? action?.payload?.data : [];
                state.totalClasses = action?.payload?.totalItems || 0;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchClassesAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteClassbyAdmin.fulfilled, (state, action) => {
                state.classList = state.classList.filter(
                    (cls) => cls.id !== action.payload
                );
                state.totalClasses -= 1;
            })
            .addCase(createClass.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createClass.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.classList.push(action.payload);
                state.totalClasses += 1;
            })
            .addCase(createClass.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to create class';
            })
            .addCase(updateClass.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateClass.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.classList.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                state.classList[index] = action.payload;
                }
            })
            .addCase(updateClass.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to update class';
            })
    },
});

export const { resetStatus } = AdminClassesSlice.actions;
export default AdminClassesSlice.reducer;