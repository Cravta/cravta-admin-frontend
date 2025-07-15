import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/sales`;

const getAuthToken = () => localStorage.getItem("token");

// Async Thunk for fetching sales summary
export const fetchSalesComission = createAsyncThunk(
  "sales/fetchSalesComission",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error fetching sales summary"
      );
    }
  }
);
export const fetchRecentTransactions = createAsyncThunk(
  "sales/fetchRecentTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/recent-transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error fetching sales summary"
      );
    }
  }
);

export const fetchSalesSummary = createAsyncThunk(
  "sales/fetchSalesSummary",
  async (salesType = "admin", { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/summary?scope=${salesType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error fetching sales summary"
      );
    }
  }
);

export const fetchSales = createAsyncThunk(
  "sales/fetchSales",
  async (salesType = "admin", { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}?scope=${salesType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error fetching sales"
      );
    }
  }
);

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    salesSummary: null,
    commission: null,
    recentTransactions: [],
    sales: [],
    selectedSale: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearSales: (state) => {
      state.sales = [];
      state.salesSummary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sales Summary
      .addCase(fetchSalesSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Sales summary fetched successfully!";
        state.salesSummary = action.payload;
      })
      .addCase(fetchSalesSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Sales
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.sales = [];
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Sales fetched successfully!";
        state.sales = action.payload.data || action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    .addCase(fetchSalesComission.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchSalesComission.fulfilled, (state, action) => {
      state.loading = false;
      state.commission = action.payload;
    })
    .addCase(fetchSalesComission.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchRecentTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchRecentTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.recentTransactions = action.payload;
    })
    .addCase(fetchRecentTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearSales, clearError, clearSuccess } = salesSlice.actions;

export default salesSlice.reducer;