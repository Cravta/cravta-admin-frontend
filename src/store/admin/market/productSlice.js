import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {toast} from "react-toastify";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin/market`;

const getAuthToken = () => localStorage.getItem("token");

// Fetch all Questions
export const fetchAllMarketProducts = createAsyncThunk(
    "market/allProducts",
    async (_, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(API_BASE_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error fetching products");
        }
    }
);
export const fetchProductById = createAsyncThunk(
    "market/fetchProductById",
    async (id, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error fetching product");
        }
    }
);
export const createProduct = createAsyncThunk(
    "market/createProduct",
    async (data, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await axios.post(`${API_BASE_URL}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error creating product");
        }
    }
)
export const createProductSignedUrl = createAsyncThunk(
    "market/createProductSignedUrl",
    async (data, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await axios.post(`${API_BASE_URL}/content-upload`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error creating signed URL");
        }
    }
)
export const downloadProductById = createAsyncThunk(
    "market/downloadProductById",
    async (id, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/download/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error fetching product");
        }
    }
);
export const fetchPreviewImages = createAsyncThunk(
    "market/fetchPreviewImages",
    async (image_ids, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            console.log('Sending image IDs to API:', image_ids);
            const response = await axios.post(`${API_BASE_URL}/preview-images`, { image_ids }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log('API response for preview images:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchPreviewImages:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Error fetching preview images");
        }
    }
);
export const fetchProductImages = createAsyncThunk(
    "market/fetchProductImages",
    async (image_ids, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            console.log('Sending image IDs to API:', image_ids);
            const response = await axios.post(`${API_BASE_URL}/product-preview-images`, { image_ids }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log('API response for preview images:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchPreviewImages:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Error fetching preview images");
        }
    }
);
export const fetchProductsStats = createAsyncThunk(
    "market/fetchProductsStats",
    async (_, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/products-stats`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log('API response for products stats:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchProductsStats:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Error fetching products stats");
        }
    }
);
export const fetchProductsWithStatus = createAsyncThunk(
    "market/fetchProductsWithStatus",
    async (_, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_BASE_URL}/products`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log('API response for products stats:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error in fetchProductsStats:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Error fetching products stats");
        }
    }
);
const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        previewImages: [],
        productStats:null,
        product: null,
        productId:null,
        loading: false,
        error: null,
        success: null,
    },
    reducers: {
        clearProducts: (state) => {
            state.products = [];
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
            .addCase(fetchAllMarketProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllMarketProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Products fetched successfully!";
                state.products = action.payload.products;
            })
            .addCase(fetchAllMarketProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Product fetched successfully!";
                state.product = action.payload;
                console.log(action.payload);
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Product created successfully!";
                state.error = null;
                // Optionally add the new product to the products array
                if (state.products && Array.isArray(state.products)) {
                    state.products.push(action.payload);
                }
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = null;
            })
            .addCase(createProductSignedUrl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProductSignedUrl.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Signed URL generated successfully!";
                state.error = null;
                // Store the product ID for reference
                const responseData = action.payload;
                state.productId = responseData.id.id || responseData.productId;
            })
            .addCase(createProductSignedUrl.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = null;
            })
            .addCase(downloadProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(downloadProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Download URL generated successfully!";
                state.error = null;
            })
            .addCase(downloadProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = null;
            })
            .addCase(fetchPreviewImages.fulfilled, (state, action) => {
                state.loading = false;
                state.previewImages = action.payload;
            })
            .addCase(fetchProductsStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsStats.fulfilled, (state, action) => {
                state.loading = false;
                state.productStats = action.payload;
                state.error = null;
            })
            .addCase(fetchProductsStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductsWithStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsWithStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Products fetched successfully!";
                state.products = action.payload.products;
            })
            .addCase(fetchProductsWithStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProducts, clearError, clearSuccess } = productSlice.actions;
// export { createProduct, createProductSignedUrl, fetchAllMarketProducts, fetchProductById };
export default productSlice.reducer;