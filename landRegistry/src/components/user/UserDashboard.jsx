import { useState, useContext, useEffect } from "react";
import { LandContext } from "../../../context/LandRegistry";

const UserDashboard = () => {
  const { getUserContract , currentUser } = useContext(LandContext);
  const [userData, setUserData] = useState(null);
  // const currentUser = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"; // Replace with actual user wallet address

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserContract(currentUser);
        if (user) {
          setUserData({
            id: user[0],
            name: user[1],
            age: parseInt(user[2]._hex, 16), 
            city: user[3],
            aadharNumber: user[4],
            panNumber: user[5],
            documentUrl: user[6],
            email: user[7],
            isVerified: user[8],
          });
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    if (currentUser) {
      fetchUser();
    }
  }, [currentUser, getUserContract]);

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-10">
      {/* Profile Header */}
      <h1 className="text-4xl font-bold mb-8 text-blue-900 text-center">Your Profile</h1>

      {userData ? (
        <div className="space-y-6 text-lg">
          {/* User Name */}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Name:</span>
            <span>{userData.name}</span>
          </div>

       
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Age:</span>
            <span>{userData.age}</span>
          </div>

        
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Wallet Address:</span>
            <span className="text-blue-600 break-words">{userData.id}</span>
          </div>

         
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">City:</span>
            <span>{userData.city}</span>
          </div>

      
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Aadhar Number:</span>
            <span>{userData.aadharNumber}</span>
          </div>

       
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">PAN Number:</span>
            <span>{userData.panNumber}</span>
          </div>

        
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span>{userData.email}</span>
          </div>

      
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Verification Status:</span>
            {userData.isVerified ? (
              <span className="text-green-600 font-semibold">Verified</span>
            ) : (
              <span className="text-red-600 font-semibold">Not Yet Verified</span>
            )}
          </div>

        
          <div className="flex justify-center mt-8">
            <a
              href={userData.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
            >
              View Documents
            </a>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading user data...</p>
      )}
    </div>
  );
};

export default UserDashboard;
