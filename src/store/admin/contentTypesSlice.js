import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/content-types`;

// Fetch all content types with pagination and filtering
export const fetchContentTypes = createAsyncThunk(
    "contentTypes/fetchContentTypes",
    async ({ page = 1, limit = 10, is_active }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            let url = `${BASE_URL}?page=${page}&limit=${limit}`;
            if (is_active !== undefined) {
                url += `&is_active=${is_active}`;
            }

            const response = await api.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data);
            return rejectWithValue(
                error.response?.data?.message || "Error fetching content types"
            );
        }
    }
);

// Create new content type
export const createContentType = createAsyncThunk(
    "contentTypes/createContentType",
    async (contentTypeData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.post(
                BASE_URL,
                contentTypeData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Error creating content type"
            );
        }
    }
);

// Fetch content type by ID
export const fetchContentTypeById = createAsyncThunk(
    "contentTypes/fetchContentTypeById",
    async (contentTypeId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}/${contentTypeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Error fetching content type"
            );
        }
    }
);

// Update content type
export const updateContentType = createAsyncThunk(
    "contentTypes/updateContentType",
    async ({ id, ...contentTypeData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.put(
                `${BASE_URL}/${id}`,
                contentTypeData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Error updating content type"
            );
        }
    }
);

// Delete content type
export const deleteContentType = createAsyncThunk(
    "contentTypes/deleteContentType",
    async (contentTypeId, { rejectWithValue }) => {
        try {
            if (!contentTypeId) {
                throw new Error("Content type ID is required");
            }

            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            await api.delete(`${BASE_URL}/${contentTypeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return contentTypeId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Error deleting content type"
            );
        }
    }
);

// Health check for content types
export const checkContentTypesHealth = createAsyncThunk(
    "contentTypes/checkHealth",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No auth token found");

            const response = await api.get(`${BASE_URL}/health`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Error checking health"
            );
        }
    }
);

const contentTypesSlice = createSlice({
    name: "contentTypes",
    initialState: {
        contentTypesList: [],
        selectedContentType: null,
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalContentTypes: 0,
        healthStatus: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedContentType: (state) => {
            state.selectedContentType = null;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        resetContentTypes: (state) => {
            state.contentTypesList = [];
            state.selectedContentType = null;
            state.currentPage = 1;
            state.totalPages = 1;
            state.totalContentTypes = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch content types
            .addCase(fetchContentTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContentTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.contentTypesList = Array.isArray(action.payload?.data)
                    ? action.payload.data
                    : [];
                state.totalContentTypes = action.payload?.pagination?.total || 0;
                state.currentPage = action.payload?.pagination?.page || 1;
                state.totalPages = action.payload?.pagination?.totalPages || 1;
            })
            .addCase(fetchContentTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create content type
            .addCase(createContentType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createContentType.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.data) {
                    state.contentTypesList.push(action.payload.data);
                    state.totalContentTypes += 1;
                }
            })
            .addCase(createContentType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch content type by ID
            .addCase(fetchContentTypeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContentTypeById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedContentType = action.payload;
            })
            .addCase(fetchContentTypeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update content type
            .addCase(updateContentType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateContentType.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.data) {
                    const index = state.contentTypesList.findIndex(
                        (ct) => ct.id === action.payload.data.id
                    );
                    if (index !== -1) {
                        state.contentTypesList[index] = action.payload.data;
                    }
                    // Update selected content type if it's the same one
                    if (state.selectedContentType?.id === action.payload.data.id) {
                        state.selectedContentType = action.payload.data;
                    }
                }
            })
            .addCase(updateContentType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete content type
            .addCase(deleteContentType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteContentType.fulfilled, (state, action) => {
                state.loading = false;
                state.contentTypesList = state.contentTypesList.filter(
                    (ct) => ct.id !== action.payload
                );
                state.totalContentTypes -= 1;
                // Clear selected content type if it was deleted
                if (state.selectedContentType?.id === action.payload) {
                    state.selectedContentType = null;
                }
            })
            .addCase(deleteContentType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Health check
            .addCase(checkContentTypesHealth.fulfilled, (state, action) => {
                state.healthStatus = action.payload;
            });
    },
});

export const {
    clearError,
    clearSelectedContentType,
    setCurrentPage,
    resetContentTypes
} = contentTypesSlice.actions;

export default contentTypesSlice.reducer;