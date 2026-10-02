import { useEffect, useState } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaHome,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import {
  getMyProfile,
  updateMyProfile,
} from "../../services/userService";

import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();

        if (response.success) {
          setProfile(response.user);

          setFormData({
            name: response.user.name || "",
            phone: response.user.phone || "",
            address: response.user.address || "",
          });
        }
      } catch (error) {
        console.error("PROFILE ERROR:", error);
        toast.error("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response = await updateMyProfile(formData);

      if (response.success) {
        setProfile(response.user);

        updateUser(response.user);

        setEditing(false);

        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF3E6]">
        <p className="font-semibold text-[#0B3D3A]">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF3E6] px-6 py-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">

          <div>
            <h1 className="text-3xl font-extrabold text-[#0B3D3A]">
              My Profile
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage your personal account information.
            </p>
          </div>

          {/* Home Button */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-[#0B3D3A] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#092F2D]"
          >
            <FaHome />
            <span>Home</span>
          </Link>

        </div>

        {/* Profile Card */}
        <div className="rounded-2xl bg-white p-8 shadow-md">

          {/* Avatar */}
          <div className="mb-8 flex items-center gap-5">

            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name || "Profile"}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0B3D3A] text-4xl text-white">
                <FaUser />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-[#0B3D3A]">
                {profile?.name}
              </h2>

              <p className="text-gray-500">
                {profile?.email}
              </p>

              <p className="mt-1 text-sm font-medium text-[#C97B65]">
                {profile?.role}
              </p>
            </div>

          </div>

          {!editing ? (
            <>
              {/* Name */}
              <div className="border-t border-gray-100 py-5">
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="mt-1 font-semibold text-[#0B3D3A]">
                  {profile?.name || "Not provided"}
                </p>
              </div>

              {/* Email */}
              <div className="border-t border-gray-100 py-5">
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="mt-1 font-semibold text-[#0B3D3A]">
                  {profile?.email || "Not provided"}
                </p>
              </div>

              {/* Phone */}
              <div className="border-t border-gray-100 py-5">
                <div className="flex items-center gap-3">

                  <FaPhone className="text-[#C97B65]" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="mt-1 font-semibold text-[#0B3D3A]">
                      {profile?.phone || "Not provided"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Address */}
              <div className="border-t border-gray-100 py-5">
                <div className="flex items-start gap-3">

                  <FaMapMarkerAlt className="mt-1 text-[#C97B65]" />

                  <div>
                    <p className="text-sm text-gray-500">
                      Address
                    </p>

                    <p className="mt-1 font-semibold text-[#0B3D3A]">
                      {profile?.address || "Not provided"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditing(true)}
                className="mt-5 flex items-center gap-2 rounded-lg bg-[#0B3D3A] px-5 py-3 font-semibold text-white transition hover:bg-[#092F2D]"
              >
                <FaEdit />
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSave}>

              {/* Name */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-[#0B3D3A]">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#0B3D3A]"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-[#0B3D3A]">
                  Email
                </label>

                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                />
              </div>

              {/* Phone */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-[#0B3D3A]">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#0B3D3A]"
                />
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-[#0B3D3A]">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#0B3D3A]"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#0B3D3A] px-6 py-3 font-semibold text-white hover:bg-[#092F2D] disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;