import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  console.log("User from Redux", user);
  console.log("LOading state", loading);
  useEffect(() => {
    if(!loading) {
      if(!user) {
        console.warn("No user - redirecting");
        navigate("/", { replace: true });
      } else if(user.isAdmin) {
        console.warn("User is not admin - redirecting");
        navigate("/", { replace: true });
      } else {
        console.log("User is admin - showing admin layout");
      }
    }
  }, [loading, user, navigate]);
  console.log("AdminLayout render:", {user, loading});



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 🕒 Show loading until Redux is ready
  if (loading) {
    return <div className="p-6 text-center">Checking access...</div>;
  }

  // 🚫 Handle case where user is null (not logged in)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile toggle button */}
      <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
        <button onClick={toggleSidebar}>
          <FaBars size={28} />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
      >
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-grow p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
