import  { useState , useContext , useEffect} from 'react';
import { FaHome, FaCheckCircle, FaLandmark, FaExchangeAlt, FaSignOutAlt } from 'react-icons/fa';
import LandInspectorDashboard from '../components/landInspector/LandInspectorDashboard'
import VerifyUser from '../components/landInspector/VerifyUser'
import VerifyLand from '../components/landInspector/VerifyLand'
import TransferOwnerShip from '../components/landInspector/TransferOwnerShip'
import {LandContext} from '../../context/LandRegistry'
const LandInspector = () => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [showVerifyUser, setShowVerifyUser] = useState(false);
  const [showVerifyLand, setShowVerifyLand] = useState(false);
  const [showTransferOwnership, setShowTransferOwnership] = useState(false);
  const [inspectorData ,setInspectorData] = useState([])
  const { currentUser, returnAllLandInspectorList} = useContext(LandContext)
 // returnAllLandInspectorList
  const handleDashboard = () => {
    setShowDashboard(true);
    setShowVerifyUser(false);
    setShowVerifyLand(false);
    setShowTransferOwnership(false);
  };

  const handleVerifyUser = () => {
    setShowDashboard(false);
    setShowVerifyUser(true);
    setShowVerifyLand(false);
    setShowTransferOwnership(false);
  };

  const handleVerifyLand = () => {
    setShowDashboard(false);
    setShowVerifyUser(false);
    setShowVerifyLand(true);
    setShowTransferOwnership(false);
  };

  const handleTransferOwnership = () => {
    setShowDashboard(false);
    setShowVerifyUser(false);
    setShowVerifyLand(false);
    setShowTransferOwnership(true);
  };

  useEffect(()=>{

    const fetchData = async()=>{
      const data = await returnAllLandInspectorList(currentUser);
      setInspectorData(data)
      //console.log("data inspector",data)
    }
    if(currentUser){
      fetchData()
    }

  },[currentUser, returnAllLandInspectorList])

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out");
  };
  //  console.log("inspectorData" , inspectorData[0].name)
   const name = inspectorData[0]?.name
  const ownerData = {
    name:  name,
    logo: "https://static.vecteezy.com/system/resources/previews/024/183/525/non_2x/avatar-of-a-man-portrait-of-a-young-guy-illustration-of-male-character-in-modern-color-style-vector.jpg", // Placeholder logo URL
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="max-h-full bg-gray-100 p-10">
      <div>
          <div className='flex items-center justify-center'>
            <img src={ownerData.logo} alt="Contract Owner Logo" className="h-20 w-20 rounded-full" />
          </div>
          <h2 className="flex items-center justify-center text-2xl font-bold mt-2 font-serif">{ownerData.name}</h2>
        </div>
        <nav className="space-y-8 mt-10">
          <button
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full"
            onClick={handleDashboard}
          >
            <FaHome className="mr-2 h-6 w-6" />
            <span>Dashboard</span>
          </button>
          <button
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full"
            onClick={handleVerifyUser}
          >
            <FaCheckCircle className="mr-2 h-6 w-6" />
            <span>Verify User</span>
          </button>
          <button
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full"
            onClick={handleVerifyLand}
          >
            <FaLandmark className="mr-2 h-6 w-6" />
            <span>Verify Land</span>
          </button>
          <button
            className="flex items-center justify-start text-xl font-semibold hover:bg-blue-950 hover:text-white rounded-md p-2 hover:ring-2 hover:ring-blue-600 hover:ring-offset-2 hover:ring-blue-800 transition duration-300 ease-in-out w-full"
            onClick={handleTransferOwnership}
          >
            <FaExchangeAlt className="mr-2 h-6 w-6" />
            <span>Transfer Ownership</span>
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
        {showDashboard &&  <LandInspectorDashboard/>}
        {showVerifyUser && <VerifyUser/>}
        {showVerifyLand && <VerifyLand/>}
        {showTransferOwnership && <TransferOwnerShip/>}
      </main>
    </div>
  );
};

export default LandInspector;
