import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaEdit,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  getSellerProfile,
  updateSellerProfile,
} from "../../services/sellerAuthService";

import { useAuth } from "../../context/AuthContext";

function StoreProfile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getSellerProfile();

        if (response.success) {
          setProfile(response.seller);

          setFormData({
            name: response.seller.name || "",
            phone: response.seller.phone || "",
            address: response.seller.address || "",
          });
        }
      } catch (error) {
        console.error("SELLER PROFILE ERROR:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load seller profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes =[
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please select a JPEG, PNG, JPG, or WEBP image.");
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
        toast.error("Name is required.");
        return;
    }

    try {
        setSaving(true);

        const data = new FormData();

        data.append("name", formData.name.trim());
        data.append("phone", formData.phone.trim());
        data.append("address", formData.address.trim());

        if (avatarFile) {
        data.append("avatar", avatarFile);
        }

        const response = await updateSellerProfile(data);

        if (response.success) {
        setProfile(response.seller);
        updateUser(response.seller);

        setFormData({
            name: response.seller.name || "",
            phone: response.seller.phone || "",
            address: response.seller.address || "",
        });

        setAvatarFile(null);
        setAvatarPreview("");

        setEditing(false);

        toast.success("Profile updated successfully!");
        }
    } catch (error) {
        console.error(
        "UPDATE SELLER PROFILE ERROR:",
        error
        );

        toast.error(
        error.response?.data?.message ||
            "Unable to update profile."
        );
    } finally {
        setSaving(false);
    }
    };

  const handleCancel = () => {
    if (!profile) return;

    setFormData({
      name: profile.name || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });

    setAvatarFile(null);
    setAvatarPreview("");

    setEditing(false);
  };

  if (loading) {
    return (
      <div className="font-body min-h-screen bg-[#F7EFE3] px-6 py-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
          .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        `}</style>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-8 shadow-md">
            <p className="text-center text-gray-500">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="font-body min-h-screen bg-[#F7EFE3] px-6 py-8">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
          .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        `}</style>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-600">
              Unable to load seller profile.
            </p>
          </div>
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

      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-extrabold text-[#0B3D3A]">
            Store Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your seller information and store details.
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">

          {/* Profile Header */}
          <div className="bg-[#0B3D3A] px-8 py-8 text-white">
            <div className="flex flex-col items-center gap-4 sm:flex-row">

              {/* Avatar */}
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white text-4xl text-[#0B3D3A]">
                    {avatarPreview || profile.avatar ? (
                    <img
                        src={avatarPreview || profile.avatar}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                    />
                    ) : (
                    <FaUser />
                    )}
                </div>

                {editing && (
                  <>
                    <label
                      htmlFor="avatar"
                      className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#C97B65] text-white transition hover:bg-[#B96A54]"
                    >
                      <FaCamera />
                    </label>

                    <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                  </>
                )}
              </div>
              
              <div className="text-center sm:text-left">
                <h2 className="font-display text-2xl font-bold">
                  {profile.name}
                </h2>

                <p className="mt-1 text-sm text-gray-200">
                  {profile.email}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                  <FaCheckCircle
                    className={
                      profile.isApproved
                        ? "text-green-300"
                        : "text-[#E0BE7E]"
                    }
                  />

                  {profile.isApproved
                    ? "Approved Seller"
                    : "Pending Approval"}
                </div>
              </div>

            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">

            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-[#0B3D3A]">
                Personal Information
              </h3>

              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#0B3D3A] px-4 py-2 font-semibold text-white transition hover:bg-[#145C52]"
                >
                  <FaEdit />
                  Edit
                </button>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
                  Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4">
                  <FaUser className="text-gray-400" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full bg-transparent py-3 outline-none disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
                  Email
                </label>

                <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50 px-4">
                  <FaEnvelope className="text-gray-400" />

                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full bg-transparent py-3 text-gray-500 outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
                  Phone
                </label>

                <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4">
                  <FaPhone className="text-gray-400" />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter phone number"
                    className="w-full bg-transparent py-3 outline-none disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
                  Account Type
                </label>

                <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-gray-50 px-4">
                  <FaUser className="text-gray-400" />

                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full bg-transparent py-3 text-gray-500 outline-none"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
                  Address
                </label>

                <div className="flex gap-3 rounded-xl border-2 border-gray-200 px-4">
                  <FaMapMarkerAlt className="mt-4 text-gray-400" />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter store address"
                    rows={4}
                    className="w-full resize-none bg-transparent py-3 outline-none disabled:text-gray-500"
                  />
                </div>
              </div>

            </div>

            {/* Actions */}
            {editing && (
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-xl border-2 border-gray-200 px-6 py-3 font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-[#0B3D3A] px-7 py-3 font-bold text-white shadow-md transition hover:bg-[#145C52] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default StoreProfile;