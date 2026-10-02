import { useEffect, useState } from "react";
import api from "../../api/api";

import {
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

function Payments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/admin/orders");

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("FAILED TO FETCH PAYMENTS:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const successfulPayments = orders.filter(
    (order) =>
      order.paymentStatus?.toUpperCase() === "SUCCESS"
  );

  const pendingPayments = orders.filter(
    (order) =>
      order.paymentStatus?.toUpperCase() === "PENDING"
  );

  const failedPayments = orders.filter(
    (order) =>
      order.paymentStatus?.toUpperCase() === "FAILED"
  );

  const successfulAmount = successfulPayments.reduce(
    (total, order) =>
      total + Number(order.totalAmount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FFF3E6] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0B3D3A]">
            Payments
          </h1>

          <p className="mt-2 text-gray-600">
            Monitor payment transactions made through the marketplace.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Successful */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
              <FaCheckCircle />
            </div>

            <p className="text-sm text-gray-500">
              Successful Payments
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : successfulPayments.length}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white">
              <FaClock />
            </div>

            <p className="text-sm text-gray-500">
              Pending Payments
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : pendingPayments.length}
            </p>
          </div>

          {/* Failed */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500 text-white">
              <FaTimesCircle />
            </div>

            <p className="text-sm text-gray-500">
              Failed Payments
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : failedPayments.length}
            </p>
          </div>

          {/* Revenue */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaCreditCard />
            </div>

            <p className="text-sm text-gray-500">
              Successful Amount
            </p>

            <p className="mt-1 text-2xl font-bold text-[#0B3D3A]">
              {loading
                ? "—"
                : `₹${successfulAmount.toLocaleString("en-IN")}`}
            </p>
          </div>

        </div>

        {/* Payment Table */}
        <div className="rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0B3D3A]">
              Payment Transactions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Payment information associated with marketplace orders.
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              Loading payments...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <FaCreditCard className="mx-auto mb-3 text-3xl text-gray-300" />

              <p className="font-semibold text-[#0B3D3A]">
                No payment transactions yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Payment transactions will appear here after customers place orders.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

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
                      Razorpay Order ID
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Payment ID
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

                  {orders.map((order) => {

                    const status =
                      order.paymentStatus?.toUpperCase() ||
                      "UNKNOWN";

                    return (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 last:border-0"
                      >

                        {/* Order */}
                        <td className="px-4 py-5">
                          <span className="font-semibold text-[#0B3D3A]">
                            #{order.id.slice(-8).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-5">
                          <p className="font-medium text-gray-800">
                            {order.user?.name || "Unknown"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {order.user?.email || "—"}
                          </p>
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-5 font-semibold text-[#0B3D3A]">
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString("en-IN")}
                        </td>

                        {/* Razorpay Order */}
                        <td className="px-4 py-5 text-sm text-gray-500">
                          {order.razorpayOrderId || "—"}
                        </td>

                        {/* Razorpay Payment */}
                        <td className="px-4 py-5 text-sm text-gray-500">
                          {order.razorpayPaymentId || "—"}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-5">

                          {status === "SUCCESS" ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Success
                            </span>
                          ) : status === "PENDING" ? (
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                              Pending
                            </span>
                          ) : status === "FAILED" ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                              Failed
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                              {status}
                            </span>
                          )}

                        </td>

                        {/* Date */}
                        <td className="px-4 py-5 text-sm text-gray-500">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString("en-IN")
                            : "—"}
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Payments;