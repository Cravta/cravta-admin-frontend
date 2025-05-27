import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/axiosInstance";

const BASE_URL = "https://cravta.com/api/v1/admin/users";
const getAuthToken = () => localStorage.getItem("token");

export const fetchUsersAdmin = createAsyncThunk(
    "users/fetchUsersAdmin",
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
                error.response?.data?.message || "Error fetching user data"
            );
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
            });
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default AdminUsersSlice.reducer;