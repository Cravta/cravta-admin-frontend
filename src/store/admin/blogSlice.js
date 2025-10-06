import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosInstance.js";
import axios from "axios";

const PUBLIC_BLOG_URL = `${import.meta.env.VITE_API_BASE_URL}/blogs`;
const PRIVATE_BLOG_URL = `${import.meta.env.VITE_API_BASE_URL}/admin-blogs`;

// Helper to get token
const getAuthToken = () => localStorage.getItem("token");

// Fetch all blogs (public)
export const fetchBlogs = createAsyncThunk(
    "blogs/fetchBlogs",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.get(`${PUBLIC_BLOG_URL}?page=${data.page}&limit=${data.limit}&paginate=true`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error fetching blogs");
        }
    }
);

// Fetch blog by ID (public)
export const fetchBlogById = createAsyncThunk(
    "blogs/fetchBlogById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`${PUBLIC_BLOG_URL}/${id}`);

            return response.data.blog;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error fetching blog");
        }
    }
);

// Create blog (admin/private)
export const createBlog = createAsyncThunk(
    "blogs/createBlog",
    async (blogData, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await api.post(PRIVATE_BLOG_URL, blogData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error creating blog");
        }
    }
);

// Update blog (admin/private)
export const updateBlog = createAsyncThunk(
    "blogs/updateBlog",
    async ({ id, blogData }, { rejectWithValue }) => {
        try {
            console.log("received data", blogData)
            const token = getAuthToken();
            const response = await api.patch(`${PRIVATE_BLOG_URL}/${id}`, blogData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error updating blog");
        }
    }
);

// Delete blog (admin/private)
export const deleteBlog = createAsyncThunk(
    "blogs/deleteBlog",
    async (id, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await api.delete(`${PRIVATE_BLOG_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { id, message: response.data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error deleting blog");
        }
    }
);

// Fetch blog image presigned URL by image ID
export const fetchBlogImage = createAsyncThunk(
    "blogs/fetchBlogImage",
    async (imageId, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${PUBLIC_BLOG_URL}/images/${imageId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching blog image:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Error fetching blog image");
        }
    }
);

// Blog Slice
const blogSlice = createSlice({
    name: "blogs",
    initialState: {
        blogs: [],
        blogDetails: null,
        blogImageUrl: null,
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        clearBlogState: (state) => {
            state.blogDetails = null;
            state.success = null;
            state.error = null;
            state.blogImageUrl = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBlogById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.loading = false;
                state.blogDetails = action.payload;
            })
            .addCase(fetchBlogById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createBlog.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Blog created successfully!";
                state.blogs.body.unshift(action.payload.data); // Add to top
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBlog.pending, (state) => {
                state.loading = true;
                state.success = null;
                state.error = null;
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Blog updated successfully!";

                state.blogs.body = state.blogs.body.map((blog) =>
                    blog.id === action.payload.data.id ? action.payload.data : blog
                );
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteBlog.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Blog deleted successfully!";
                state.blogs.body = state.blogs.body.filter((blog) => blog.id !== action.payload.id);
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBlogImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogImage.fulfilled, (state, action) => {
                state.loading = false;
                state.blogImageUrl = action.payload;
            })
            .addCase(fetchBlogImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBlogState } = blogSlice.actions;
export default blogSlice.reducer;
