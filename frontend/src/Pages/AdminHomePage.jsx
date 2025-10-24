import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts } from '../redux/slices/adminProductSlice';
import { fetchAllOrders, updateOrderStatus } from '../redux/slices/adminOrderSlice';

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);

  const {
    orders,
    totalOrders,
    totalSales,
    loading: orderLoading,
    error: orderError,
  } = useSelector((state) => state.adminOrders);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Retry on error
  useEffect(() => {
    if (productsError) dispatch(fetchAdminProducts());
    if (orderError) dispatch(fetchAllOrders());
  }, [dispatch, productsError, orderError]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Admin Console</h1>

      {productsLoading || orderLoading ? (
        <p>Loading...</p>
      ) : productsError ? (
        <p className='text-red-500'>Error loading products: {productsError}</p>
      ) : orderError ? (
        <p className='text-red-500'>Error loading orders: {orderError}</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='p-4 shadow-md rounded-lg bg-red-400'>
            <h2 className='text-xl font-semibold'>Revenue</h2>
            <p className='text-2xl'>Rs: {totalSales?.toFixed(2)}</p>
          </div>
          <div className='p-4 shadow-md rounded-lg bg-red-400'>
            <h2 className='text-xl font-semibold'>Total Orders</h2>
            <p className='text-2xl'>{totalOrders}</p>
            <Link to='/admin/orders' className='text-blue-500 hover:underline'>
              Manage Orders
            </Link>
          </div>
          <div className='p-4 shadow-md rounded-lg bg-red-400'>
            <h2 className='text-xl font-semibold'>Total Products</h2>
            <p className='text-2xl'>{products.length}</p>
            <Link to='/admin/products' className='text-blue-500 hover:underline'>
              Manage Products
            </Link>
          </div>
        </div>
      )}

      <div className='mt-6'>
        <h2 className='text-2xl font-bold mb-4'>Recent Orders</h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-left text-gray-100'>
            <thead className='bg-gray-100 text-xs uppercase text-gray-800'>
              <tr>
                <th className='py-3 px-4'>Order ID</th>
                <th className='py-3 px-4'>User</th>
                <th className='py-3 px-4'>Total Price</th>
                <th className='py-3 px-4'>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length > 0 ? (
                orders
                  .filter((order) => order && typeof order === 'object')
                  .map((order) => (
                    <tr key={order._id} className='border-b hover:bg-gray-500 cursor-pointer text-black'>
                      <td className='py-3 px-4'>{order._id}</td>
                      <td className='py-3 px-4'>
                        {order?.user?.name ? (
                          order.user.name
                        ) : (
                          <span className='italic text-gray-500'>Unknown User</span>
                        )}
                      </td>
                      <td className='py-3 px-4'>
                        Rs: {order?.totalPrice?.toFixed(2) || '0.00'}
                      </td>
                      <td className='py-3 px-4'>
                        <select
                          value={order?.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className='bg-white border rounded px-2 py-1 text-black'
                        >
                          <option value='Pending'>Pending</option>
                          <option value='Processing'>Processing</option>
                          <option value='Shipped'>Shipped</option>
                          <option value='Delivered'>Delivered</option>
                          <option value='Cancelled'>Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={4} className='py-3 px-4 text-center text-gray-800'>
                    Start shopping to place your first order!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
