import { useState ,useContext , useEffect} from 'react';
import { FaHome, FaPlusCircle, FaLandmark, FaInbox, FaPaperPlane, FaSignOutAlt } from 'react-icons/fa';
import UserDashboard from '../components/user/UserDashboard';
import AddLand from '../components/user/AddLand';
import MyLand from '../components/user/MyLand';
import LandGallery from '../components/user/LandGallery';
import ReceivedRequests from '../components/user/ReceivedRequests';
import SentRequests from '../components/user/SentRequests';
import {LandContext} from '../../context/LandRegistry'
const User = () => {
  const [activeSection, setActiveSection] = useState('dashboard'); 
  const { currentUser, getUserContract  ,  setCurrentUser} = useContext(LandContext)
  const [userData , setUserData] = useState([])

  console.log("User " ,currentUser )

  const handleLogout = async () => {
    try {
      if (window.ethereum && window.ethereum.request) {

        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
      }

      if (setCurrentUser) {
        setCurrentUser(null);
      }
  
      localStorage.removeItem("currentUser")
      sessionStorage.removeItem("currentUser");
  
      console.log("MetaMask disconnected. Please manually disconnect from MetaMask UI.");
  
      window.location.reload();
    } catch (error) {
      console.error("Error disconnecting MetaMask:", error);
    }
  };
  

  useEffect(()=>{
    const fetchData = async()=>{
      const user = await getUserContract(currentUser);
      setUserData(user)
      console.log("user data",user)
    }
  if(currentUser){
    fetchData()
  }

}, [currentUser, getUserContract]);

  const ownerData = {
    name: userData[1],
    logo: 'https://static.vecteezy.com/system/resources/previews/024/183/535/non_2x/male-avatar-portrait-of-a-young-man-with-glasses-illustration-of-male-character-in-modern-color-style-vector.jpg', // Placeholder logo URL
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="max-h-full bg-gray-100 p-10">
        <div>
          <div className="flex items-center justify-center">
            <img
              src={ownerData.logo}
              alt="User Avatar"
              className="h-20 w-20 rounded-full"
            />
          </div>
          <h2 className="flex items-center justify-center text-2xl font-bold mt-2 font-serif">
            {ownerData.name}
          </h2>
        </div>
        <nav className="space-y-8 mt-10">
          <button
            className={`flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full ${
              activeSection === 'dashboard' ? 'bg-blue-950 text-white' : ''
            }`}
            onClick={() => setActiveSection('dashboard')}
          >
            <FaHome className="mr-2 h-6 w-6" />
            <span>Dashboard</span>
          </button>
          <button
            className={`flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full ${
              activeSection === 'addLand' ? 'bg-blue-950 text-white' : ''
            }`}
            onClick={() => setActiveSection('addLand')}
          >
            <FaPlusCircle className="mr-2 h-6 w-6" />
            <span>Add Land</span>
          </button>
          <button
            className={`flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full ${
              activeSection === 'myLand' ? 'bg-blue-950 text-white' : ''
            }`}
            onClick={() => setActiveSection('myLand')}
          >
            <FaLandmark className="mr-2 h-6 w-6" />
            <span>My Land</span>
          </button>
          <button
            className={`flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full ${
              activeSection === 'landGallery' ? 'bg-blue-950 text-white' : ''
            }`}
            onClick={() => setActiveSection('landGallery')}
          >
            <FaLandmark className="mr-2 h-6 w-6" />
            <span>Land Gallery</span>
          </button>
          <button
            className={`flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full ${
              activeSection === 'receivedRequests' ? 'bg-blue-950 text-white' : ''
            }`}
            onClick={() => setActiveSection('receivedRequests')}
          >
            <FaInbox className="mr-2 h-6 w-6" />
            <span>My Received Requests</span>
          </button>
          <button
            className={`flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full ${
              activeSection === 'sentRequests' ? 'bg-blue-950 text-white' : ''
            }`}
            onClick={() => setActiveSection('sentRequests')}
          >
            <FaPaperPlane className="mr-2 h-6 w-6" />
            <span>My Sent Land Requests</span>
          </button>
          <button
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2 h-6 w-6" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeSection === 'dashboard' && <UserDashboard />}
        {activeSection === 'addLand' && <AddLand />}
        {activeSection === 'myLand' && <MyLand />}
        {activeSection === 'landGallery' && <LandGallery />}
        {activeSection === 'receivedRequests' && <ReceivedRequests />}
        {activeSection === 'sentRequests' && <SentRequests />}
      </main>
    </div>
  );
};

export default User;
