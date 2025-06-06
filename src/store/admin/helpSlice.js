import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/help`;

export const fetchHelpQueries = createAsyncThunk(
    "help/fetchHelpQueries",
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
export const deleteHelpQuery = createAsyncThunk(
    "help/deleteHelpQuery",
    async (id, { rejectWithValue }) => {
        try {
            if (!id) {
                throw new Error("id is required");
            }

            const token = localStorage.getItem("token");
            await api.delete(`${BASE_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete this query");
        }
    }
);
const AdminHelpSlice = createSlice({
    name: "help",
    initialState: {
        helpQueries: [],
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
            .addCase(fetchHelpQueries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHelpQueries.fulfilled, (state, action) => {
                state.loading = false;
                state.helpQueries = action.payload;
            })
            .addCase(fetchHelpQueries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteHelpQuery.fulfilled, (state, action) => {
                state.helpQueries = state.helpQueries.filter(
                    (rl) => rl.id !== action.payload
                );
            })
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default AdminHelpSlice.reducer;