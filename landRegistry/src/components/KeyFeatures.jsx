// src/components/KeyFeatures.js
// import React from 'react';
import { FaLock, FaMoneyBillWave, FaCheckCircle, FaHeadset } from 'react-icons/fa';

const features = [
    {
        id: 1,
        icon: <FaLock className="text-blue-500 w-12 h-12" />,
        title: 'Quick and Secure Registration',
        description: 'Register your land quickly with top-notch security measures to protect your data.',
    },
    {
        id: 2,
        icon: <FaMoneyBillWave className="text-green-500 w-12 h-12" />,
        title: 'Transparent Fee Structure',
        description: 'Understand all fees upfront with our clear and transparent pricing model.',
    },
    {
        id: 3,
        icon: <FaCheckCircle className="text-purple-500 w-12 h-12" />,
        title: 'Government-Approved Verification Process',
        description: 'Our verification process is approved by government authorities for your peace of mind.',
    },
    {
        id: 4,
        icon: <FaHeadset className="text-red-500 w-12 h-12" />,
        title: '24/7 Support for Users',
        description: 'Get assistance anytime with our round-the-clock customer support team.',
    },
];

const KeyFeatures = () => {
    return (
        <div className="p-20" >
            <div className="flex flex-col items-center mt-20 ">
                <h1 className="text-5xl font-sans text-gray-800">Key Features</h1>
                <div className="h-1 w-10 bg-green-400 mt-4"></div>
            </div>
            <section className="py-12 ">
                <div className="container mx-auto px-4">
                 
                    <div className="flex flex-wrap -mx-4 mt-10">
                        {features.map((feature) => (
                            <div key={feature.id} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
                                <div className="bg-gray-100 rounded-lg shadow-lg p-6 text-center flex flex-col justify-between h-full hover:shadow-2xl transition-shadow duration-300">
                                    <div className="flex justify-center items-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default KeyFeatures;
