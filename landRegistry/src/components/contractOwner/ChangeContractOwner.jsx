import React, { useState } from 'react';

const ChangeContractOwner = () => {
    const [address, setAddress] = useState('');

    const handleChange = (e) => {
        setAddress(e.target.value);
    };

    const handleSubmit = () => {
        // Logic to change the contract owner goes here
        console.log("Changing contract owner to:", address);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold mb-4">Change Contract Owner</h2>
            <div className="flex">
                <input
                    type="text"
                    placeholder="Enter new owner address"
                    value={address}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Tailwind CSS classes for styling
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white p-2 rounded ml-2 hover:bg-blue-600 transition duration-300" // Tailwind CSS classes for styling
                >
                    Change Owner
                </button>
            </div>
        </div>
    );
};

export default ChangeContractOwner;
