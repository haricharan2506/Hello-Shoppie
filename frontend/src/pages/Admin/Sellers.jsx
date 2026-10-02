import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  FaStore,
  FaUserCheck,
  FaCheck,
  FaClock,
} from "react-icons/fa";

import {
  getPendingSellers,
  getAllSellers,
  approveSeller,
} from "../../services/adminService";

function Sellers() {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [allSellers, setAllSellers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  const loadSellers = async () => {
    try {
      setLoading(true);

      const [pendingData, sellersData] = await Promise.all([
        getPendingSellers(),
        getAllSellers(),
      ]);

      if (pendingData.success) {
        setPendingSellers(pendingData.sellers || []);
      }

      if (sellersData.success) {
        setAllSellers(sellersData.sellers || []);
      }
    } catch (error) {
      console.error("SELLERS PAGE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load sellers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleApprove = async (sellerId) => {
    try {
      setApprovingId(sellerId);

      const data = await approveSeller(sellerId);

      if (data.success) {
        toast.success("Seller approved successfully");

        await loadSellers();
      }
    } catch (error) {
      console.error("APPROVE SELLER ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to approve seller"
      );
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF3E6] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0B3D3A]">
            Seller Management
          </h1>

          <p className="mt-2 text-gray-600">
            Review applications and manage marketplace sellers.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaStore />
            </div>

            <p className="text-sm text-gray-500">
              Total Sellers
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : allSellers.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B5B] text-white">
              <FaClock />
            </div>

            <p className="text-sm text-gray-500">
              Pending Applications
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : pendingSellers.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
              <FaUserCheck />
            </div>

            <p className="text-sm text-gray-500">
              Approved Sellers
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading
                ? "—"
                : allSellers.filter(
                    (seller) => seller.isApproved
                  ).length}
            </p>
          </div>

        </div>

        {/* Pending Applications */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0B3D3A]">
                Pending Applications
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Sellers waiting for administrator approval.
              </p>
            </div>

            <span className="rounded-full bg-[#FFF3E6] px-4 py-2 text-sm font-semibold text-[#0B3D3A]">
              {pendingSellers.length} Pending
            </span>
          </div>

          {loading ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              Loading seller applications...
            </div>
          ) : pendingSellers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
              <FaCheck className="mx-auto mb-3 text-3xl text-green-500" />

              <h3 className="font-bold text-[#0B3D3A]">
                No pending applications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                All seller applications have been reviewed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {pendingSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="flex flex-col gap-5 rounded-xl border border-gray-200 p-5 transition hover:shadow-sm md:flex-row md:items-center md:justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0B3D3A] font-bold text-white">
                      {seller.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-bold text-[#0B3D3A]">
                        {seller.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {seller.email}
                      </p>

                      <p className="text-sm text-gray-500">
                        {seller.phone || "No phone number"}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      Pending Approval
                    </span>

                    <button
                      onClick={() => handleApprove(seller.id)}
                      disabled={approvingId === seller.id}
                      className="rounded-xl bg-[#0B3D3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#145C52] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {approvingId === seller.id
                        ? "Approving..."
                        : "Approve Seller"}
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}
        </div>

        {/* All Sellers */}
        <div className="rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0B3D3A]">
              All Sellers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View all sellers registered on the platform.
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              Loading sellers...
            </div>
          ) : allSellers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No sellers found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Seller
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Email
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Phone
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Status
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {allSellers.map((seller) => (
                    <tr
                      key={seller.id}
                      className="border-b border-gray-100 last:border-0"
                    >

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B3D3A] text-sm font-bold text-white">
                            {seller.name?.charAt(0)?.toUpperCase()}
                          </div>

                          <span className="font-semibold text-[#0B3D3A]">
                            {seller.name}
                          </span>

                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {seller.email}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {seller.phone || "—"}
                      </td>

                      <td className="px-4 py-4">

                        {seller.isApproved ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Approved
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Pending
                          </span>
                        )}

                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {seller.createdAt
                          ? new Date(
                              seller.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Sellers;