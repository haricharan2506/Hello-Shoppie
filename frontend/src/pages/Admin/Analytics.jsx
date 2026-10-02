import { useEffect, useState } from "react";
import api from "../../api/api";

import {
  FaUsers,
  FaStore,
  FaBoxOpen,
  FaShoppingBag,
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

function Analytics() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);


  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const [
        ordersResponse,
        customersResponse,
        sellersResponse,
        productsResponse,
      ] = await Promise.all([
        api.get("/admin/orders"),
        api.get("/admin/customers"),
        api.get("/admin/sellers"),
        api.get("/admin/products"),
      ]);

      if (ordersResponse.data.success) {
        setOrders(ordersResponse.data.orders || []);
      }

      if (customersResponse.data.success) {
        setCustomers(
          customersResponse.data.customers || []
        );
      }

      if (sellersResponse.data.success) {
        setSellers(
          sellersResponse.data.sellers || []
        );
      }

      if (productsResponse.data.success) {
        setProducts(
          productsResponse.data.products || []
        );
      }
    } catch (error) {
      console.error(
        "ANALYTICS DATA ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const successfulOrders = orders.filter(
    (order) =>
      order.paymentStatus?.toUpperCase() ===
      "SUCCESS"
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() ===
      "pending"
  );

  const completedOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() ===
        "delivered" ||
      order.status?.toLowerCase() ===
        "completed"
  );

  const cancelledOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() ===
      "cancelled"
  );

  const totalRevenue = successfulOrders.reduce(
    (total, order) =>
      total + Number(order.totalAmount || 0),
    0
  );

  const approvedSellers = sellers.filter(
    (seller) => seller.isApproved
  ).length;

  return (
    <div className="min-h-screen bg-[#FFF3E6] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0B3D3A]">
            Analytics
          </h1>

          <p className="mt-2 text-gray-600">
            Overview of marketplace activity and performance.
          </p>
        </div>

        {/* Platform Overview */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaUsers />
            </div>

            <p className="text-sm text-gray-500">
              Customers
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : customers.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaStore />
            </div>

            <p className="text-sm text-gray-500">
              Approved Sellers
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : approvedSellers}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaBoxOpen />
            </div>

            <p className="text-sm text-gray-500">
              Products
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : products.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaShoppingBag />
            </div>

            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : orders.length}
            </p>
          </div>

        </div>

        {/* Revenue */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-600 text-xl text-white">
              <FaRupeeSign />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Successful Payment Revenue
              </p>

              <p className="text-3xl font-extrabold text-[#0B3D3A]">
                {loading
                  ? "—"
                  : `₹${totalRevenue.toLocaleString(
                      "en-IN"
                    )}`}
              </p>
            </div>

          </div>

        </div>

        {/* Order Analytics */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">

          {/* Order Status */}
          <div className="rounded-2xl bg-white p-6 shadow-md">

            <h2 className="mb-6 text-xl font-bold text-[#0B3D3A]">
              Order Status
            </h2>

            <div className="space-y-5">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaClock className="text-yellow-500" />

                  <span className="text-gray-600">
                    Pending
                  </span>
                </div>

                <span className="font-bold text-[#0B3D3A]">
                  {loading ? "—" : pendingOrders.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-600" />

                  <span className="text-gray-600">
                    Completed
                  </span>
                </div>

                <span className="font-bold text-[#0B3D3A]">
                  {loading ? "—" : completedOrders.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaTimesCircle className="text-red-500" />

                  <span className="text-gray-600">
                    Cancelled
                  </span>
                </div>

                <span className="font-bold text-[#0B3D3A]">
                  {loading ? "—" : cancelledOrders.length}
                </span>
              </div>

            </div>

          </div>

          {/* Payment Status */}
          <div className="rounded-2xl bg-white p-6 shadow-md">

            <h2 className="mb-6 text-xl font-bold text-[#0B3D3A]">
              Payment Status
            </h2>

            <div className="space-y-5">

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Successful
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                  {loading
                    ? "—"
                    : successfulOrders.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Pending
                </span>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                  {loading
                    ? "—"
                    : orders.filter(
                        (order) =>
                          order.paymentStatus?.toUpperCase() ===
                          "PENDING"
                      ).length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Failed
                </span>

                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                  {loading
                    ? "—"
                    : orders.filter(
                        (order) =>
                          order.paymentStatus?.toUpperCase() ===
                          "FAILED"
                      ).length}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Platform Summary */}
        <div className="rounded-2xl bg-white p-6 shadow-md">

          <h2 className="mb-6 text-xl font-bold text-[#0B3D3A]">
            Platform Summary
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-[#FFF3E6] p-5">
              <p className="text-sm text-gray-500">
                Customers
              </p>

              <p className="mt-1 text-2xl font-bold text-[#0B3D3A]">
                {loading ? "—" : customers.length}
              </p>
            </div>

            <div className="rounded-xl bg-[#FFF3E6] p-5">
              <p className="text-sm text-gray-500">
                Sellers
              </p>

              <p className="mt-1 text-2xl font-bold text-[#0B3D3A]">
                {loading ? "—" : sellers.length}
              </p>
            </div>

            <div className="rounded-xl bg-[#FFF3E6] p-5">
              <p className="text-sm text-gray-500">
                Products
              </p>

              <p className="mt-1 text-2xl font-bold text-[#0B3D3A]">
                {loading ? "—" : products.length}
              </p>
            </div>

            <div className="rounded-xl bg-[#FFF3E6] p-5">
              <p className="text-sm text-gray-500">
                Orders
              </p>

              <p className="mt-1 text-2xl font-bold text-[#0B3D3A]">
                {loading ? "—" : orders.length}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Analytics;