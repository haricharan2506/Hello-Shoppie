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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getProductById,
  updateProduct,
} from "../../services/productService";
import api from "../../api/api";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  // Existing Cloudinary images
  const [existingImages, setExistingImages] = useState([]);

  // New image files
  const [newImages, setNewImages] = useState([]);

  // New image previews
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // Load product + categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [productResponse, categoryResponse] =
          await Promise.all([
            getProductById(id),
            api.get("/categories"),
          ]);

        const categoryData = categoryResponse.data;

        const product =
          productResponse.product;

        if (!product) {
          throw new Error("Product not found");
        }

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          categoryId: product.categoryId || "",
        });

        setExistingImages(product.images || []);

        setCategories(
          categoryData.categories ||
            categoryData.data ||
            []
        );
      } catch (error) {
        console.error(
          "EDIT PRODUCT LOAD ERROR:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Unable to load product."
        );

        navigate("/seller/products");
      } finally {
        setLoading(false);
        setLoadingCategories(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Remove an existing Cloudinary image
  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // Add new images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    const totalImages =
      existingImages.length +
      newImages.length +
      files.length;

    if (totalImages > 5) {
      toast.error(
        "A product can have a maximum of 5 images."
      );
      return;
    }

    const invalidFiles = files.filter(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFiles.length > 0) {
      toast.error(
        "Please select only image files."
      );
      return;
    }

    const oversizedFiles = files.filter(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      toast.error(
        "Each image must be smaller than 5MB."
      );
      return;
    }

    setNewImages((prev) => [
      ...prev,
      ...files,
    ]);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setNewImagePreviews((prev) => [
      ...prev,
      ...previews,
    ]);

    e.target.value = "";
  };

  // Remove newly selected image
  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(
      newImagePreviews[index]
    );

    setNewImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setNewImagePreviews((prev) =>
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
      stock === "" ||
      !categoryId
    ) {
      toast.error(
        "Please fill in all fields."
      );
      return;
    }

    if (Number(price) <= 0) {
      toast.error(
        "Price must be greater than 0."
      );
      return;
    }

    if (Number(stock) < 0) {
      toast.error(
        "Stock cannot be negative."
      );
      return;
    }

    const totalImages =
      existingImages.length +
      newImages.length;

    if (totalImages === 0) {
      toast.error(
        "Please keep or add at least one product image."
      );
      return;
    }

    if (totalImages > 5) {
      toast.error(
        "A product can have a maximum of 5 images."
      );
      return;
    }

    try {
      setSubmitting(true);

      const productData = new FormData();

      productData.append(
        "name",
        name.trim()
      );

      productData.append(
        "description",
        description.trim()
      );

      productData.append(
        "price",
        Number(price)
      );

      productData.append(
        "stock",
        Number(stock)
      );

      productData.append(
        "categoryId",
        categoryId
      );

      // Tell backend which existing images to keep
      productData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      // Add newly selected images
      newImages.forEach((image) => {
        productData.append(
          "images",
          image
        );
      });

      await updateProduct(
        id,
        productData
      );

      toast.success(
        "Product updated successfully!"
      );

      newImagePreviews.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );

      navigate("/seller/products");
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="font-body flex min-h-screen items-center justify-center bg-[#F7EFE3]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .font-display { font-family: 'Baloo 2', system-ui, sans-serif; }
          .font-body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        `}</style>
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0B3D3A]" />

          <p className="font-semibold text-[#0B3D3A]">
            Loading product...
          </p>
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
            Edit Product
          </h1>

          <p className="mt-2 text-gray-600">
            Update your product details and images.
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

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Existing Images */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
              Current Product Images
            </label>

            {existingImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                {existingImages.map(
                  (image, index) => (
                    <div
                      key={image}
                      className="relative aspect-square overflow-hidden rounded-xl border-2 border-gray-200"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveExistingImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#C97B65] text-white shadow-md transition hover:scale-105"
                        title="Remove image"
                      >
                        <FaTimes size={12} />
                      </button>

                      <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white">
                        {index + 1}
                      </div>
                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                No existing images.
              </div>
            )}
          </div>

          {/* New Images */}
          <div className="mb-8">

            <label className="mb-2 block text-sm font-bold text-[#0B3D3A]">
              Add New Images
            </label>

            {newImagePreviews.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                {newImagePreviews.map(
                  (preview, index) => (
                    <div
                      key={preview}
                      className="relative aspect-square overflow-hidden rounded-xl border-2 border-gray-200"
                    >
                      <img
                        src={preview}
                        alt={`New product image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveNewImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#C97B65] text-white shadow-md transition hover:scale-105"
                        title="Remove image"
                      >
                        <FaTimes size={12} />
                      </button>

                      <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white">
                        New
                      </div>
                    </div>
                  )
                )}

              </div>
            )}

            {existingImages.length +
              newImages.length <
              5 && (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition hover:border-[#C97B65] hover:bg-[#F7EFE3]">

                <FaImages
                  size={28}
                  className="mb-3 text-[#0B3D3A]"
                />

                <span className="font-bold text-[#0B3D3A]">
                  Select New Images
                </span>

                <span className="mt-1 text-xs text-gray-500">
                  PNG, JPG, JPEG, WEBP — up to 5MB
                  each
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

            <p className="mt-2 text-xs text-gray-500">
              {existingImages.length +
                newImages.length}{" "}
              / 5 images selected
            </p>
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
                ? "Updating..."
                : "Update Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProduct;