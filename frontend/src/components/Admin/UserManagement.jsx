// File: src/pages/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addUser,
  deleteUser,
  updateUser,
  updateUserRole,
  fetchUsers,
} from '../../redux/slices/adminSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user: userInfo, loading: authLoading } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
  });

  const [editingUserId, setEditingUserId] = useState(null);

  // ✅ Safer redirect check after hydration
  useEffect(() => {
    if (authLoading) return; // wait for Redux hydration

    if (!userInfo || userInfo.role !== "admin") {
      console.warn("⛔ Unauthorized user — redirecting");
      navigate("/");
    } else {
      dispatch(fetchUsers());
    }
  }, [authLoading, userInfo, dispatch, navigate]);

  useEffect

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUserId) {
      dispatch(updateUser({ id: editingUserId, ...formData }));
    } else {
      dispatch(addUser(formData));
    }

    // ✅ Reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Customer",
    });
    setEditingUserId(null);
  };

  const handleEditUser = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditingUserId(user._id);
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUserRole({ id: userId, role: newRole }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>User Management Console</h2>
      {loading && <p className='text-blue-500'>Loading users...</p>}
      {error && <p className='text-red-500'>Error: {error}</p>}

      {/* 📝 User Form */}
      <div className='mb-8'>
        <h3 className='text-xl font-semibold mb-4'>
          {editingUserId ? "Edit User" : "Add New User"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-md shadow">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Name"
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full border p-2 rounded"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingUserId ? "Update User" : "Add User"}
          </button>
        </form>
      </div>

      {/* 📋 Users Table */}
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='p-3 text-left'>Name</th>
              <th className='p-3 text-left'>Email</th>
              <th className='p-3 text-left'>Role</th>
              <th className='p-3 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className='border-b'>
                <td className='p-3'>{user.name}</td>
                <td className='p-3'>{user.email}</td>
                <td className='p-3'>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className='p-3 space-x-2'>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
