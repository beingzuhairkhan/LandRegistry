import React, { useState } from 'react';
import { FaUserPlus, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import { HiUsers } from "react-icons/hi";
import AddLandInspectorForm from '../components/contractOwner/AddLandInspectorForm';
import AllLandInspector from '../components/contractOwner/AllLandInspector';
import ChangeContractOwner from '../components/contractOwner/ChangeContractOwner'; // Import the component

const ContractOwner = () => {
  const [showForm, setShowForm] = useState(true); // Default form is shown
  const [showChangeOwner, setShowChangeOwner] = useState(false); // State for showing ChangeContractOwner

  // Dummy data for contract owner
  const ownerData = {
    name: "Zuhair Khan",
    logo: "https://via.placeholder.com/150", // Placeholder logo URL
  };

  const handleAddLandInspector = () => {
    setShowForm(true); // Show the form when "Add Land Inspector" is clicked
    setShowChangeOwner(false); // Hide ChangeContractOwner when adding land inspector
  };

  const handleAllLandInspectors = () => {
    setShowForm(false); // Hide the form when viewing all inspectors
    setShowChangeOwner(false); // Hide ChangeContractOwner when viewing inspectors
  };

  const handleChangeContractOwner = () => {
    setShowChangeOwner(true); // Show ChangeContractOwner component
    setShowForm(false); // Hide AddLandInspectorForm when changing owner
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Land Inspector Added");
    setShowForm(false); // Close the form after submission
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="h-full bg-gray-100 p-10">
        <div>
          <div className='flex items-center justify-center'>
            <img src={ownerData.logo} alt="Contract Owner Logo" className="h-20 w-20 rounded-full" />
          </div>
          <h2 className="flex items-center justify-center text-2xl font-bold mt-2 font-serif">{ownerData.name}</h2>
        </div>
        <nav className="space-y-8 mt-10">
          <button
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full"
            onClick={handleAddLandInspector}
          >
            <FaUserPlus className="mr-2 h-6 w-6" />
            <span>Add Land Inspector</span>
          </button>
          <button
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full"
            onClick={handleAllLandInspectors}
          >
            <HiUsers className="mr-2 h-6 w-6" />
            <span>All Land Inspectors</span>
          </button>
          <button
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full"
            onClick={handleChangeContractOwner} // Add onClick handler here
          >
            <FaUserEdit className="mr-2 h-6 w-6" />
            <span>Change Contract Owner</span>
          </button>
          <button 
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full">
            <FaSignOutAlt className="mr-2 h-6 w-6" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {showChangeOwner ? (
          <ChangeContractOwner /> // Show ChangeContractOwner component
        ) : showForm ? (
          <AddLandInspectorForm onSubmit={handleFormSubmit} />
        ) : (
          <AllLandInspector /> // Include AllLandInspector component here
        )}
      </main>
    </div>
  );
};

export default ContractOwner;
