import { useEffect, useState } from "react";
import { FaEye, FaShoppingBag, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getSellerOrders } from "../../services/orderService";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getSellerOrders();

        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("SELLER ORDERS ERROR:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load seller orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";

      case "SHIPPED":
        return "bg-purple-100 text-purple-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
            Seller Orders
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage orders containing your products.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <p className="font-semibold text-[#0B3D3A]">
              Loading orders...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="rounded-2xl bg-white p-12 text-center shadow-md">
            <FaShoppingBag
              className="mx-auto mb-4 text-gray-300"
              size={50}
            />

            <h2 className="font-display text-xl font-bold text-[#0B3D3A]">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Orders containing your products will appear here.
            </p>
          </div>
        )}

        {/* Orders */}
        {!loading && orders.length > 0 && (
          <div className="space-y-5">

            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-white p-6 shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 font-bold text-[#0B3D3A]">
                      #{order.id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/seller/orders/${order.id}`)
                      }
                      className="flex items-center gap-2 rounded-xl bg-[#0B3D3A] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#145C52]"
                    >
                      <FaEye />
                      View
                    </button>

                  </div>
                </div>

                {/* Customer */}
                <div className="grid gap-5 py-5 sm:grid-cols-3">

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-gray-700">
                      {order.user?.name ||
                        order.customerName ||
                        "Customer"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Items
                    </p>

                    <p className="mt-1 font-semibold text-gray-700">
                      {order.items?.length || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Order Date
                    </p>

                    <p className="mt-1 flex items-center gap-2 font-semibold text-gray-700">
                      <FaClock className="text-gray-400" />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                </div>

                {/* Seller Products */}
                <div className="space-y-3">

                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-xl bg-gray-50 p-4"
                    >

                      {/* Product Image */}
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-200">
                          <FaShoppingBag className="text-gray-400" />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">

                        <p className="truncate font-bold text-[#0B3D3A]">
                          {item.product?.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-[#0B3D3A]">
                          ₹
                          {Number(
                            item.price * item.quantity
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                    </div>
                  ))}

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Orders;