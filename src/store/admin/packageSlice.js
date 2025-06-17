import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/role`;

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(`${BASE_URL}`, roleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data; // Assuming the API returns the created role data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create role");
    }
  }
);

export const editRole = createAsyncThunk(
  "roles/editRole",
  async ({ roleId, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`${BASE_URL}/${roleId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data; // Assuming API returns the updated role
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to edit role");
    }
  }
);

export const fetchRoles = createAsyncThunk(
    "roles/fetchRoles",
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
                error.response?.data?.message || "Error fetching roles data"
            );
        }
    }
);
export const deleteRole = createAsyncThunk(
    "roles/deleteRole",
    async (roleId, { rejectWithValue }) => {
        try {
            if (!roleId) {
                throw new Error("roleId is required");
            }

            const token = localStorage.getItem("token");
            await api.delete(`${BASE_URL}/${roleId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return roleId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete this role");
        }
    }
);
const AdminRolesSlice = createSlice({
    name: "aminRoles",
    initialState: {
        roleList: [],
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
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roleList = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.roleList = state.roleList.filter(
                    (rl) => rl.id !== action.payload
                );
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.roleList.push(action.payload);
            })
            .addCase(editRole.fulfilled, (state, action) => {
                state.roleList = state.roleList.map((rl) =>
                    rl.id === action.payload.id ? action.payload : rl
                );
            })
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default AdminRolesSlice.reducer;