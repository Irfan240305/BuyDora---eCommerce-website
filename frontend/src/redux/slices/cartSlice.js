import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper: Get cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Helper: Save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Helper: Get token header
const getAuthHeader = () => {
  const token = localStorage.getItem("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ========== Thunks ========== //

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        return rejectWithValue("User not authenticated. Please login.");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, size, color, guestId, userId },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to add to cart";
      return rejectWithValue(message);
    }
  }
);

// Update quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, guestId, userId, size, color },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to update quantity";
      return rejectWithValue(message);
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          headers: getAuthHeader(),
          data: { productId, guestId, userId, size, color },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to remove item";
      return rejectWithValue(message);
    }
  }
);

// Merge guest cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId, userId },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to merge cart";
      return rejectWithValue(message);
    }
  }
);

// ========== Slice ========== //

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    };

    const handleRejected = (state, action, fallbackMessage) => {
      state.loading = false;
      state.error = typeof action.payload === "string" ? action.payload : fallbackMessage;
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, (state, action) =>
        handleRejected(state, action, "Failed to fetch cart")
      )

      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, (state, action) =>
        handleRejected(state, action, "Failed to add to cart")
      )

      .addCase(updateCartItemQuantity.pending, handlePending)
      .addCase(updateCartItemQuantity.fulfilled, handleFulfilled)
      .addCase(updateCartItemQuantity.rejected, (state, action) =>
        handleRejected(state, action, "Failed to update quantity")
      )

      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleFulfilled)
      .addCase(removeFromCart.rejected, (state, action) =>
        handleRejected(state, action, "Failed to remove from cart")
      )

      .addCase(mergeCart.pending, handlePending)
      .addCase(mergeCart.fulfilled, handleFulfilled)
      .addCase(mergeCart.rejected, (state, action) =>
        handleRejected(state, action, "Failed to merge cart")
      );
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
