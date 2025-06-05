import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/content`;

export const fetchContentAdmin = createAsyncThunk(
    "content/fetchContentAdmin",
    async (page, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}/?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });


            return response.data;
        } catch (error) {
            console.error("❌ API Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Error fetching content data"
            );
        }
    }
);
export const createContent = createAsyncThunk(
  "content/createContent",
  async ({ userId,  contentData }, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const token = localStorage.getItem("token");
      const response = await api.post(
        BASE_URL,
        { ...contentData, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data; // Response contains the signed URL
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating content");
    }
  }
);

export const fetchContentById = createAsyncThunk(
  "content/fetchContentById",
  async ({ contentId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`${BASE_URL}/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data.data);

      return response.data.data; // URL of the uploaded PDF
    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message || "Error fetching content by ID"
      );
    }
  }
);
export const downloadContent = createAsyncThunk(
  "content/downloadContent",
  async ({ contentId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`${BASE_URL}/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data.data);

      return response.data.data; // URL of the uploaded PDF
    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message || "Error fetching content by ID"
      );
    }
  }
);
export const deleteContentbyAdmin = createAsyncThunk(
    "content/deleteContentbyAdmin",
    async (contentId, { rejectWithValue }) => {
        try {
            if (!contentId) {
                throw new Error("content is required");
            }

            const token = localStorage.getItem("token");
            await api.delete(`${BASE_URL}/${contentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return contentId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error deleting content");
        }
    }
);
const AdminContentsSlice = createSlice({
    name: "adminContent",
    initialState: {
        contentList: [],
        loading: false,
        error: null,
        pdfUrl: null,
        currentPage: 1,
        totalPages: 1,
        totalContent: 0,
    },
    reducers: {
        clearPdfUrl: (state) => {
          state.pdfUrl = null; 
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContentAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContentAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.contentList = Array.isArray(action.payload?.data) ? action.payload?.data : [];
                state.totalContent = action?.payload?.totalItems || 0;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchContentAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchContentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContentById.fulfilled, (state, action) => {
                state.loading = false;
                state.pdfUrl = action.payload; // Stores the fetched PDF URL
            })
            .addCase(fetchContentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createContent.fulfilled, (state, action) => {
                state.contentList.push(action.payload.data);
                state.totalContent += 1;
            })
            .addCase(deleteContentbyAdmin.fulfilled, (state, action) => {
                state.contentList = state.contentList.filter(
                    (con) => con.id !== action.payload
                );
                state.totalContent -= 1;
            });
    },
});

export const { clearPdfUrl } = AdminContentsSlice.actions;
export default AdminContentsSlice.reducer;