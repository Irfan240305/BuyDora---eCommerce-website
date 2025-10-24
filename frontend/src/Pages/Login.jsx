import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginBg from "../assets/Login2.jpg";
import { loginUser } from '../redux/slices/authSlice';
import { mergeCart } from '../redux/slices/cartSlice'; // ✅ Make sure you import mergeCart

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  // ✅ Redirect user after login based on role
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  }, [user, navigate]);
const params = new URLSearchParams(location.search);
const isCheckoutRedirect = params.get("redirect")?.includes("checkout");

  // ✅ Merge cart if needed after user is logged in
  useEffect(() => {
    const isOnLoginOrRegister = location.pathname === "/login" || location.pathname === "/register";

    if (!loading && user && !isOnLoginOrRegister) {
      const destination = isCheckoutRedirect ? "/checkout" : "/";

      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(destination);
        });
      } else {
        navigate(destination);
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch, loading, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log("Login Success:", result);
      localStorage.setItem("userToken", result.token); 
      localStorage.setItem("userInfo", JSON.stringify(result.user));
    } catch (err) {
      console.error("Login Failed:", err);
      // Optional: show error to user
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${LoginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
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
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Your Email address"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded'
              placeholder='Enter your Password'
              required
            />
          </div>

          <button type="submit" className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition">
            {loading ? "loading..." : "Sign In"}
          </button>

          <p className='mt-6 text-center text-sm'>
            Don't have an Account?{" "}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-600">Register</Link>
          </p>
        </form>
      </div>

      <div className='hidden md:block w-1/2 bg-gray-800'>
        <div className='h-full flex flex-col justify-center items-center'>
          <img src={LoginBg} alt="Login to Account" className='w-full h-full object-cover' />
        </div>
      </div>
    </div>
  );
};

export default Login;
