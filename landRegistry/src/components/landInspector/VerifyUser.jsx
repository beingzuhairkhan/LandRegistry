import React, { useState } from 'react';

const VerifyUser = () => {
    const [verifyUser, setVerifyUser] = useState([
        { id: 1, name: 'Zuhair Khan', address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', Aadhar: '200037338754', PAN: '200037338754', Document: "View Document" },
        { id: 2, name: 'Sufiyan Khan', address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', Aadhar: '200037338754', PAN: '200037338754', Document: "View Document" },
        { id: 3, name: 'Sami Khan', address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', Aadhar: '200037338754', PAN: '200037338754', Document: "View Document" },
    ]);

    const handleRemove = (id) => {
        setVerifyUser(verifyUser.filter(user => user.id !== id)); // Use 'verifyUser' instead of 'inspectors'
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
                    {verifyUser.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-100 border-b border-gray-200">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-6">{user.name}</td>
                            <td className="py-4 px-6">{user.address}</td>
                            <td className="py-4 px-6">{user.Aadhar}</td>
                            <td className="py-4 px-6">{user.PAN}</td>
                            <td className="py-4 px-6 text-center">
                                <a href="#" className="text-blue-500 hover:underline">{user.Document}</a>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <button
                                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                                    onClick={() => handleRemove(user.id)}
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
