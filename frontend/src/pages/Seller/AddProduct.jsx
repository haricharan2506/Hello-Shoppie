import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaRupeeSign,
  FaBoxes,
  FaAlignLeft,
  FaTag,
  FaImages,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createProduct } from "../../services/productService";
import api from "../../api/api";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  // Selected image files
  const [selectedImages, setSelectedImages] = useState([]);

  // Preview URLs
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        const data = response.data;

        setCategories(data.categories || data.data || []);
      } catch (error) {
        console.error("CATEGORY ERROR:", error);
        toast.error("Unable to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    // Maximum 5 images
    if (selectedImages.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFiles.length > 0) {
      toast.error("Please select only image files.");
      return;
    }

    // Validate file size - 5MB per image
    const oversizedFiles = files.filter(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      toast.error("Each image must be smaller than 5MB.");
      return;
    }

    setSelectedImages((prev) => [
      ...prev,
      ...files,
    ]);

    const newPreviews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((prev) => [
      ...prev,
      ...newPreviews,
    ]);

    // Allow selecting the same file again
    e.target.value = "";
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setSelectedImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      description,
      price,
      stock,
      categoryId,
    } = formData;

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !stock ||
      !categoryId
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (Number(price) <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    if (Number(stock) < 0) {
      toast.error("Stock cannot be negative.");
      return;
    }

    // Require at least one image
    if (selectedImages.length === 0) {
      toast.error("Please select at least one product image.");
      return;
    }

    try {
      setSubmitting(true);

      // Create multipart form data
      const productData = new FormData();

      productData.append("name", name.trim());
      productData.append(
        "description",
        description.trim()
      );
      productData.append("price", Number(price));
      productData.append("stock", Number(stock));
      productData.append("categoryId", categoryId);

      // Add images
      selectedImages.forEach((image) => {
        productData.append("images", image);
      });

      await createProduct(productData);

      toast.success("Product created successfully!");

      // Clean up preview URLs
      imagePreviews.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );

      navigate("/seller/products");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to create product."
      );
    } finally {
      setSubmitting(false);
    }
  };

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
            Add Product
          </h1>

          <p className="mt-2 text-gray-600">
            Add a new product to your Shoppie store.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-md sm:p-8"
        >

          {/* Product Name */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
              Product Name
            </label>

            <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 focus-within:border-[#C97B65]">
              <FaBoxOpen className="text-gray-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
              Description
            </label>

            <div className="flex gap-3 rounded-xl border-2 border-gray-200 px-4 focus-within:border-[#C97B65]">
              <FaAlignLeft className="mt-4 text-gray-400" />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product"
                rows={5}
                className="w-full resize-none bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          {/* Price + Stock */}
          <div className="mb-6 grid gap-6 sm:grid-cols-2">

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
                Price
              </label>

              <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 focus-within:border-[#C97B65]">
                <FaRupeeSign className="text-gray-400" />

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
                Stock
              </label>

              <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 focus-within:border-[#C97B65]">
                <FaBoxes className="text-gray-400" />

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
              Category
            </label>

            <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 focus-within:border-[#C97B65]">
              <FaTag className="text-gray-400" />

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={loadingCategories}
                className="w-full bg-transparent py-3 outline-none"
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Images */}
          <div className="mb-8">

            <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
              Product Images
            </label>

            <p className="mb-4 text-xs text-gray-500">
              Upload up to 5 images. Each image must be smaller than
              5MB.
            </p>

            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="group relative aspect-square overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-100"
                  >

                    <img
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveImage(index)
                      }
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#C97B65] text-white shadow-md transition hover:scale-105"
                      title="Remove image"
                    >
                      <FaTimes size={12} />
                    </button>

                    {/* Image number */}
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white">
                      {index + 1}
                    </div>

                  </div>
                ))}

              </div>
            )}

            {/* Upload button */}
            {selectedImages.length < 5 && (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition hover:border-[#C97B65] hover:bg-[#F7EFE3]">

                <FaImages
                  size={28}
                  className="mb-3 text-[#0B3D3A]"
                />

                <span className="font-bold text-[#0B3D3A]">
                  Select Product Images
                </span>

                <span className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG — up to 5MB each
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>
            )}

          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/seller/products")
              }
              disabled={submitting}
              className="rounded-xl border-2 border-gray-200 px-6 py-3 font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#0B3D3A] px-7 py-3 font-bold text-white shadow-md transition hover:bg-[#145C52] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Uploading..."
                : "Create Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddProduct;