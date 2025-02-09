// import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r text-justify p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-900">Welcome to the Future of Land Registry</h1>
                <p className="text-gray-800 mb-6 text-lg">
                    Imagine a world where land ownership is secure, transparent, and effortless. Our Land Registry System is making that world a reality. By leveraging the power of blockchain technology, we are transforming the way land records are managed, offering a faster, safer, and more efficient solution for property transactions.
                </p>
                <h2 className="text-3xl font-semibold mt-4 mb-2 text-gray-900">Why Choose Us?</h2>
                <ul className="list-disc list-inside mb-4 text-gray-800 text-lg">
                    <li>🔐 <strong>Unmatched Security:</strong> Blockchain encryption ensures every transaction is tamper-proof and safeguarded against fraud.</li>
                    <li>🌍 <strong>Global Transparency:</strong> Anyone, anywhere can verify ownership records, fostering trust and eliminating disputes.</li>
                    <li>⚡ <strong>Lightning-Fast Processing:</strong> Our system cuts through bureaucratic delays, making property transfers swift and hassle-free.</li>
                    <li>📱 <strong>Accessible Anytime, Anywhere:</strong> Whether you’re a buyer, seller, or government official, access our platform from the convenience of your device.</li>
                </ul>
                <h2 className="text-3xl font-semibold mt-4 mb-2 text-gray-900">The Power of Blockchain</h2>
                <p className="text-gray-800 mb-4 text-lg">
                    Blockchain technology is the backbone of our platform. It’s decentralized, meaning no single entity controls the system, making it highly secure. With smart contracts, land transactions are automated and executed with precision, reducing human error and enhancing trust.
                </p>
                <h2 className="text-3xl font-semibold mt-4 mb-2 text-gray-900">Our Mission</h2>
                <p className="text-gray-800 mb-4 text-lg">
                    Our mission is simple: to revolutionize land ownership for the modern age. We believe that every individual deserves a fair, transparent, and reliable system for managing their property. Our land registry system brings clarity to ownership and streamlines the transfer process.
                </p>
                <h2 className="text-3xl font-semibold mt-4 mb-2 text-gray-900">Be a Part of the Revolution</h2>
                <p className="text-gray-800 mb-4 text-lg">
                    Join us in shaping the future of land registry. Whether you are a property owner, a real estate professional, or a government agency, our system is built to serve you. Reach out through our Contact page to learn more about how you can benefit from our technology.
                </p>
            </div>
        </div>
    );
}

export default About;
