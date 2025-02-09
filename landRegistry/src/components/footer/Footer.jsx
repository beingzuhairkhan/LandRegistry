import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'; // Importing social media icons

const Footer = () => {
  return (
    <footer className=" text-black  left-10">
      <hr className="border-gray-300 opacity-50 mb-6" />
      <div className="max-w-6xl mx-auto px-10 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="" >
            <h4 className="text-xl font-bold mb-4">About Us</h4>
            <p className="text-gray-600">
              We are committed to providing a secure and transparent land registration system using blockchain technology.
            </p>
          </div>

          {/* Useful Links Section */}
          <div>
            <h4 className="text-xl font-bold mb-4">Useful Links</h4>
            <ul className="text-gray-600 space-y-2">
              <li><a href="/faq" className="hover:text-gray-800">FAQ</a></li>
              <li><a href="/about" className="hover:text-gray-800">About Us</a></li>
              <li><a href="/contact" className="hover:text-gray-800">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-gray-800">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-xl font-bold mb-4">Contact Us</h4>
            <p className="text-gray-600">Email: <a href="mailto:support@landregistry.com" className="hover:text-gray-800">support@landregistry.com</a></p>
            <p className="text-gray-600">Phone: <a href="tel:+1234567890" className="hover:text-gray-800">+1 234 567 890</a></p>
          </div>
        </div>

        {/* Social Media Icons */}
        <hr className="border-gray-300 opacity-50 mt-10" />
        <div className="mt-6 flex justify-center space-x-6">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
            <FaTwitter className="h-6 w-6" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
            <FaLinkedin className="h-6 w-6" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
            <FaGithub className="h-6 w-6" />
          </a>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className="text-center text-gray-500 mt-6">
        © {new Date().getFullYear()} Land Registry System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
