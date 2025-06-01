import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/quiz`;

export const fetchQuizzesAdmin = createAsyncThunk(
    "quiz/fetchQuizzesAdmin",
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
                error.response?.data?.message || "Error fetching quiz data"
            );
        }
    }
);
export const manualCreateActivity = createAsyncThunk(
  "quiz/manualCreateActivity",
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${BASE_URL}/manual`, activityData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new activity from template
export const createActivityFromTemplate = createAsyncThunk(
  "quiz/createActivityFromTemplate",
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${BASE_URL}/template`, activityData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new activity from prompt
export const createActivityFromPromt = createAsyncThunk(
  "quiz/createActivityFromPrompt",
  async (activityData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${BASE_URL}/prompt`, activityData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteQuizbyAdmin = createAsyncThunk(
    "quiz/deleteQuizbyAdmin",
    async (quizId, { rejectWithValue }) => {
        try {
            if (!quizId) {
                throw new Error("quizId is required");
            }

            const token = localStorage.getItem("token");
            await api.delete(`${BASE_URL}/${quizId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return quizId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error deleting quiz");
        }
    }
);
const AdminQuizSlice = createSlice({
    name: "aminQuiz",
    initialState: {
        quizList: [],
        loading: false,
        error: null,
    },
    reducers: {
        // clearPdfUrl: (state) => {
        //   state.pdfUrl = null; // Clears the PDF preview when closing modal
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizzesAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuizzesAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.quizList = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchQuizzesAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteQuizbyAdmin.fulfilled, (state, action) => {
                state.quizList = state.quizList.filter(
                    (quiz) => quiz.id !== action.payload
                );
            });
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default AdminQuizSlice.reducer;