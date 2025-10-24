import React from 'react';
import { IoMdClose } from 'react-icons/io';
import CartContent from '../Cart/CartContent'; 
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart); // ✅ corrected here
  const userId = user ? user._id : null;

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-700 hover:text-black" />
        </button>
      </div>

      {/* Cart contents */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h1 className="text-xl font-bold mb-5">🛒 Your Cart</h1>
        {cart && cart.products?.length > 0
          ? <CartContent cart={cart} userId={userId} guestId={guestId} />
          : <p>Your cart is empty!</p>
        }
      </div>

      {/* Checkout button */}
      <div className="p-4 bg-white sticky bottom-0">
        {cart && cart.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-blue-100 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
              Shipping, Taxes and Discount codes calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
