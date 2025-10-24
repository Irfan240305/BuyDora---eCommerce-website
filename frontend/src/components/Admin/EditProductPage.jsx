import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchProductDetails, updateProduct } from '../../redux/slices/productsSlice';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    countInStock: 0,
    sku: "",
    category: "", 
    brand: "",
    sizes: ["S", "M", "L", "XL"],
    sizesInput: "S,M,L,XL",
    colors: [],
    colorsInput: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        ...selectedProduct,
        sizesInput: selectedProduct.sizes?.join(',') || '',
        colorsInput: selectedProduct.colors?.join(',') || '',
      });
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  // ✅ Helper function to get correct image URL for display
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/no-image.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${BASE_URL}${imageUrl}`;
  };

  // ✅ FIXED IMAGE UPLOAD - NO MORE REFRESH
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('❌ Only image files are allowed (JPG, PNG, GIF, WEBP)');
      e.target.value = ""; // ✅ CLEAR INPUT
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ File size must be less than 5MB');
      e.target.value = ""; // ✅ CLEAR INPUT
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const { data } = response;
      console.log('✅ Image uploaded successfully:', data);

      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.url || data.filePath, altText: data.altText || "Product Image" }],
      }));

      alert('✅ Image uploaded successfully!');
      e.target.value = ""; // ✅ CLEAR INPUT AFTER UPLOAD
      setUploadProgress(0);
    } catch (error) {
      console.error("❌ Image upload error:", error);
      alert(`❌ Upload failed: ${error.response?.data?.message || error.message}`);
      e.target.value = ""; // ✅ CLEAR INPUT ON ERROR
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // ✅ REMOVE IMAGE
  const handleRemoveImage = (indexToRemove) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // ✅ SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!productData.name || !productData.price) {
      alert('❌ Please fill in all required fields');
      return;
    }

    try {
      await dispatch(updateProduct({ id, productData })).unwrap();
      alert('✅ Product updated successfully!');
      navigate("/admin/products");
    } catch (error) {
      console.error("❌ Update error:", error);
      alert(`❌ Failed to update product: ${error.message}`);
    }
  };

  if (loading) return <p className='text-emerald-500 text-center py-10'>⏳ Loading...</p>;
  if (error) return <p className='text-red-500 text-center py-10'>❌ Error: {error}</p>;
  if (!selectedProduct) return <p className='text-center py-10'>❌ Product not found</p>;

  return (
    <div className='max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md'>
      <h2 className='text-3xl font-bold mb-6'>✏️ Edit Product</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Product Name */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Product Name *</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        {/* Description */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Description *</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            rows={4}
            required
          />
        </div>

        {/* Price and Original Price */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label className='block font-semibold mb-2'>Price (Rs) *</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              min={0}
              step={0.01}
              required
            />
          </div>

          <div>
            <label className='block font-semibold mb-2'>Original Price (Rs) (Optional)</label>
            <input
              type="number"
              name="originalPrice"
              value={productData.originalPrice}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              min={0}
              step={0.01}
            />
          </div>
        </div>

        {/* Count In Stock */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Count In Stock *</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            min={0}
            required
          />
        </div>

        {/* SKU, Category, Brand, Gender */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label className='block font-semibold mb-2'>SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block font-semibold mb-2'>Category</label>
            <input
              type="text"
              name="category"
              value={productData.category}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block font-semibold mb-2'>Brand</label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block font-semibold mb-2'>Gender</label>
            <select
              name="gender"
              value={productData.gender}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Material */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Material</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleChange}
            className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder="e.g., Cotton, Polyester, Leather"
          />
        </div>

        {/* Sizes */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Sizes (comma-separated)</label>
          <input
            type="text"
            name="sizesInput"
            value={productData.sizesInput}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizesInput: e.target.value,
                sizes: e.target.value
                  .split(",")
                  .map((size) => size.trim())
                  .filter((size) => size !== ""),
              })
            }
            className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder="e.g., S, M, L, XL"
          />
        </div>

        {/* Colors */}
        <div className='mb-6'>
          <label className='block font-semibold mb-2'>Colors (comma-separated)</label>
          <input
            type="text"
            name="colorsInput"
            value={productData.colorsInput}
            onChange={(e) =>
              setProductData({
                ...productData,
                colorsInput: e.target.value,
                colors: e.target.value
                  .split(",")
                  .map((color) => color.trim())
                  .filter((color) => color !== ""),
              })
            }
            className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder="e.g., Red, Blue, Black"
          />
        </div>

        {/* ✅ IMAGE UPLOAD SECTION */}
        <div className='mb-6 border-2 border-dashed border-blue-300 p-6 rounded-lg'>
          <label className='block font-semibold mb-2 text-lg'>📸 Upload Product Images</label>
          <input 
            type="file" 
            onChange={handleImage}
            accept="image/*"
            disabled={uploading}
            className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
          />
          
          {uploading && (
            <div className='mt-4'>
              <p className='text-blue-600 font-semibold'>⏳ Uploading... {uploadProgress}%</p>
              <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Display existing images */}
          <div className='flex flex-wrap gap-4 mt-4'>
            {Array.isArray(productData.images) && productData.images.map((image, index) => (
              <div key={index} className='relative'>
                <img 
                  src={getImageUrl(image.url)}
                  alt={image.altText || `Product Image ${index + 1}`}
                  className='w-24 h-24 object-cover rounded-md shadow-md border-2 border-gray-300'
                  onError={(e) => {
                    if (e.currentTarget.src !== '/images/no-image.png') {
                      e.currentTarget.src = '/images/no-image.png';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className='absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 font-bold'
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {productData.images.length === 0 && (
            <p className='text-gray-500 text-sm mt-2'>📁 No images uploaded yet. Click above to add images.</p>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className='w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={uploading}
        >
          {uploading ? '⏳ Uploading...' : '✅ Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
