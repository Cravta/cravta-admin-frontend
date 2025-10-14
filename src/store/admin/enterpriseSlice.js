import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/enterprise`;

const getAxiosConfig = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
});

// 1. Update the fetchEnterprisesAdmin thunk to pass page info
export const fetchEnterprisesAdmin = createAsyncThunk(
    "enterprise/fetchEnterprisesAdmin",
    async ({page = 1, search = ""}, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}/all?page=${page}&searchTerm=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Return the response data along with the requested page
            return {
                ...response.data,
                requestedPage: page
            };
        } catch (error) {
            console.error("❌ API Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Error fetching enterprises data"
            );
        }
    }
);

// Fetch enterprise by ID
export const fetchEnterpriseById = createAsyncThunk(
    "enterprise/fetchEnterpriseById",
    async (enterpriseId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}/${enterpriseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.data.data;
        } catch (error) {
            console.error("❌ API Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Error fetching enterprise data"
            );
        }
    }
);

// Create new enterprise
export const createEnterprise = createAsyncThunk(
    "enterprise/createEnterprise",
    async (enterpriseData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("Unauthorized: No token found. Please log in.");
            }

            const response = await api.post(`${BASE_URL}`, enterpriseData, getAxiosConfig(token));
            return response.data.data;
        } catch (error) {
            console.error("❌ API Error:", error.response?.data || error.message);
            return rejectWithValue(
                error.response?.data?.message || "Failed to create enterprise. Please try again."
            );
        }
    }
);

// Update enterprise
export const updateEnterprise = createAsyncThunk(
    'enterprise/updateEnterprise',
    async ({ enterpriseId, enterpriseData }, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("Unauthorized: No token found. Please log in.");
        }
        try {
            const response = await api.put(
                `${BASE_URL}/${enterpriseId}`,
                enterpriseData,
                getAxiosConfig(token)
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update enterprise');
        }
    }
);

// Delete enterprise
export const deleteEnterpriseByAdmin = createAsyncThunk(
    "enterprise/deleteEnterpriseByAdmin",
    async (enterpriseId, { rejectWithValue }) => {
        try {
            if (!enterpriseId) {
                throw new Error("enterpriseId is required");
            }

            const token = localStorage.getItem("token");
            await api.delete(`${BASE_URL}/${enterpriseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return enterpriseId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error deleting enterprise");
        }
    }
);

const AdminEnterpriseSlice = createSlice({
    name: "adminEnterprise",
    initialState: {
        enterpriseList: [],
        currentEnterprise: null,
        loading: false,
        error: null,
        status: 'idle',
        currentPage: 1,
        totalPages: 1,
        totalEnterprises: 0,
    },
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
        clearCurrentEnterprise: (state) => {
            state.currentEnterprise = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEnterprisesAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // 2. Update the fulfilled case
            .addCase(fetchEnterprisesAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.enterpriseList = Array.isArray(action?.payload?.data?.enterprises)
                    ? action?.payload?.data?.enterprises
                    : [];
                const pagination = action?.payload?.data?.pagination || {};
                state.totalEnterprises = pagination.totalItems || 0;
                state.totalPages = pagination.totalPages || 1;
                state.currentPage = pagination.currentPage || action.payload.requestedPage || 1;
            })
            .addCase(fetchEnterprisesAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchEnterpriseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnterpriseById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEnterprise = action.payload;
            })
            .addCase(fetchEnterpriseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteEnterpriseByAdmin.fulfilled, (state, action) => {
                state.enterpriseList = state.enterpriseList.filter(
                    (enterprise) => enterprise.id !== action.payload
                );
                state.totalEnterprises -= 1;
            })
            .addCase(createEnterprise.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createEnterprise.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.enterpriseList.push(action.payload);
                state.totalEnterprises += 1;
            })
            .addCase(createEnterprise.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to create enterprise';
            })
            .addCase(updateEnterprise.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateEnterprise.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.enterpriseList.findIndex(e => e.id === action.payload.id);
                if (index !== -1) {
                    state.enterpriseList[index] = action.payload;
                }
                if (state.currentEnterprise && state.currentEnterprise.id === action.payload.id) {
                    state.currentEnterprise = action.payload;
                }
            })
            .addCase(updateEnterprise.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to update enterprise';
            });
    },
});

export const { resetStatus, clearCurrentEnterprise } = AdminEnterpriseSlice.actions;
export default AdminEnterpriseSlice.reducer;