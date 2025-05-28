import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/content`;

export const fetchContentAdmin = createAsyncThunk(
    "content/fetchContentAdmin",
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
                error.response?.data?.message || "Error fetching content data"
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
    name: "aminContent",
    initialState: {
        contentList: [],
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
            .addCase(fetchContentAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContentAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.contentList = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchContentAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteContentbyAdmin.fulfilled, (state, action) => {
                state.contentList = state.contentList.filter(
                    (con) => con.id !== action.payload
                );
            });
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default AdminContentsSlice.reducer;