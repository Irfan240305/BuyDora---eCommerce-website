import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSimilarProducts, fetchProductDetails } from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import ChatWidget from "../Chat/ChatWidget";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  // Helper function to get correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/500";
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${BASE_URL}${imageUrl}`;
  };

  // Fetch product details and similar products
  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
      
      // Reset selections when product changes
      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);
    }
  }, [dispatch, productFetchId]);

  // Set main image when product loads
  useEffect(() => {
    if (Array.isArray(selectedProduct?.images) && selectedProduct.images.length > 0) {
      setMainImage(getImageUrl(selectedProduct.images[0]?.url));
    } else {
      setMainImage("https://via.placeholder.com/500");
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color before adding to cart.", { duration: 1500 });
      return;
    }
    
    setIsButtonDisabled(true);
    
    try {
      await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId: user?._id,
        })
      ).unwrap();
      toast.success("Product added to the cart", { duration: 1500 });
    } catch (err) {
      toast.error("Failed to add product to cart", { duration: 1500 });
      console.error("Add to cart error:", err);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading....</p>;
  if (error) return <p className="p-6 text-center text-red-600">Error: {error}</p>;
  if (!selectedProduct) return <p className="text-center text-gray-500">Product not found</p>;

  return (
    <div className="p-6">
      <Toaster />
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Thumbnails (desktop) */}
          <div className="hidden md:flex flex-col space-y-4">
            {Array.isArray(selectedProduct.images) &&
              selectedProduct.images.map((image, index) => {
                const url = getImageUrl(image?.url);
                return (
                  <img
                    key={index}
                    src={url}
                    alt={image?.altText || `Thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border hover:border-blue-500 transition-colors duration-200 ${
                      mainImage === url ? "border-blue-500" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(url)}
                    onError={(e) => {
                      if (e.currentTarget.src !== "https://via.placeholder.com/500") {
                        e.currentTarget.src = "https://via.placeholder.com/500";
                      }
                    }}
                  />
                );
              })}
          </div>

          {/* Main Image */}
          <div className="mb-6 md:w-[500px] md:h-[500px] flex items-center justify-center">
            <img
              src={mainImage || "https://via.placeholder.com/500"}
              alt={selectedProduct?.name || "Product Image"}
              className="w-[500px] h-[500px] object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                if (e.currentTarget.src !== "https://via.placeholder.com/500") {
                  e.currentTarget.src = "https://via.placeholder.com/500";
                }
              }}
            />
          </div>

          {/* Mobile Thumbnails */}
          <div className="md:hidden flex overflow-x-auto space-x-4 mb-4">
            {Array.isArray(selectedProduct.images) &&
              selectedProduct.images.map((image, index) => {
                const url = getImageUrl(image?.url);
                return (
                  <img
                    key={index}
                    src={url}
                    alt={image?.altText || `Thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border hover:border-blue-500 transition-colors duration-200 ${
                      mainImage === url ? "border-blue-500" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(url)}
                    onError={(e) => {
                      if (e.currentTarget.src !== "https://via.placeholder.com/500") {
                        e.currentTarget.src = "https://via.placeholder.com/500";
                      }
                    }}
                  />
                );
              })}
          </div>

          {/* Right section */}
          <div className="md:w-1/2 md:ml-10">
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>

            {selectedProduct.originalPrice && (
              <p className="text-lg text-gray-700 mb-4 line-through">
                Rs {selectedProduct.originalPrice}
              </p>
            )}

            <p className="text-3xl font-semibold text-blue-600 mb-4">Rs {selectedProduct.price}</p>

            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="text-gray-700 font-medium">
                Color: {selectedColor && <span className="text-blue-600">{selectedColor}</span>}
              </p>
              <div className="flex space-x-2 mt-2">
                {Array.isArray(selectedProduct.colors) && selectedProduct.colors.length > 0 ? (
                  selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 focus:outline-none transition-all duration-200 ${
                        selectedColor === color ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color?.toLowerCase() || "#ffffff",
                      }}
                      title={color}
                      aria-label={`Select ${color} color`}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No color options available</p>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="text-gray-700 font-medium">Size:</p>
              <div className="flex gap-2 mt-2">
                {Array.isArray(selectedProduct.sizes) && selectedProduct.sizes.length > 0 ? (
                  selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedSize === size
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 hover:bg-blue-100 border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No size options available</p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-gray-700 font-medium">Quantity</p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-semibold disabled:opacity-50"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-lg font-medium min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-semibold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200 ${
                isButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "Add to Cart"}
            </button>

            {/* Characteristics */}
            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Characteristics</h3>
              <table className="w-full text-left text-sm text-gray-700">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Brand</td>
                    <td className="py-2">{selectedProduct.brand || "-"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Material</td>
                    <td className="py-2">{selectedProduct.material || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="text-2xl text-center font-medium mb-10">You May Also Like</h2>
          {Array.isArray(similarProducts) && similarProducts.length > 0 ? (
            <ProductGrid products={similarProducts} loading={false} error={null} />
          ) : (
            <p className="text-center text-gray-500">No related products found</p>
          )}
        </div>
      </div>

      <ChatWidget page="product-details" />
    </div>
  );
};

export default ProductDetails;
