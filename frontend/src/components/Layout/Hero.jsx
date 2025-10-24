

import heroImg from "../../assets/Homepage.jpg";
import { Link } from "react-router-dom";
const Hero = () => {
  return <section className="relative w-full h-[60vh] overflow-hidden">
    <img src={heroImg} alt="Rabbit" className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"/>
    <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
      <div className="text-center text-white p-6 ">
        <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">VACATION <br />Ready
        </h1>
        <p className="text-sm tracking-tighter md:text-lg mb-6">Jet-set in style — discover vacation-ready outfits with lightning-fast worldwide delivery!</p>
        <Link to="#" className="bg-Buydora-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors">Shop Now</Link>
      </div>
    </div>
  </section>;
}

export default Hero