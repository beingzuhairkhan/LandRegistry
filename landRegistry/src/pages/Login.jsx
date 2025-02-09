import React, { useState ,useContext  } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import {LandContext} from '../../context/LandRegistry'
import toast from 'react-hot-toast';
const Login = () => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
const { currentUser, isUserRegistered, connectWallet} = useContext(LandContext)
  // Connect to MetaMask and get the address
  

  const handleLogin = () => {
    if (address) {
      console.log(`Logged in with address: ${address}`);
      // Redirect to the user page after successful login
      navigate('/user');
      toast.success(" User Logged in successfully");
    } else {
      setError('Please connect your MetaMask wallet');
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center mt-10">
        <h1 className="text-5xl font-sans text-gray-800">Login</h1>
        <div className="h-1 w-10 bg-green-400 mt-4"></div>
      </div>

      <div className="mt-20">
        <div className="text-center border p-5 rounded-lg shadow-lg bg-gray-100 hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out w-64">
          <h1 className="font-semibold mt-4 text-lg text-gray-700">Login with MetaMask</h1>
          <p className="text-sm text-gray-500 mt-2">Connect your MetaMask wallet to log in.</p>
          <button
            onClick={connectWallet}
            className="mt-4 border border-blue-500 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Connect MetaMask
          </button>
          <button
            onClick={handleLogin}
            className="mt-4 border border-green-500 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Continue to User Page
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Login;
