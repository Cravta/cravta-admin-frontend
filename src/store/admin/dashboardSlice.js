import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`;

export const fetchAdminDashboard = createAsyncThunk(
    "dashboard/fetchAdminDashboard",
    async ({filter}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}?filter=${filter}`, {
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
export const fetchReportsDashboard = createAsyncThunk(
    "dashboard/fetchReportsDashboard",
    async ({filter}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}/reports?filter=${filter}`, {
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
const AdminDashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        dashboardData: [],
        loading: false,
        error: null,
        dashboardReports: [],
        reportLoading: false,
        reportError: null
    },
    reducers: {
        // clearPdfUrl: (state) => {
        //   state.pdfUrl = null; // Clears the PDF preview when closing modal
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardData = action.payload;
            })
            .addCase(fetchAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReportsDashboard.pending, (state) => {
                state.reportLoading = true;
                state.reportError = null;
            })
            .addCase(fetchReportsDashboard.fulfilled, (state, action) => {
                state.reportLoading = false;
                state.dashboardReports = action.payload;
            })
            .addCase(fetchReportsDashboard.rejected, (state, action) => {
                state.reportLoading = false;
                state.reportError = action.payload;
            })
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default AdminDashboardSlice.reducer;