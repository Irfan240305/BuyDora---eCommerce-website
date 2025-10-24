import React from 'react'
import { Link } from "react-router-dom";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { FiPhoneCall } from 'react-icons/fi';
const Footer = () => {
  return (
    <footer className=" px-4 sm:px-8 md:px-16 border-t border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div>
          <h3 className="mt-6 text-lg text-gray-800 mb-4 font-semibold">Newsletter</h3>
          <p className="text-gray-500 mb-4">Heyy guys! Be the first to hear about new products, events and online orders exclusively!</p>
          <p className="font-medium text-sm text-gray-700 mb-6">Sign up and get 15% off your first order</p>

          {/* Newsletter form */}
          <form className="flex">
            <input type="email" placeholder="Enter your email" className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md 
            focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all" required></input>
            <button type="submit" className="bg-Buydora-red text-white px-4 py-3 rounded-r-md text-sm font-semibold hover:bg-red-600 transition-all">
              SUBSCRIBE
            </button>
          </form>
        </div>
        {/* Shop Links */}
        <div>
          <h3 className="mt-6 text-lg text-gray-800 mb-4 font-semibold">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-700 transition-colors">Men's Top Wear</Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-700 transition-colors">Women's Top Wear</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-700 transition-colors">Men's Bottom Wear</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-700 transition-colors">Women's Top Wear</Link>
            </li>
          </ul>
        </div>
        {/* Support Links */}
        <div>
          <h3 className="mt-6 text-lg text-gray-800 mb-4 font-semibold ">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="hover:text-gray-700 transition-colors">Contact Us</Link>
            </li>

            <li>
              <Link to="#" className="hover:text-gray-700 transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-700 transition-colors">FAQs</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-700 transition-colors">Features</Link>
            </li>
          </ul>
        </div>
        {/* Legal Links */}
        <div className="mt-6">


          <h3 className="text-lg text-gray-800 mb-4 font-semibold">Follow Us</h3>

          <div className="flex items-center space-x-4 mb-6">

            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
            <TbBrandMeta className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
            <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
            <RiTwitterXLine className="h-5 w-5" />
            </a>
          </div>

          <div className="space-y-1">
            <p className="text-lg text-gray-800 font-semibold">Call Us</p>
            <p className="flex items-center text-gray-700 text-sm font-semibold space-x-1">
            <FiPhoneCall className="mr-2 text-lg block-inline font-bold" />
            <span>+91 6381131508</span>
            </p>
          </div>
        </div>
        
        </div> 

        {/* Footer Bottom */}
        <div className="border-t border-gray-300 pt-6 pb-4">
         <p className="text-gray-500 text-sm tracking-tighter text-center">
         © 2025, CompileTab, All Rights Reserved.
        </p>
        


      </div>

    </footer>
  )
}

export default Footer