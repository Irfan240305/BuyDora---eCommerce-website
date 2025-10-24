import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserLayout from "./components/Layout/UserLayout";
import { Toaster } from "sonner";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import CollectionPages from "./Pages/CollectionPages";
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import OrderConfirmationPage from './Pages/OrderConfirmationPage';
import OrderDetailsPage from './Pages/OrderDetailsPage';
import MyOrdersPage from './Pages/MyOrdersPage';
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from './Pages/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProductPage from './components/Admin/EditProductPage';
import OrderManagement from './components/Admin/OrderManagement';
import ProtectedRoute from './components/Common/ProtectedRoute';
import ChatWidget from './components/chatWidget';

import {Provider} from "react-redux";
import store from "./redux/store";
import ProductDescriptionGenerator from "./components/ProductDescriptionGenerator";
import ReviewSentimentAnalyzer from "./components/ReviewSentimentAnalyzer";


const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPages />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
          <Route path="my-orders" element={<MyOrdersPage/>}/>
        </Route>

        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>

        <Route index element={<AdminHomePage />} />
        <Route path="users" element={<UserManagement/>}/>
        <Route path="products" element={<ProductManagement/>}/>
        <Route path="products/:id/edit" element={<EditProductPage/>}/>
        <Route path="orders" element={<OrderManagement/>}/>
        </Route>



      </Routes>
    </BrowserRouter>
  </Provider>
  );
};

export default App;
