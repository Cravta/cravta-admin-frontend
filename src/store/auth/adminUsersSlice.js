import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/user`;
const getAuthToken = () => localStorage.getItem("token");

export const fetchTeamUsers = createAsyncThunk(
    "team/fetchTeamUsers",
    async (_, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}/all`, {
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
    "team/deleteUserbyAdmin",
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

const AdminTeamSlice = createSlice({
    name: "aminUsers",
    initialState: {
        adminUsers: [],
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
            .addCase(fetchTeamUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.adminUsers = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchTeamUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUserbyAdmin.fulfilled, (state, action) => {
                state.adminUsers = state.adminUsers.filter(
                    (user) => user.id !== action.payload
                );
            });
    },
});

// export const { fetchUsersData } = AdminUsersSlice.actions;
export default AdminTeamSlice.reducer;