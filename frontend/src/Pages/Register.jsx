import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RegisterImage from "../assets/Registratin2.jpg"; // ✅ Renamed to avoid conflict
import { registerUser } from '../redux/slices/authSlice';
import { useDispatch } from "react-redux";
import { useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice'; 
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Needed to redirect
  const location = useLocation(); // ✅ Needed to access URL query
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const loading = useSelector((state) => state.auth.loading);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

useEffect(() => {
  if ((location.pathname === "/register" || location.pathname === "/login") && user) {
    dispatch(logoutUser());
  }
}, [location.pathname, user, dispatch]);


useEffect(() => {
  if ((location.pathname === "/login" || location.pathname === "/register") && user) {
    dispatch(logoutUser());
  }
}, [location.pathname, user, dispatch]);


useEffect(() => {
  const isOnLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";

  if (!loading && user && !isOnLoginOrRegister) {
    if (cart?.products?.length > 0 && guestId) {
      dispatch(mergeCart({ guestId, user })).then(() => {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      });
    } else {
      navigate(isCheckoutRedirect ? "/checkout" : "/");
    }
  }
}, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch, loading, location.pathname]);



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await dispatch(registerUser({ name, email, password })).unwrap(); // ✅ await for completion
    console.log("Registration Success:", result);
    // No need to navigate here. Let useEffect handle it.
  } catch (err) {
    console.error("Registration Failed:", err); // Optional: show this in UI
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{
      backgroundImage:`url(${RegisterImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
    
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center p-8 md:p-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border">
        <div className="flex justify-center mb-6">
          <h2 className="text-xl font-medium">Buydora</h2>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Hey there, welcome back!
        </h2>
        <p className="text-center mb-6">Enter your Username and Password</p>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Name</label>
          <input type="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" placeholder="Enter Your name"/>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" placeholder="Enter Your Email address"/>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input type="password" value={password} onChange= {(e) => setPassword(e.target.value)} className='w-full p-2 border rounded' placeholder='Enter your Password'></input>
        </div>
        <button type="submit" className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition">Sign Up</button>
        <p className='mt-6 text-center text-sm '>Don't have an Account?{" "}
          <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-600">Login</Link>
        </p>
      </form>
      </div>
      <div className='hidden md:block w-1/2 bg-gray-800'>
      <div className='h-full flex flex-col justify-center items-center'>
        <img src={RegisterImage} alt="Login to Account" className='w-full h-full object-cover'/>
      </div>
      </div>
    </div>
  )
}

export default Register;
