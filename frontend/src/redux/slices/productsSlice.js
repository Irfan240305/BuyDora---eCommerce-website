import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;
const getUserToken = () => `Bearer ${localStorage.getItem("userToken")}`;

// Async thunk to fetch products with filters
export const fetchProductByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection, size, color, gender, minPrice, maxPrice,
    sortBy, search, category, material, brand, limit,
  }) => {
    const query = new URLSearchParams();

    if (collection) query.append("collection", collection);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category); 
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);

    const response = await axios.get(`${API_BASE}/api/products?${query.toString()}`);
    return response.data;
  }
);

// Async thunk to fetch product details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(`${API_BASE}/api/products/${id}`);
    return response.data;
  }
);

// ✅ FIXED: Now correctly updates via products API
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    // Clean up image objects before submitting
    const cleanedImages = Array.isArray(productData.images)
      ? productData.images.filter((img) => img?.url)
      : [];

    const payload = {
      ...productData,
      images: cleanedImages,
    };

    const response = await axios.put(
      `${API_BASE}/api/products/${id}`,
      payload,
      {
        headers: {
          Authorization: getUserToken(),
        },
      }
    );
    return response.data;
  }
);

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get(`${API_BASE}/api/products/similar/${id}`);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    updatedProduct: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        console.log("✅ Updated Product received:", action.payload);
        state.updatedProduct = action.payload;
        state.selectedProduct = action.payload;

        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = Array.isArray(action.payload) ? action.payload : []; 
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
