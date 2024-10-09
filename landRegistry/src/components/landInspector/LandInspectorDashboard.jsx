import React from 'react';
import { FaUsers, FaHome, FaExchangeAlt } from 'react-icons/fa';

const LandInspectorDashboard = () => {
    const dashboardData = [
        {
            title: "Total Users Registered",
            count: 150, // Example count
            bgColor: "bg-blue-600",
            icon: <FaUsers className="text-4xl" />, // User icon
        },
        {
            title: "Total Properties Registered",
            count: 75, // Example count
            bgColor: "bg-green-600",
            icon: <FaHome className="text-4xl" />, // Home icon
        },
        {
            title: "Total Properties Transferred",
            count: 30, // Example count
            bgColor: "bg-yellow-600",
            icon: <FaExchangeAlt className="text-4xl" />, // Exchange icon
        },
    ];

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-semibold mb-6 text-gray-800">Welcome to the Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {dashboardData.map((data, index) => (
                        <div key={index} className={`flex items-center justify-between p-6 rounded-lg shadow-lg text-white transform transition duration-300 ease-in-out hover:scale-105 ${data.bgColor}`}>
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
