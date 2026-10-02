import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaRupeeSign,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getSellerOrderById,updateSellerOrderStatus } from "../../services/orderService";

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getSellerOrderById(id);

        if (data.success) {
          setOrder(data.order);
          setSelectedStatus(data.order.status);
        }
      } catch (error) {
        console.error("SELLER ORDER DETAILS ERROR:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
        toast.error("Please select an order status.");
        return;
    }

    if (selectedStatus === order.status) {
        toast.info("Order status is already " + selectedStatus);
        return;
    }

    try {
        setUpdatingStatus(true);

        const data = await updateSellerOrderStatus(
        order.id,
        selectedStatus
        );

        if (data.success) {
        setOrder((prev) => ({
            ...prev,
            status: data.order.status,
        }));

        toast.success("Order status updated successfully.");
        }
    } catch (error) {
        console.error("UPDATE ORDER STATUS ERROR:", error);

        toast.error(
        error.response?.data?.message ||
            "Unable to update order status."
        );

        setSelectedStatus(order.status);
    } finally {
        setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="font-body min-h-screen bg-[#F7EFE3] px-6 py-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
          .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        `}</style>
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-10 text-center shadow-md">
          <p className="font-semibold text-[#0B3D3A]">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="font-body min-h-screen bg-[#F7EFE3] px-6 py-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
          .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        `}</style>
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-10 text-center shadow-md">
          <h2 className="font-display text-xl font-bold text-[#0B3D3A]">
            Order not found
          </h2>

          <button
            onClick={() => navigate("/seller/orders")}
            className="mt-5 rounded-xl bg-[#0B3D3A] px-5 py-3 font-bold text-white"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-body min-h-screen bg-[#F7EFE3] px-6 py-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
      `}</style>

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <button
              onClick={() => navigate("/seller/orders")}
              className="mb-4 flex items-center gap-2 text-sm font-bold text-[#0B3D3A] hover:underline"
            >
              <FaArrowLeft />
              Back to Orders
            </button>

            <h1 className="font-display text-3xl font-extrabold text-[#0B3D3A]">
              Order Details
            </h1>

            <p className="mt-2 text-gray-600">
              Order #{order.id}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-md">

            <p className="text-xs font-semibold uppercase text-gray-400">
                Order Status
            </p>

            <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={updatingStatus}
                className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-2 font-semibold text-[#0B3D3A] outline-none focus:border-[#C97B65]"
            >
                <option value="PENDING">
                Pending
                </option>

                <option value="CONFIRMED">
                Confirmed
                </option>

                <option value="SHIPPED">
                Shipped
                </option>

                <option value="DELIVERED">
                Delivered
                </option>

                <option value="CANCELLED">
                Cancelled
                </option>
            </select>

            <button
                onClick={handleStatusUpdate}
                disabled={
                updatingStatus ||
                selectedStatus === order.status
                }
                className="mt-3 w-full rounded-xl bg-[#0B3D3A] px-4 py-2 font-bold text-white transition hover:bg-[#145C52] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {updatingStatus
                ? "Updating..."
                : "Update Status"}
            </button>

            </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">

            {/* Customer */}
            <div className="rounded-2xl bg-white p-6 shadow-md">

              <h2 className="font-display mb-5 text-xl font-bold text-[#0B3D3A]">
                Customer Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="flex items-start gap-3">
                  <FaUser className="mt-1 text-[#C97B65]" />

                  <div>
                    <p className="text-xs text-gray-400">
                      Customer Name
                    </p>

                    <p className="mt-1 font-semibold text-gray-700">
                      {order.user?.name ||
                        order.customerName ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaPhone className="mt-1 text-[#C97B65]" />

                  <div>
                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <p className="mt-1 font-semibold text-gray-700">
                      {order.customerPhone ||
                        order.user?.phone ||
                        "N/A"}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Delivery */}
            <div className="rounded-2xl bg-white p-6 shadow-md">

              <h2 className="font-display mb-5 text-xl font-bold text-[#0B3D3A]">
                Delivery Address
              </h2>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-[#C97B65]" />

                <div className="text-gray-700">

                  <p className="font-semibold">
                    {order.deliveryAddress || "N/A"}
                  </p>

                  <p className="mt-1">
                    {order.deliveryCity || ""}
                    {order.deliveryState
                      ? `, ${order.deliveryState}`
                      : ""}
                  </p>

                  {order.deliveryPincode && (
                    <p className="mt-1">
                      PIN: {order.deliveryPincode}
                    </p>
                  )}

                </div>
              </div>
            </div>

            {/* Products */}
            <div className="rounded-2xl bg-white p-6 shadow-md">

              <h2 className="font-display mb-5 text-xl font-bold text-[#0B3D3A]">
                Your Products
              </h2>

              <div className="space-y-4">

                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center"
                  >

                    {/* Image */}
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-200">
                        <FaBoxOpen className="text-gray-400" size={24} />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1">

                      <h3 className="font-bold text-[#0B3D3A]">
                        {item.product?.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Unit Price: ₹
                        {Number(item.price).toLocaleString("en-IN")}
                      </p>

                    </div>

                    {/* Total */}
                    <div className="flex items-center font-bold text-[#0B3D3A]">
                      <FaRupeeSign size={14} />

                      {Number(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </div>

                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Order Summary */}
            <div className="rounded-2xl bg-white p-6 shadow-md">

              <h2 className="font-display mb-5 text-xl font-bold text-[#0B3D3A]">
                Order Summary
              </h2>

              <div className="space-y-4">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Order Date
                  </span>

                  <span className="font-semibold text-gray-700">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Payment
                  </span>

                  <span className="font-semibold text-gray-700">
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between">

                    <span className="font-bold text-[#0B3D3A]">
                      Order Total
                    </span>

                    <span className="flex items-center font-extrabold text-[#0B3D3A]">
                      <FaRupeeSign size={15} />

                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </span>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderDetails;