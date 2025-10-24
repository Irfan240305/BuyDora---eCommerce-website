import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Helper: Get token from localStorage safely
const getAuthConfig = () => {
  const token = localStorage.getItem("userToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// =====================
// Thunks
// =====================

// 🟢 Create an Order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        orderData,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to create order";
      return rejectWithValue(message);
    }
  }
);
export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails", async (orderId, {rejectWithValue}) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// 🔵 Fetch all orders for the logged-in user
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Something went wrong";
      return rejectWithValue(message);
    }
  }
);

// 🔵 Fetch details of a specific order
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to fetch order details";
      return rejectWithValue(message);
    }
  }
);

// =====================
// Slice
// =====================
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    totalOrders: 0,
    orderDetails: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // =============================
      // Handle createOrder
      // =============================
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =============================
      // Handle fetchUserOrders
      // =============================
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =============================
      // Handle fetchOrderDetails
      // =============================
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
