import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/package`;

export const createPackage = createAsyncThunk(
  "package/createPackage",
  async (packageData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`${BASE_URL}`, packageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create package");
    }
  }
);

export const editPackage = createAsyncThunk(
  "package/editPackage",
  async ({ packageId, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`${BASE_URL}/${packageId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data; // Assuming API returns the updated package
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to edit package");
    }
  }
);

export const fetchPackages = createAsyncThunk(
    "package/fetchPackages",
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
                error.response?.data?.message || "Error fetching packages data"
            );
        }
    }
);
export const fetchPackageTransactions = createAsyncThunk(
    "package/fetchPackageTransactions",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}/transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });


            return response.data.data;
        } catch (error) {
            console.error("❌ API Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Error fetching packages data"
            );
        }
    }
);
export const deletePackage = createAsyncThunk(
    "packages/deletePackage",
    async (packageId, { rejectWithValue }) => {
        try {
            if (!packageId) {
                throw new Error("packageId is required");
            }

            const token = localStorage.getItem("token");
            await api.delete(`${BASE_URL}/${packageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return packageId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete this package");
        }
    }
);
const PackagesSlice = createSlice({
    name: "Packages",
    initialState: {
        packageList: [],
        transactionList: [],
        transactionLoading: false,
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
            .addCase(fetchPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packageList = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPackageTransactions.pending, (state) => {
                state.transactionLoading = true;
                state.error = null;
            })
            .addCase(fetchPackageTransactions.fulfilled, (state, action) => {
                state.transactionLoading = false;
                state.transactionList = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchPackageTransactions.rejected, (state, action) => {
                state.transactionLoading = false;
                state.error = action.payload;
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.packageList = state.packageList.filter(
                    (rl) => rl.id !== action.payload
                );
            })
            .addCase(createPackage.fulfilled, (state, action) => {
                state.packageList.push(action.payload);
            })
            .addCase(editPackage.fulfilled, (state, action) => {
                state.packageList = state.packageList.map((rl) =>
                    rl.id === action.payload.id ? action.payload : rl
                );
            })
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default PackagesSlice.reducer;