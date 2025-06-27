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
const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
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
            });
    },
});

export const { clearProducts, clearError, clearSuccess } = productSlice.actions;
export default productSlice.reducer;