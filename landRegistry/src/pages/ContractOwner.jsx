import { useState, useContext } from 'react';
import { FaUserPlus, FaUserEdit, FaSignOutAlt } from 'react-icons/fa';
import { HiUsers } from "react-icons/hi";
import AddLandInspectorForm from '../components/contractOwner/AddLandInspectorForm';
import AllLandInspector from '../components/contractOwner/AllLandInspector';
import ChangeContractOwner from '../components/contractOwner/ChangeContractOwner';
import { useNavigate } from "react-router-dom";
import { LandContext } from '../../context/LandRegistry'
const ContractOwner = () => {
  const [showForm, setShowForm] = useState(true); 
  const [showChangeOwner, setShowChangeOwner] = useState(false); 
  const { currentUser, isOwner, connectWallet, setCurrentUser } = useContext(LandContext)
  const navigate = useNavigate(); 
  // Dummy data for contract owner
  const ownerData = {
    name: "Zuhair Khan",
    logo: "https://shmector.com/_ph/4/209265408.png", 
  };

  const handleAddLandInspector = () => {
    setShowForm(true); 
    setShowChangeOwner(false); 
  };

  const handleAllLandInspectors = () => {
    setShowForm(false); 
    setShowChangeOwner(false); 
  };

  const handleChangeContractOwner = () => {
    setShowChangeOwner(true); 
    setShowForm(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Land Inspector Added");
    setShowForm(false);
  };


  const handleLogout = async () => {
    try {
      // await window.ethereum.request({
      //   method: "wallet_requestPermissions",
      //   params: [{ eth_accounts: {} }],
      // });

      setCurrentUser(null);
      navigate("/"); 
     // window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="max-h-full bg-gray-100 p-10 ">
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
            onClick={handleLogout}
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full">
            <FaSignOutAlt className="mr-2 h-6 w-6" />
            <span>Logout</span>
          </button>
          {/* <div>
      <h1>Welcome, {currentUser}</h1>
      {isOwner && <button onClick={connectWallet}>Connect Wallet</button>}
    </div> */}
          <div>
            {!currentUser ? (
              <button onClick={connectWallet} >
                Connect Wallet
              </button>
            ) : isOwner ? (
              <div>
                <h3 className="text-gray-500 text-lg mt-5" >Welcome, Contract Owner!</h3>
                <button onClick={() => alert('Owner can perform admin actions')}>Perform Admin Action</button>
              </div>
            ) : (
              <div>
                <h3>You are not the contract owner.</h3>
                <button onClick={connectWallet}>Connect Another Wallet</button>
              </div>
            )}
          </div>

        </nav>
      </aside>

    
      <main className="flex-1 p-6">
        {showChangeOwner ? (
          <ChangeContractOwner />
        ) : showForm ? (
          <AddLandInspectorForm onSubmit={handleFormSubmit} />
        ) : (
          <AllLandInspector /> 
        )}
      </main>
    </div>
  );
};

export default ContractOwner;
