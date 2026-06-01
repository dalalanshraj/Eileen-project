import React from "react";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import logoIme from "../assets/logo/LOGO5.png"; // Default logo
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#467FF7] text-white py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Section */}
        <div>
          <Link to={"/"} className="flex items-center space-x-3">
            <img
              src={logoIme}
              alt="Logo"
              className="w-49"
            />
           
          </Link>
        </div>

        {/* Middle Section - Useful Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Useful Links</h2>
          <ul className="space-y-2">
             <li><a href="/" className="hover:text-gray-200">Home</a></li>
            <li><a href="/about-us" className="hover:text-gray-200">About</a></li>
            <li><a href="/properties" className="hover:text-gray-200">Properties</a></li>
            <li><a href="/reviews" className="hover:text-gray-200">Reviews</a></li>
            {/* <li>
              <a href="#" className="hover:text-gray-200">
                Privacy Policy
              </a>
            </li> */}
            {/* <li>
              <a href="#" className="hover:text-gray-200">
                Contact
              </a>
            </li> */}
          </ul>
        </div>

        {/* Right Section - Menu */}
        <div>
          <div className="flex items-center justify-between md:justify-start md:space-x-4 mb-4">
            {/* <h2 className="text-xl font-semibold">Location</h2> */}
            <Link to="/admin/login">
              <button className="bg-[#F8F812] text-black hover:bg-[#1B252F] hover:text-white text-sm font-medium px-4 py-2 rounded shadow flex items-center gap-2">
                <MdEmail />Admin Login 
              </button>
            </Link>
          </div>
          <ul className="space-y-2">
           
            {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d860.4813506066332!2d-86.41851143180864!3d30.38147609842223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88915b54a4223add%3A0x3ea02b1911b455dd!2s3290%20Scenic%20Hwy%2098%20103%20B%2C%20Destin%2C%20FL%2032541%2C%20USA!5e0!3m2!1sen!2sin!4v1778510969964!5m2!1sen!2sin" width="440" height="150" ></iframe> */}
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-white/30 pt-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-center md:text-left">
      © 2026 <a href="https://www.digifyamerica.com/">Digify America.</a>  All rights reserved.
        </p>
        {/* <div className="flex space-x-4 mt-3 md:mt-0">
          <a
            href="#"
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
          >
            <FaTwitter />
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
