import { useEffect, useState, useContext } from 'react';
import { FaUsers, FaHome, FaExchangeAlt, FaCheckCircle } from 'react-icons/fa';
import { LandContext } from '../../../context/LandRegistry';
import toast from 'react-hot-toast';
const LandInspectorDashboard = () => {
    const { verifyUser, returnAllUserList , returnAllLandList } = useContext(LandContext);
    const [userVerifyCount,mySentLandRequests, setUserVerifyCount] = useState(0); // State to hold verified user count
    const [totalUser, setTotalUser] = useState(0); // State to hold total user count
    const [totalLand , setTotalLand]= useState(0);

    const dashboardData = [
        {
            title: "Total Users Registered",
            count: totalUser, // Dynamically updated count
            bgColor: "bg-blue-600",
            icon: <FaUsers className="text-4xl" />, // User icon
        },
        {
            title: "Total Properties Registered",
            count: totalLand, // Example count
            bgColor: "bg-green-600",
            icon: <FaHome className="text-4xl" />, // Home icon
        },
        {
            title: "Total Properties Transferred",
            count: 0, // Example count
            bgColor: "bg-yellow-600",
            icon: <FaExchangeAlt className="text-4xl" />, // Exchange icon
        },
        // {
        //     title: "Total Users Verified", // New dashboard item
        //     count: totalUser, // Dynamically updated count
        //     bgColor: "bg-purple-600",
        //     icon: <FaCheckCircle className="text-4xl" />, // Check Circle icon for verified users
        // },
    ];

    
    useEffect(() => {
       
        const fetchTotalUser = async () => {
            try {
                
                const usersList = await returnAllUserList();
                const landList = await returnAllLandList();
                if (Array.isArray(usersList || landList)) {
                    setTotalUser(usersList.length); 
                    setTotalLand(landList.length); 
                } else {
                 
                    //toast.error("Returned data is not an array")
                }
            } catch (error) {
                console.error("Error fetching total users:", error);
                toast.error("Error fetching total users")
            }
        };

        fetchTotalUser();
    }, [returnAllUserList , returnAllLandList]);

    useEffect(() => {
       
        const fetchVerifiedUsers = async () => {
            try {
              
                const verifiedUsersList = await verifyUser();
                if (Array.isArray(verifiedUsersList)) {
                    setUserVerifyCount(verifiedUsersList.length); 
                } else {
                    console.error("Returned data is not an array");
                    //toast.error("Returned data is not an array")
                }
            } catch (error) {
                console.error("Error fetching verified users:", error);
                toast.error("Error fetching verified users")
            }
        };

        fetchVerifiedUsers();
    }, [verifyUser]);

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Welcome to the Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {dashboardData.map((data, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-6 rounded-lg shadow-lg text-white transform transition duration-300 ease-in-out hover:scale-105 ${data.bgColor}`}
                        >
                            <div>
                                <h3 className="text-xl font-bold">{data.title}</h3>
                                <p className="text-3xl font-extrabold">{data.count}</p>
                            </div>
                            <div className="h-16 w-16 flex items-center justify-center rounded-full border-4 border-white bg-opacity-30">
                                {data.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandInspectorDashboard;
