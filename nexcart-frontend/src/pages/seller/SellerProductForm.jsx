import { useEffect, useState } from "react";

import { ArrowLeft, Save, Package, AlertCircle } from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

const SellerProductForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setFetching(true);
      setError("");

      const response = await api.get(`/api/seller/products/${id}`);

      const product = response.data;

      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        quantity: product.quantity ?? "",
        imageUrl: product.imageUrl || "",
      });
    } catch (error) {
      console.error("Failed to load product:", error);

      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message || "Failed to load product.";

      setError(message);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        quantity: Number(form.quantity),
        imageUrl: form.imageUrl.trim() || null,
      };

      if (isEditMode) {
        await api.put(`/api/seller/products/${id}`, payload);

        setSuccess("Product updated successfully.");
      } else {
        await api.post("/api/seller/products", payload);

        setSuccess("Product created successfully.");

        setForm({
          name: "",
          description: "",
          price: "",
          category: "",
          quantity: "",
          imageUrl: "",
        });
      }

      setTimeout(() => {
        navigate("/seller/products");
      }, 900);
    } catch (error) {
      console.error("Product save error:", error);

      const responseData = error.response?.data;

      let message = isEditMode
        ? "Failed to update product."
        : "Failed to create product.";

      if (typeof responseData === "string") {
        message = responseData;
      } else if (responseData?.message) {
        message = responseData.message;
      } else if (responseData?.error) {
        message = responseData.error;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="seller-page">
        <div className="seller-loading">
          <div className="seller-spinner"></div>

          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-page">
      <div className="seller-form-container">
        {/* BACK */}

        <Link to="/seller/products" className="seller-back-link">
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        {/* HEADER */}

        <div className="seller-form-header">
          <div className="seller-form-title">
            <div className="seller-form-icon">
              <Package size={23} />
            </div>

            <div>
              <h1>{isEditMode ? "Edit Product" : "Add Product"}</h1>

              <p>
                {isEditMode
                  ? "Update your product information."
                  : "Add a new product to your store."}
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}

        <form className="seller-product-form" onSubmit={handleSubmit}>
          {error && (
            <div className="seller-form-error">
              <AlertCircle size={19} />

              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="seller-form-success">
              <span>{success}</span>
            </div>
          )}

          {/* BASIC INFORMATION */}

          <div className="seller-form-section">
            <h2>Product Information</h2>

            <p>Enter the basic details of your product.</p>

            <div className="seller-form-grid">
              <div className="seller-field seller-field-full">
                <label htmlFor="name">Product Name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="seller-field seller-field-full">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your product"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={5}
                />
              </div>

              <div className="seller-field">
                <label htmlFor="category">Category</label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="e.g. Electronics"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="seller-field">
                <label htmlFor="imageUrl">Image URL</label>

                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* PRICING & INVENTORY */}

          <div className="seller-form-section">
            <h2>Pricing & Inventory</h2>

            <p>Set the product price and available stock.</p>

            <div className="seller-form-grid">
              <div className="seller-field">
                <label htmlFor="price">Price (₹)</label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={form.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="seller-field">
                <label htmlFor="quantity">Quantity</label>

                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="0"
                  value={form.quantity}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="seller-form-actions">
            <Link to="/seller/products" className="seller-cancel-btn">
              Cancel
            </Link>

            <button
              type="submit"
              className="seller-primary-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="seller-button-spinner"></span>

                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save size={18} />

                  {isEditMode ? "Update Product" : "Create Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerProductForm;
