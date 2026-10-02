import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { getMyOrders } from "../../services/orderService";

function BrandStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
      .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      @keyframes shimmerSweep {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .skeleton {
        background: linear-gradient(
          100deg,
          rgba(11,61,58,0.07) 30%,
          rgba(11,61,58,0.14) 45%,
          rgba(11,61,58,0.07) 60%
        );
        background-size: 300% 100%;
        animation: shimmerSweep 1.6s ease-in-out infinite;
      }
    `}</style>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders();

        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);

        const message =
          error.response?.data?.message ||
          "Unable to load orders";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#F7EFE3] min-h-screen py-10 font-body">
        <BrandStyles />

        <div className="max-w-6xl mx-auto px-6">

          <div className="mb-8">
            <div className="skeleton h-4 w-32 rounded-md mb-4" />
            <div className="skeleton h-8 w-48 rounded-md" />
          </div>

          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="skeleton h-4 w-40 rounded-md" />
                  <div className="skeleton h-4 w-32 rounded-md" />
                  <div className="skeleton h-4 w-24 rounded-md" />
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    {Array.from({ length: 2 }).map((__, j) => (
                      <div key={j} className="flex gap-4">
                        <div className="skeleton w-20 h-20 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="skeleton h-4 w-2/3 rounded-md" />
                          <div className="skeleton h-3 w-1/3 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="skeleton h-40 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7EFE3] min-h-screen py-10 font-body">
      <BrandStyles />

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#C97B65] font-semibold hover:text-[#B96A54] mb-4"
          >
            <FaArrowLeft size={13} />
            Continue Shopping
          </Link>

          <h1 className="font-display text-3xl font-bold text-[#0B3D3A]">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2">
            View your orders and delivery details.
          </p>
        </div>

        {/* Empty Orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">

            <FaBoxOpen className="text-gray-300 text-6xl mx-auto mb-5" />

            <h2 className="font-display text-2xl font-bold text-[#0B3D3A]">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 bg-[#C97B65] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#B96A54] transition"
            >
              Start Shopping
            </Link>

          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >

                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="font-semibold text-[#0B3D3A] break-all">
                        {order.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Order Date
                      </p>

                      <p className="font-medium text-[#0B3D3A]">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <FaCheckCircle />
                      {order.paymentStatus}
                    </div>

                  </div>

                </div>

                {/* Order Content */}
                <div className="p-6">

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Products */}
                    <div className="lg:col-span-2">

                      <h3 className="font-bold text-lg text-[#0B3D3A] mb-4">
                        Items
                      </h3>

                      <div className="space-y-4">

                        {order.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-4 border-b border-gray-100 pb-4 last:border-0"
                          >

                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {item.product?.images?.length > 0 ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FaBoxOpen className="text-gray-300 text-2xl" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">

                              <h4 className="font-semibold text-[#0B3D3A]">
                                {item.product?.name || "Product"}
                              </h4>

                              <p className="text-sm text-gray-500 mt-1">
                                Quantity: {item.quantity}
                              </p>

                              <p className="text-sm text-gray-500">
                                Price: ₹
                                {Number(item.price).toLocaleString(
                                  "en-IN"
                                )}
                              </p>

                            </div>

                            <div className="font-bold text-[#0B3D3A]">
                              ₹
                              {(
                                Number(item.price) *
                                item.quantity
                              ).toLocaleString("en-IN")}
                            </div>

                          </div>
                        ))}

                      </div>

                    </div>

                    {/* Delivery + Total */}
                    <div>

                      <div className="bg-[#F7EFE3] rounded-lg p-5">

                        <h3 className="font-display font-bold text-[#0B3D3A] mb-4">
                          Delivery Details
                        </h3>

                        <p className="font-semibold text-[#0B3D3A]">
                          {order.customerName}
                        </p>

                        <p className="text-gray-600 mt-2">
                          {order.customerPhone}
                        </p>

                        <p className="text-gray-600 mt-2">
                          {order.deliveryAddress}
                        </p>

                        <p className="text-gray-600">
                          {order.deliveryCity},{" "}
                          {order.deliveryState}
                        </p>

                        <p className="text-gray-600">
                          PIN: {order.deliveryPincode}
                        </p>

                      </div>

                      <div className="border-t border-gray-200 mt-5 pt-5">

                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Total
                          </span>

                          <span className="text-2xl font-bold text-[#0B3D3A]">
                            ₹
                            {Number(
                              order.totalAmount
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>

                      </div>

                      <div className="mt-4">

                        <p className="text-sm text-gray-500">
                          Order Status
                        </p>

                        <span className="inline-block mt-1 px-3 py-1 rounded-full bg-[#F3E4DC] text-[#B96A54] text-sm font-semibold">
                          {order.status}
                        </span>

                      </div>

                    </div>

                  </div>

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