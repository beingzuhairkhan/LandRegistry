// import React from 'react';

const Contact = () => {
    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Us</h1>
                <p className="text-center text-gray-600 mb-8">
                    If you have any questions or need further assistance regarding the Land Registry System on Blockchain, feel free to reach out to us. We’re here to help!
                </p>
                <form className="space-y-6">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-gray-700 font-medium">Your Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Enter your full name" 
                            className="border border-gray-300 p-3 rounded-md mt-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Enter your email" 
                            className="border border-gray-300 p-3 rounded-md mt-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="message" className="text-gray-700 font-medium">Message</label>
                        <textarea 
                            id="message" 
                            placeholder="How can we assist you?" 
                            className="border border-gray-300 p-3 rounded-md mt-2 h-32 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition duration-300"
                    >
                        Submit
                    </button>
                </form>
                <div className="text-center text-gray-600 mt-8">
                    <p>If you prefer, you can reach us directly at:</p>
                    <p className="font-medium">Email: support@landregistryblockchain.com</p>
                    <p className="font-medium">Phone: +1 (123) 456-7890</p>
                </div>
            </div>
        </div>
    );
}

export default Contact;
