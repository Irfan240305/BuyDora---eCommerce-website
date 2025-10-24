import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import RazorpayButton from './RazorpayButton';
import { useDispatch, useSelector } from 'react-redux';
import { createCheckout } from '../../redux/slices/checkoutSlice';
import { useEffect } from 'react';
import axios from 'axios';
const cart = {
  products: [
    {
      name: "Diamond Ring",
      size: "M",
      color: "Black",
      price: 150000,
      image: "https://picsum.photos/150?random=1",
    },
    {
      name: "Diamond Chain",
      size: "XL",
      color: "White",
      price: 170000,
      image: "https://picsum.photos/150?random=2",
    },
  ],
  totalPrice: 320000,
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {cart, loading, error} = useSelector((state) => state.cart);
  const {user} = useSelector((state) => state.auth);
  const [checkoutId, setCheckoutId] = useState(null);
  const totalPrice = cart.products.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);


  

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  //Ensure cart is loaded before proceeding
  useEffect(() => {
    if(!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async(e) => {
    e.preventDefault();
    if(cart && cart.products.length > 0) {
      const res = await dispatch(createCheckout({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "Razorpay",
        totalPrice: cart.totalPrice,
      }));
      if(res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
      
    }
  }};
  const handlePaymentSuccess = async (details) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
      { paymentStatus: "paid", paymentDetails: details },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    
    await handleFinalizeCheckout(checkoutId);
  } catch (error) {
    console.error("Payment success handling failed:", error);
  }
};

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      navigate("/order-confirmation", { state: { orderId: response.data.orderId } });


    } catch (error) {
      console.error("Error finalizing checkout:", error);
    }
  };

  if(loading) return <p>Loading Cart...</p>
  if(error) return <p>Error loading cart: {error}</p>;
  if(!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  const firstProduct = cart.products[0];


  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      
      {/* Left Section */}
      <div className='bg-white rounded-lg p-6'>
        <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          
          {/* Contact Details */}
          <h3 className='text-lg mb-4'>Contact Details</h3>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input 
              type="email"
              value={user? user.email : " "}
              className='w-full p-2 border rounded'
              disabled
            />
          </div>

          {/* Delivery Fields */}
          <h3 className='text-lg mb-4'>Delivery</h3>
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-gray-700'>First Name</label>
              <input 
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div>
              <label className='block text-gray-700'>Last Name</label>
              <input 
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                className='w-full p-2 border rounded'
                required
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Address</label>
            <input 
              type="text"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div className='mb-4 grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-gray-700'>City</label>
              <input 
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div>
              <label className='block text-gray-700'>Postal Code</label>
              <input 
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                className='w-full p-2 border rounded'
                required
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Country</label>
            <input 
              type="text"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700'>Phone</label>
            <input 
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          {/* Razorpay Section */}
          <div className='mt-6'>
            {!checkoutId ? (
              <button type="submit" className='w-full bg-black text-white py-3 rounded'>
                Continue to Payment
              </button>
            ) : (
              <div>
                <h3 className='text-lg mb-4'>Pay with Razorpay</h3>
                <RazorpayButton
                  amount={totalPrice}
                  shippingAddress={shippingAddress}
                  products={cart.products}
                  size={firstProduct?.size}
                  color={firstProduct?.color}
                  quantity={firstProduct?.quantity || 1}
                  onSuccess={handlePaymentSuccess}
                  onError={(error) => console.error("Payment Error:", error)}
                />


              </div>
            )}
          </div>

        </form>
      </div>

      {/* Right Section: Order Summary */}
      <div className='bg-gray-50 p-6 rounded-lg'>
        <h3 className='text-lg mb-4'>Order Summary</h3>
        <div className='border-t py-4 mb-4'>
          {cart.products.map((product, index) => (
            <div key={index} className='flex items-start justify-between py-2 border-b'>
              <div className='flex items-start'>
                <img src={product.image} alt={product.name} className='w-28 h-24 object-cover mr-4' />
                <div>
                  <h3 className='text-md'>{product.name}</h3>
                  <p className='text-gray-500'>Size: {product.size}</p>
                  <p className='text-gray-500'>Color: {product.color}</p>
                  <p className='text-gray-600'>Price per item: Rs {product.price.toFixed(2)}</p>
                  <p className='text-gray-600 font-medium'>Qty: {product.quantity || 1}</p>
                </div>
              </div>
              <p className="text-xl">Rs {(product.price * (product.quantity || 1)).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className='flex justify-between items-center text-lg mb-4'>
          <p>Subtotal</p>
          <p>Rs {totalPrice?.toLocaleString()}</p>
        </div>
        <div className='flex justify-between items-center text-lg'>
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className='flex justify-between items-center text-lg mt-4 border-t pt-4'>
          <p>Total</p>
          <p>Rs {totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
