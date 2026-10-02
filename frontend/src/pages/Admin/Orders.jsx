import { useEffect, useState } from "react";
import { FaShoppingBag, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../../api/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/admin/orders");

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);

      await api.put(
        `/orders/${orderId}/status`,
        { status }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);

      alert(
        error.response?.data?.message ||
        "Failed to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "pending"
  ).length;

  const completedOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "delivered" ||
      order.status?.toLowerCase() === "completed"
  ).length;

  const cancelledOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "cancelled"
  ).length;

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B3D3A]">
          Orders
        </h1>

        <p className="mt-1 text-gray-500">
          View and manage all marketplace orders.
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
            <FaShoppingBag />
          </div>

          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white">
            <FaClock />
          </div>

          <p className="text-sm text-gray-500">
            Pending
          </p>

          <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
            {pendingOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
            <FaCheckCircle />
          </div>

          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
            {completedOrders}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white">
            <FaTimesCircle />
          </div>

          <p className="text-sm text-gray-500">
            Cancelled
          </p>

          <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
            {cancelledOrders}
          </p>
        </div>

      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white p-6 shadow-md">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0B3D3A]">
            All Orders
          </h2>

          <p className="mt-1 text-gray-500">
            Recent orders placed on the marketplace.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <FaShoppingBag className="mx-auto mb-4 text-4xl text-gray-300" />

            <h3 className="text-lg font-semibold text-[#0B3D3A]">
              No orders yet
            </h3>

            <p className="mt-1 text-gray-500">
              Orders will appear here once customers place them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Order
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Customer
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Amount
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Payment
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Status
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100"
                  >

                    <td className="px-4 py-5">
                      <p className="font-semibold text-[#0B3D3A]">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                    </td>

                    <td className="px-4 py-5">
                      <p className="font-medium text-gray-800">
                        {order.user?.name || "Unknown"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.user?.email || "—"}
                      </p>
                    </td>

                    <td className="px-4 py-5 font-semibold text-[#0B3D3A]">
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-5">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {order.paymentStatus || "Unknown"}
                      </span>
                    </td>

                    <td className="px-4 py-5">
                      <select
                        value={order.status || "pending"}
                        onChange={(event) =>
                          updateOrderStatus(
                            order.id,
                            event.target.value
                          )
                        }
                        disabled={updatingOrderId === order.id}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text0-gray-700 outline-none focus:border-[#0B3D3A] focus:ring-2 focus:ring-[#0B3D3A]/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>

                      {updatingOrderId === order.id && (
                        <p className="mt-1 text-xs text-gray-400">
                          Updating...
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-5 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Orders;