import {TbBrandMeta } from "react-icons/tb";
import {IoLogoInstagram } from "react-icons/io";
import {RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-emerald-900 text-white">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        <div className="hidden md:flex items-center space-x-4">
          <a href = "#" className="hover:text-gray-300">
            <TbBrandMeta className="h-5 w-5"/>
          </a>
          <a href = "#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5"/>
          </a>
          <a href = "#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-5 w-5"/>
          </a>
        </div>
        <div className="text-sm text-center flex-grow">
          <span>Shipping globally. Wherever you are, we’ve got you covered!</span>
        </div>
        <div className="text-sm hidden md:block">
          <a href="tel:+91 6381131508" className="hover:text-gray-300">+91 6381131508</a>

        </div>

      </div>
    </div>
  )
}

export default Topbar