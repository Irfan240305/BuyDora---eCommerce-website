import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';

const NewArrival = () => {
  const scrollRef = useRef(null);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ✅ Helper function to get correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.warn('⚠️ No image URL for product');
      return `${BASE_URL}/images/placeholder.png`;
    }
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${BASE_URL}${imageUrl}`;
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products/new-arrivals`);
        console.log('📦 New arrivals fetched:', res.data);
        setNewArrivals(res.data);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error.message);
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth'
    });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth;
      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  return (
    <section className="bg-gray-50 px-4 lg:px-0">
      <div className="container mx-auto mb-10 relative flex flex-col items-center justify-center text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals! Enjoy Your Shopping</h2>
        <p className="text-lg text-gray-600 mb-6">
          Where fashion meets the future — explore the latest arrivals handpicked for trendsetters.
        </p>

        {/* Scroll Buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 bg-black text-white rounded hover:bg-gray-500 transition duration-300 ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Scroll left"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 bg-black text-white rounded hover:bg-gray-500 transition duration-300 ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Scroll right"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Scrollable Products */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} scrollbar-hide`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {loading ? (
          <p className="text-center w-full py-10 text-gray-600">Loading new arrivals...</p>
        ) : newArrivals.length === 0 ? (
          <p className="text-center w-full py-10 text-gray-600">No new arrivals available right now.</p>
        ) : (
          newArrivals.map((product) => {
            const imageUrl = product?.images?.[0]?.url;
            const fullImageUrl = getImageUrl(imageUrl);
            
            return (
              <div key={product._id} className="relative min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[25%] p-4">
                <img
                  src={fullImageUrl}
                  alt={product?.images?.[0]?.altText || product.name}
                  className="w-full h-[500px] object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  draggable="false"
                  onError={(e) => {
                    console.error('❌ Image failed to load:', fullImageUrl);
                    e.currentTarget.src = `${BASE_URL}/images/placeholder.png`;
                  }}
                  onLoad={() => {
                    console.log('✅ Image loaded:', fullImageUrl);
                  }}
                />
                <div className="absolute bottom-0 left-0 bg-white bg-opacity-90 p-4 backdrop-blur-md rounded-b-lg w-full">
                  <Link to={`/product/${product._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    <h4 className="font-medium text-black mb-2">{product.name}</h4>
                    <p className="text-black">Rs.{product.price}</p>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default NewArrival;
