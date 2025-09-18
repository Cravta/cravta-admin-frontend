import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/promocodes`;
const getAuthToken = () => localStorage.getItem("token");

export const fetchPromoCodes = createAsyncThunk(
    "promoCodes/fetchPromoCodes",
    async (_, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
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
                error.response?.data?.message || "Error fetching promo codes data"
            );
        }
    }
);

export const fetchPromoCodeUsage = createAsyncThunk(
    "promoCodes/fetchPromoCodeUsage",
    async (params = {}, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            if (!token) throw new Error("No auth token found");

            const { page = 1, search, startDate, endDate, promoCodeId } = params;

            // Build query string
            const queryParams = new URLSearchParams();
            queryParams.append('page', page);
            if (search) queryParams.append('search', search);
            if (startDate) queryParams.append('startDate', startDate);
            if (endDate) queryParams.append('endDate', endDate);
            if (promoCodeId) queryParams.append('promoCodeId', promoCodeId);

            const response = await api.get(`${BASE_URL}/usage?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            console.error("❌ API Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Error fetching promo code usage data"
            );
        }
    }
);

export const createPromoCode = createAsyncThunk(
    "promoCodes/createPromoCode",
    async (payload, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await api.post(`${BASE_URL}/`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error creating promo code");
        }
    }
);

export const updatePromoCode = createAsyncThunk(
    "promoCodes/updatePromoCode",
    async (payload, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await api.put(`${BASE_URL}/${payload.id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error updating promo code");
        }
    }
);

export const deletePromoCode = createAsyncThunk(
    "promoCodes/deletePromoCode",
    async (promoCodeId, { rejectWithValue }) => {
        try {
            if (!promoCodeId) {
                throw new Error("Promo code ID is required");
            }

            const token = getAuthToken();
            await api.delete(`${BASE_URL}/${promoCodeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return promoCodeId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error deleting promo code");
        }
    }
);

export const togglePromoCode = createAsyncThunk(
    "promoCodes/togglePromoCode",
    async (promoCodeId, { rejectWithValue }) => {
        try {
            if (!promoCodeId) {
                throw new Error("Promo code ID is required");
            }

            const token = getAuthToken();
            const response = await api.patch(`${BASE_URL}/${promoCodeId}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error toggling promo code status");
        }
    }
);

const AdminPromoCodesSlice = createSlice({
    name: "adminPromoCodes",
    initialState: {
        promoCodesList: [],
        usageList: [],
        usagePagination: { totalItems: 0, currentPage: 1, totalPages: 0 },
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch promo codes
            .addCase(fetchPromoCodes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPromoCodes.fulfilled, (state, action) => {
                state.loading = false;
                state.promoCodesList = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchPromoCodes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch promo code usage
            .addCase(fetchPromoCodeUsage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPromoCodeUsage.fulfilled, (state, action) => {
                state.loading = false;
                state.usageList = Array.isArray(action.payload.data) ? action.payload.data : [];
                state.usagePagination = {
                    totalItems: action.payload.totalItems || 0,
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 0,
                };
            })
            .addCase(fetchPromoCodeUsage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create promo code
            .addCase(createPromoCode.fulfilled, (state, action) => {
                state.promoCodesList.push(action.payload);
            })
            .addCase(createPromoCode.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update promo code
            .addCase(updatePromoCode.fulfilled, (state, action) => {
                const index = state.promoCodesList.findIndex(
                    (promoCode) => promoCode.id === action.payload.id
                );
                if (index !== -1) {
                    state.promoCodesList[index] = action.payload;
                }
            })
            .addCase(updatePromoCode.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete promo code
            .addCase(deletePromoCode.fulfilled, (state, action) => {
                state.promoCodesList = state.promoCodesList.filter(
                    (promoCode) => promoCode.id !== action.payload
                );
            })

            // Toggle promo code status
            .addCase(togglePromoCode.fulfilled, (state, action) => {
                const index = state.promoCodesList.findIndex(
                    (promoCode) => promoCode.id === action.payload.id
                );
                if (index !== -1) {
                    state.promoCodesList[index] = action.payload;
                }
            });
    },
});

export const { clearError } = AdminPromoCodesSlice.actions;
export default AdminPromoCodesSlice.reducer;