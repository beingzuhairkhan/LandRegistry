import React, { useState } from 'react';

const VerifyLand = () => {
    const [landRecords, setLandRecords] = useState([
        { id: 1, owner: '0xdD2FD458127....', PID: '120', location: 'Sector 12, City X', price: "1000000", surveyNo: "101", Document: "View Document", status: 'Pending' },
        { id: 2, owner: '0xdD2FD458127....', PID: '130', location: 'Sector 3, City Y', price: "99000000", surveyNo: "102", Document: "View Document", status: 'Verified' },
        { id: 3, owner: '0xdD2FD458127....', PID: '140', location: 'Sector 7, City Z', price: "5900000", surveyNo: "103", Document: "View Document", status: 'Rejected' },
    ]);

    const handleVerify = (id) => {
        setLandRecords(landRecords.map(record => record.id === id ? { ...record, status: 'Verified' } : record));
    };

    const handleReject = (id) => {
        setLandRecords(landRecords.map(record => record.id === id ? { ...record, status: 'Rejected' } : record));
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Verify Land Records</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-lg rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                            <th className="py-3 px-6 text-left">No</th>
                            <th className="py-3 px-6 text-left">Owner Address</th>
                            <th className="py-3 px-6 text-left">PID</th>
                            <th className="py-3 px-6 text-left">Location</th>
                            <th className="py-3 px-6 text-left">Price</th>
                            <th className="py-3 px-6 text-left">Survey No</th>
                            <th className="py-3 px-6 text-left">Document</th>
                            <th className="py-3 px-6 text-center">Status</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {landRecords.map((record, index) => (
                            <tr key={record.id} className="hover:bg-gray-100 border-b border-gray-200">
                                <td className="py-4 px-6">{index + 1}</td>
                                <td className="py-4 px-6 truncate">{record.owner}</td>
                                <td className="py-4 px-6">{record.PID}</td>
                                <td className="py-4 px-6">{record.location}</td>
                                <td className="py-4 px-6">{record.price}</td>
                                <td className="py-4 px-6">{record.surveyNo}</td>
                                <td className="py-4 px-6">
                                    <a href="#" className="text-blue-500 underline hover:text-blue-700">
                                        {record.Document}
                                    </a>
                                </td>
                                <td className={`py-4 px-6 text-center font-semibold ${record.status === 'Verified' ? 'text-green-500' : record.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                                    {record.status}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {record.status === 'Pending' && (
                                        <div className="flex justify-center">
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition"
                                                onClick={() => handleVerify(record.id)}
                                            >
                                                Verify
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                onClick={() => handleReject(record.id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VerifyLand;
