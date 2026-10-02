import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaUsers,
  FaUserCheck,
  FaStore,
  FaBoxOpen,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";

import {
  getPendingSellers,
  getAllSellers,
  getAllCustomers,
  getAllProducts,
} from "../../services/adminService";

function AdminDashboard() {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [allSellers, setAllSellers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        pendingData,
        sellersData,
        customersData,
        productsData,
      ] = await Promise.all([
        getPendingSellers(),
        getAllSellers(),
        getAllCustomers(),
        getAllProducts(),
      ]);

      if (pendingData.success) {
        setPendingSellers(pendingData.sellers || []);
      }

      if (sellersData.success) {
        setAllSellers(sellersData.sellers || []);
      }

      if (customersData.success) {
        setAllCustomers(customersData.customers || []);
      }

      if (productsData.success) {
        setAllProducts(productsData.products || []);
      }
    } catch (error) {
      console.error("ADMIN DASHBOARD ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF3E6] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0B3D3A]">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Monitor and manage your Shoppie marketplace.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

          {/* Customers */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaUsers />
            </div>

            <p className="text-sm text-gray-500">
              Customers
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : allCustomers.length}
            </p>

            <NavLink
              to="/admin/customers"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B3D3A] hover:underline"
            >
              View customers
              <FaArrowRight className="text-xs" />
            </NavLink>
          </div>

          {/* Sellers */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaStore />
            </div>

            <p className="text-sm text-gray-500">
              Sellers
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : allSellers.length}
            </p>

            <NavLink
              to="/admin/sellers"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B3D3A] hover:underline"
            >
              Manage sellers
              <FaArrowRight className="text-xs" />
            </NavLink>
          </div>

          {/* Products */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaBoxOpen />
            </div>

            <p className="text-sm text-gray-500">
              Products
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : allProducts.length}
            </p>

            <NavLink
              to="/admin/products"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B3D3A] hover:underline"
            >
              View products
              <FaArrowRight className="text-xs" />
            </NavLink>
          </div>

          {/* Pending Sellers */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B5B] text-white">
              <FaUserCheck />
            </div>

            <p className="text-sm text-gray-500">
              Pending Sellers
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : pendingSellers.length}
            </p>

            <NavLink
              to="/admin/sellers"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0B3D3A] hover:underline"
            >
              Review applications
              <FaArrowRight className="text-xs" />
            </NavLink>
          </div>

          {/* Platform Status */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaCheck />
            </div>

            <p className="text-sm text-gray-500">
              Platform Status
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              Active
            </p>

            <p className="mt-4 text-sm text-gray-500">
              Marketplace is running normally.
            </p>
          </div>

        </div>

        {/* Quick Overview */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Marketplace Summary */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0B3D3A]">
                Marketplace Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current platform statistics.
              </p>
            </div>

            <div className="space-y-4">

              <div className="flex items-center justify-between rounded-xl bg-[#FFF8F0] px-4 py-4">
                <div className="flex items-center gap-3">
                  <FaUsers className="text-[#0B3D3A]" />
                  <span className="text-sm font-medium text-gray-600">
                    Registered Customers
                  </span>
                </div>

                <span className="font-bold text-[#0B3D3A]">
                  {loading ? "—" : allCustomers.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#FFF8F0] px-4 py-4">
                <div className="flex items-center gap-3">
                  <FaStore className="text-[#0B3D3A]" />
                  <span className="text-sm font-medium text-gray-600">
                    Registered Sellers
                  </span>
                </div>

                <span className="font-bold text-[#0B3D3A]">
                  {loading ? "—" : allSellers.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#FFF8F0] px-4 py-4">
                <div className="flex items-center gap-3">
                  <FaBoxOpen className="text-[#0B3D3A]" />
                  <span className="text-sm font-medium text-gray-600">
                    Listed Products
                  </span>
                </div>

                <span className="font-bold text-[#0B3D3A]">
                  {loading ? "—" : allProducts.length}
                </span>
              </div>

            </div>
          </div>

          {/* Attention Required */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0B3D3A]">
                Attention Required
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Items that may need your attention.
              </p>
            </div>

            {loading ? (
              <div className="rounded-xl bg-[#FFF8F0] p-6 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : pendingSellers.length > 0 ? (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-yellow-800">
                      Seller applications pending
                    </p>

                    <p className="mt-1 text-sm text-yellow-700">
                      {pendingSellers.length} seller
                      {pendingSellers.length !== 1 ? "s" : ""} waiting
                      for approval.
                    </p>
                  </div>

                  <NavLink
                    to="/admin/sellers"
                    className="shrink-0 rounded-xl bg-[#0B3D3A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#145C52]"
                  >
                    Review
                  </NavLink>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <FaCheck className="mx-auto mb-3 text-2xl text-green-500" />

                <p className="font-bold text-green-800">
                  Everything looks good
                </p>

                <p className="mt-1 text-sm text-green-700">
                  There are no pending seller applications.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;