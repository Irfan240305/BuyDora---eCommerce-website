import React from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

// ✅ Placeholder image component
const ImagePlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
);

const ProductGrid = ({ products, loading, error }) => {
  // ✅ FIX: Better image URL handler
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.warn('⚠️ No image URL provided for product');
      return null;
    }
    
    // If it's already a full URL (http/https), use it as-is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's a relative path, prepend BASE_URL
    const fullUrl = `${BASE_URL}${imageUrl}`;
    console.log('🔗 Generated image URL:', fullUrl);
    return fullUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return <p className="text-center py-10 text-red-600">Error: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.isArray(products) && products.length > 0 ? (
        products.map((product) => {
          const imageUrl = product?.images?.[0]?.url;
          const fullImageUrl = getImageUrl(imageUrl);
          
          return (
            <Link key={product._id} to={`/product/${product._id}`} className="block group">
              <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="w-full h-96 mb-4 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {fullImageUrl ? (
                    <img
                      src={fullImageUrl}
                      alt={product?.images?.[0]?.altText || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('❌ Image failed to load:', fullImageUrl);
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }
                      }}
                      onLoad={() => {
                        console.log('✅ Image loaded successfully:', fullImageUrl);
                      }}
                    />
                  ) : null}
                  {!fullImageUrl && <ImagePlaceholder />}
                </div>
                <h3 className="text-sm mb-2 font-medium group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-900 font-semibold text-base">
                  Rs {product.price?.toLocaleString()}
                </p>
              </div>
            </Link>
          );
        })
      ) : (
        <p className="text-center col-span-full py-10">No products found.</p>
      )}
    </div>
  );
};

export default ProductGrid;
