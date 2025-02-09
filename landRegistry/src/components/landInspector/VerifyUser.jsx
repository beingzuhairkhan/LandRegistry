import { useState, useEffect, useContext } from "react";
import { LandContext } from "../../../context/LandRegistry";

const VerifyUser = () => {
    const { verifyUser, returnAllUserList } = useContext(LandContext); 
    const [verifyUsers, setVerifyUsers] = useState([]);

 
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await returnAllUserList(); 
                // console.log("user" , users)
                setVerifyUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [returnAllUserList]); 

 
    const handleVerify = async (userId) => {
        console.log("User ID to verify:", userId); 
        try {
            await verifyUser(userId); 
            alert("User verified successfully");
            setVerifyUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); 
        } catch (error) {
            console.error("Error verifying user:", error);
            alert("Failed to verify user. Please try again.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-center text-3xl font-semibold mb-4">Verify Land Inspectors</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">No</th>
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Address</th>
                        <th className="py-3 px-6 text-left">Aadhar</th>
                        <th className="py-3 px-6 text-left">PAN</th>
                        <th className="py-3 px-6 text-center">Document</th>
                        <th className="py-3 px-6 text-center">Verify</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {verifyUsers.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-100 border-b border-gray-200">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-6">{user?.name}</td>
                            <td className="py-4 px-6">{user?.id}</td>
                            <td className="py-4 px-6">{user?.aadharNumber}</td>
                            <td className="py-4 px-6">{user?.panNumber}</td>
                            <td className="py-4 px-6 text-center">
                                <a href={user?.document} className="text-blue-500 cursor-pointer hover:underline">
                                    View Document
                                </a>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <button
                                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                                    onClick={() => handleVerify(user?.id)} // Pass user.id instead of the whole user object
                                >
                                    Verify
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VerifyUser;
