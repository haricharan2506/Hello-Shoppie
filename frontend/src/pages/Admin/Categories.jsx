import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

import api from "../../api/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch categories
  // --------------------------------------------------

  const fetchCategories = async () => {
    try {
        setLoading(true);
        setError("");

        const response = await api.get("/categories");

        console.log("CATEGORY API RESPONSE:", response.data);
        console.log("CATEGORY ARRAY:", response.data.categories);

        setCategories(response.data.categories || []);
    } catch (err) {
        console.error("Failed to fetch categories:", err);

        setError(
        err.response?.data?.message ||
            "Failed to load categories"
        );
    } finally {
        setLoading(false);
    }
    };
  useEffect(() => {
    fetchCategories();
  }, []);

  // --------------------------------------------------
  // Handle input
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Open Add form
  // --------------------------------------------------

  const handleAdd = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
    });

    setError("");
    setShowForm(true);
  };

  // --------------------------------------------------
  // Open Edit form
  // --------------------------------------------------

  const handleEdit = (category) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      description: category.description || "",
    });

    setError("");
    setShowForm(true);
  };

  // --------------------------------------------------
  // Close form
  // --------------------------------------------------

  const handleCloseForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
    });

    setError("");
  };

  // --------------------------------------------------
  // Create / Update category
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingCategory) {
        // Update category
        await api.put(
          `/categories/${editingCategory.id}`,
          {
            name: formData.name.trim(),
            description: formData.description.trim(),
          }
        );
      } else {
        // Create category
        await api.post(
          "/categories",
          {
            name: formData.name.trim(),
            description: formData.description.trim(),
          }
        );
      }

      await fetchCategories();

      handleCloseForm();
    } catch (err) {
      console.error("Failed to save category:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save category"
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Delete category
  // --------------------------------------------------

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/categories/${category.id}`);

      await fetchCategories();
    } catch (err) {
      console.error("Failed to delete category:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#FFF3E6] p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">

        <div>
          <h1 className="text-3xl font-extrabold text-[#0B3D3A]">
            Categories
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your marketplace product categories
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C97B65] px-5 py-3 font-semibold text-white shadow-md transition hover:bg-[#B96A54] hover:shadow-lg"
        >
          <FaPlus />
          Add Category
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Category Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-[#0B3D3A]">
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingCategory
                  ? "Update the category details"
                  : "Create a new product category"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseForm}
              disabled={saving}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <FaTimes />
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0B3D3A]">
                Category Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Pet Supplies"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#C97B65] focus:ring-2 focus:ring-[#C97B65]/20"
                disabled={saving}
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0B3D3A]">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this category..."
                rows="4"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#C97B65] focus:ring-2 focus:ring-[#C97B65]/20"
                disabled={saving}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={handleCloseForm}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#0B3D3A] px-5 py-3 font-semibold text-white transition hover:bg-[#082F2D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingCategory
                  ? "Update Category"
                  : "Create Category"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Categories */}
      <div className="rounded-2xl bg-white shadow-md">

        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-xl font-bold text-[#0B3D3A]">
            Existing Categories
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {categories.length} categor
            {categories.length === 1 ? "y" : "ies"} available
          </p>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-12 text-center">

            <p className="text-gray-500">
              No categories found.
            </p>

            <button
              onClick={handleAdd}
              className="mt-4 font-semibold text-[#C97B65] hover:underline"
            >
              Add your first category
            </button>

          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col gap-4 px-6 py-5 transition hover:bg-[#FFF9F4] sm:flex-row sm:items-center sm:justify-between"
              >

                {/* Category information */}
                <div className="min-w-0">

                  <h3 className="text-lg font-bold text-[#0B3D3A]">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {category.description ||
                      "No description provided."}
                  </p>

                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">

                  <button
                    onClick={() =>
                      handleEdit(category)
                    }
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-[#0B3D3A] transition hover:bg-gray-50"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(category)
                    }
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <FaTrash />
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Categories;