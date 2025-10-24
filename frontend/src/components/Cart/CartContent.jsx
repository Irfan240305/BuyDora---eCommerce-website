import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin3Line } from "react-icons/ri";
import FemalePic from "../../assets/FemalePic.jpg";
import {
  fetchCart,
  updateCartItemQuantity,
  removeFromCart,
} from "../../redux/slices/cartSlice";

const CartContent = ({ userId, guestId }) => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);
  const cartProducts = cart.products || [];

useEffect(() => {
  const token = localStorage.getItem("userToken");
  const guestId = localStorage.getItem("guestId");

  if (token || guestId) {
    dispatch(fetchCart({ userId, guestId }));
  }
}, [userId, guestId, dispatch]);


  const handleQuantityChange = ({ productId, quantity, delta, size, color }) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          size,
          color,
          userId,
          guestId,
        })
      );
    }
  };

  const handleRemove = ({ productId, size, color }) => {
    dispatch(removeFromCart({ productId, userId, guestId, size, color }));
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading cart...</p>;
  }

  return (
    <div className="p-4">
      {cartProducts.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        cartProducts.map((product, index) => (
          <div
            key={`${product.productId}-${product.size}-${product.color}-${index}`}
            className="flex justify-between items-center py-4 border-b border-gray-200"
          >
            <div className="flex items-start">
              <img
                src={product.image || FemalePic}
                alt={product.name}
                className="w-20 h-24 object-cover mr-4 rounded"
              />
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Size: {product.size} | Color: {product.color}
                </p>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleQuantityChange({
                        productId: product.productId,
                        quantity: product.quantity,
                        delta: -1,
                        size: product.size,
                        color: product.color,
                      })
                    }
                    className="border rounded px-2 py-1 text-xl font-medium"
                  >
                    -
                  </button>
                  <span className="mx-4">{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange({
                        productId: product.productId,
                        quantity: product.quantity,
                        delta: 1,
                        size: product.size,
                        color: product.color,
                      })
                    }
                    className="border rounded px-2 py-1 text-xl font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="font-medium text-lg">
                Rs.{(product.price * product.quantity).toLocaleString()}
              </p>
              <button
                onClick={() =>
                  handleRemove({
                    productId: product.productId,
                    size: product.size,
                    color: product.color,
                  })
                }
              >
                <RiDeleteBin3Line className="h-6 w-6 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CartContent;
