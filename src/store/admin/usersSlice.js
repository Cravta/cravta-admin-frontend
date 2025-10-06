import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/users`;
const getAuthToken = () => localStorage.getItem("token");

export const fetchUsersAdmin = createAsyncThunk(
    "users/fetchUsersAdmin",
    async (params = {}, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            if (!token) throw new Error("No auth token found");

            // Build query string from params
            const queryParams = new URLSearchParams();
            if (params.searchable) {
                queryParams.append('searchable', params.searchable);
            }

            const url = queryParams.toString()
                ? `${BASE_URL}?${queryParams.toString()}`
                : BASE_URL;

            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });


            return response.data.data;
        } catch (error) {
            console.error("❌ API Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Error fetching user data"
            );
        }
    }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.post(`${BASE_URL}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data; // Assuming the created user is returned
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error creating user");
    }
  }
);
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.put(`${BASE_URL}/${payload.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data; // Assuming the updated user is returned
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error updating user");
    }
  }
);
export const deleteUserbyAdmin = createAsyncThunk(
    "users/deleteUserbyAdmin",
    async ( userId , { rejectWithValue }) => {
        try {
            if (!userId) {
                throw new Error("User ID is required");
            }

            const token = getAuthToken();
            await api.delete(`${BASE_URL}/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error deleting user");
        }
    }
);

const AdminUsersSlice = createSlice({
    name: "aminUsers",
    initialState: {
        usersList: [],
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
            .addCase(fetchUsersAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsersAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.usersList = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchUsersAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUserbyAdmin.fulfilled, (state, action) => {
                state.usersList = state.usersList.filter(
                    (user) => user.id !== action.payload
                );
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.usersList.push(action.payload);
            });
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default AdminUsersSlice.reducer;