import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
    console.log("Dispatching update:", { id: orderId, status });
  };
  if (loading) return <p className='text-gray-600 text-center'>Loading orders...</p>;
  if (error) return <p className='text-red-500 text-center'>Error: {error}</p>;

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>Order Management</h2>

      {loading ? (
        <p className='text-gray-600 text-center'>Loading orders...</p>
      ) : error ? (
        <p className='text-red-500 text-center'>Error: {error}</p>
      ) : (
        <div className='overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='min-w-full text-left text-gray-600'>
            <thead className='bg-gray-600 text-xs uppercase text-gray-700'>
              <tr>
                <th className='py-3 px-4'>Order ID</th>
                <th className='py-3 px-4'>Customer</th>
                <th className='py-3 px-4'>Total Price</th>
                <th className='py-3 px-4'>Status</th>
                <th className='py-3 px-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className='border-b hover:bg-gray-50 cursor:pointer'>
                    <td className='py-4 px-4 font-medium text-gray-600 whitespace-nowrap'>
                      #{order._id}
                    </td>
                    <td className='p-4'>
                      {order?.user?.name || "Unknown User"}
                    </td>
                    <td className='p-4'>Rs: {order.totalPrice.toFixed(2) || 0}</td>
                    <td className='p-4'>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className='bg-gray-50 border border-gray-300 text-teal-400 text-sm rounded-lg focus:ring-lime-200 focus:border-blue-500 block p-3'
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className='p-4'>
                      <button
                        onClick={() => handleStatusChange(order._id, "Delivered")}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Mark as Delivered
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='p-4 text-center text-gray-600'>No Orders found..</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
