import {
  FaBoxOpen,
  FaShoppingBag,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import api from "../../api/api";


function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/seller/dashboard");

        if (response.data.success) {
          setDashboard(response.data);
        }
      } catch (error) {
        console.error("SELLER DASHBOARD ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
  return (
    <div className="font-body min-h-screen bg-[#F7EFE3] px-6 py-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      `}</style>

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-[#0B3D3A]">
            Seller Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your store, products, and orders from one place.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Products */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaBoxOpen />
            </div>

            <p className="text-sm text-gray-500">
              My Products
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "..." : dashboard?.stats?.totalProducts ?? 0}
            </p>
          </div>

          {/* Orders */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaShoppingBag />
            </div>

            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : dashboard?.stats?.totalOrders ?? 0}
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C97B65] text-white">
              <FaClock />
            </div>

            <p className="text-sm text-gray-500">
              Pending Orders
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : dashboard?.stats?.pendingOrders ?? 0}
            </p>
          </div>

          {/* Revenue */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaRupeeSign />
            </div>

            <p className="text-sm text-gray-500">
              Revenue
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading
                ? "—"
                : `₹${Number(
                    dashboard?.stats?.revenue ?? 0
                  ).toLocaleString("en-IN")}`}
            </p>
          </div>

        </div>

        {/* Welcome Section */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-md">

          <h2 className="font-display text-2xl font-bold text-[#0B3D3A]">
            Welcome to your Seller Dashboard
          </h2>

          <p className="mt-3 max-w-2xl text-gray-600">
            From here you will be able to manage your products,
            track customer orders, monitor your sales, and manage
            your seller profile.
          </p>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;