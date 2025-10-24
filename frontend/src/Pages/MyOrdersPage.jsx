import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/orderSlice';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  if (error)
    return <p className="text-center text-red-600 mt-4">Error fetching orders: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gray-600">
          <thead className="bg-gray-200 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Shipping Address</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                >
                  <td className="py-2 px-4">
                    {order.orderItems?.[0]?.image ? (
                      <img
                        src={order.orderItems[0].image}
                        alt={order.orderItems[0].name || "Item"}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-900 whitespace-nowrap">
                    {order._id}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2 px-4">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4">
                    {order.orderItems?.map((item) => item.name).join(", ") || "No items"}
                  </td>
                  <td className="py-2 px-4">
                    ₹{order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-4">
                    {order.isPaid ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Unpaid</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;
