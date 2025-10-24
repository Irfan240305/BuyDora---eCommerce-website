
import {useEffect, useState} from "react";
import Hero from "../components/Layout/Hero"; 
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrival from "../components/Products/NewArrival";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import {useDispatch, useSelector} from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productsSlice";
import axios from "axios";
// const placeholderProducts = [
//    {
//     _id: "1",
//     name:"Stylish Jacket",
//     price: 5999,
//     originalPrice: 7999,
//     images: [{url: "https://picsum.photos/500/500?random=1"},]
//   },
//     {
//     _id: "2",
//     name:"T-Shirt",
//     price: 1999,
//     originalPrice: 2999,
//     images: [{url: "https://picsum.photos/500/500?random=2"},]
//   },
//   {
//     _id: "3",
//     name:"Shirt",
//     price: 3999,
//     originalPrice: 4999,
//     images: [{url: "https://picsum.photos/500/500?random=3"},]
//   },
//   {
//     _id: "4",
//     name:"Baggy Jeans",
//     price: 1999,
//     originalPrice: 2999,
//     images: [{url: "https://picsum.photos/500/500?random=4"},]
//   },
//    {
//     _id: "5",
//     name:"Casual Sneakers",
//     price: 2999,
//     originalPrice: 5999,
//     images: [{url: "https://picsum.photos/500/500?random=5"},]
//   },
//     {
//     _id: "6",
//     name:"Chain",
//     price: 1999,
//     originalPrice: 2999,
//     images: [{url: "https://picsum.photos/500/500?random=6"},]
//   },
//   {
//     _id: "7",
//     name:"Bracelet",
//     price: 3999,
//     originalPrice: 4999,
//     images: [{url: "https://picsum.photos/500/500?random=7"},]
//   },
//   {
//     _id: "8",
//     name:"Stylish Watch",
//     price: 1999,
//     originalPrice: 2999,
//     images: [{url: "https://picsum.photos/500/500?random=8"},]
//   },
//]

const Home = () => {
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    //fetch products for a specific collection
    dispatch(
      fetchProductByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );
    // fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSellerProduct(response.data);
      } catch (error)
      {
        console.error(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero/>
      <GenderCollectionSection/>
      <NewArrival/>

      {/* Best Seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id} />): (<p className="text-center">Loading Best Seller product...</p>)}
    
      <div className="container mx-auto">
        <h2 className="text-2xl text-center font-medium mb-10">Top Wears for Women</h2>
        <ProductGrid products={products} loading={loading} error={error} />
        <FeaturedCollection/>
      </div>
      <FeaturesSection/>

    </div>
  )
}

export default Home