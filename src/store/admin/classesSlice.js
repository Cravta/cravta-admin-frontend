import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/classes`;

export const fetchClassesAdmin = createAsyncThunk(
    "classes/fetchClassesAdmin",
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
                error.response?.data?.message || "Error fetching classes data"
            );
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
    },
    reducers: {
        // clearPdfUrl: (state) => {
        //   state.pdfUrl = null; // Clears the PDF preview when closing modal
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassesAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassesAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.classList = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchClassesAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteClassbyAdmin.fulfilled, (state, action) => {
                state.classList = state.classList.filter(
                    (cls) => cls.id !== action.payload
                );
            });
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default AdminClassesSlice.reducer;