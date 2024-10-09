import React, { useState } from 'react';

const AllLandInspector = () => {
    const [inspectors, setInspectors] = useState([
        { id: 1, name: 'Zuhair Khan', address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', city: 'Titwala' },
        { id: 2, name: 'Sufiyan Khan', address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', city: 'Kurla' },
        { id: 3, name: 'Sami Khan', address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', city: 'Ghatkopar' },
    ]);

    const handleRemove = (id) => {
        setInspectors(inspectors.filter(inspector => inspector.id !== id));
    };

    return (
        <div className="p-4">
            <h1 className="text-center text-3xl font-semibold mb-4">All Land Inspectors</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">No</th>
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Address</th>
                        <th className="py-3 px-6 text-left">City</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {inspectors.map((inspector, index) => (
                        <tr key={inspector.id} className="hover:bg-gray-100">
                            <td className="py-4 px-6">{index + 1}</td>
                            <td className="py-4 px-6">{inspector.name}</td>
                            <td className="py-4 px-6">{inspector.address}</td>
                            <td className="py-4 px-6">{inspector.city}</td>
                            <td className="py-4 px-6 text-center">
                                <button 
                                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                                    onClick={() => handleRemove(inspector.id)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllLandInspector;
