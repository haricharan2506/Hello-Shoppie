import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  FaUsers,
  FaUserCheck,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";

import { getAllCustomers } from "../../services/adminService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await getAllCustomers();

      if (data.success) {
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error("CUSTOMERS PAGE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF3E6] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0B3D3A]">
            Customer Management
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage customers registered on the platform.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-3">

          {/* Total Customers */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaUsers />
            </div>

            <p className="text-sm text-gray-500">
              Total Customers
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading ? "—" : customers.length}
            </p>
          </div>

          {/* Active Customers */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white">
              <FaUserCheck />
            </div>

            <p className="text-sm text-gray-500">
              Active Customers
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading
                ? "—"
                : customers.filter(
                    (customer) => customer.isApproved !== false
                  ).length}
            </p>
          </div>

          {/* Customers with Phone */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0B3D3A] text-white">
              <FaPhone />
            </div>

            <p className="text-sm text-gray-500">
              Contact Available
            </p>

            <p className="mt-1 text-3xl font-bold text-[#0B3D3A]">
              {loading
                ? "—"
                : customers.filter(
                    (customer) => customer.phone
                  ).length}
            </p>
          </div>

        </div>

        {/* Customer Table */}
        <div className="rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0B3D3A]">
              All Customers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Customers currently registered on Shoppie.
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
              No customers found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead>
                  <tr className="border-b border-gray-200 text-left">

                    <th className="px-4 py-4 text-sm font-semibold text-gray-500">
                      Customer
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

                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 last:border-0"
                    >

                      {/* Customer */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B3D3A] text-sm font-bold text-white">
                            {customer.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <span className="font-semibold text-[#0B3D3A]">
                            {customer.name}
                          </span>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {customer.email}
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {customer.phone || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">

                        {customer.isApproved !== false ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            Pending
                          </span>
                        )}

                      </td>

                      {/* Joined */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <FaCalendarAlt className="text-gray-400" />

                          {customer.createdAt
                            ? new Date(
                                customer.createdAt
                              ).toLocaleDateString()
                            : "—"}

                        </div>

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

export default Customers;