import landInspector from '../assets/inspector.jpg';
import contractOwner from '../assets/owner.png';
import { useNavigate } from "react-router-dom";
import user from "../assets/user.jpg";
import { useState, useContext } from "react";
import { ethers } from "ethers";
import { LandContext } from '../../context/LandRegistry'
import toast from 'react-hot-toast';
const RoleCard = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const { isUserRegistered, currentUser, isLandInspector, isOwner } = useContext(LandContext)
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (!window.ethereum) {
            toast.error("MetaMask is not installed. Please install MetaMask to continue.")
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            setWalletAddress(accounts[0]);
            const isRegistered = await isUserRegistered(currentUser);

            if (isRegistered) {
                navigate("/user"); 
               // toast.success("User Login Successfully")
            } else {
                navigate("/register"); // Redirect to the registration page if not registered
                //toast.success("User Registration Successfully")
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
           // alert("Wallet connection failed. Please try again.");
            toast.error("Wallet connection failed. Please try again.")
        }
    };

    const connectWalletForContractOwner = async () => {
        if (!window.ethereum) {
           // alert("MetaMask is not installed. Please install MetaMask to continue.");
           toast.error("MetaMask is not installed. Please install MetaMask to continue.")
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const walletAddress = accounts[0]; // Get the user's wallet address
            setWalletAddress(walletAddress);


            //   const isOwnerAddress = await isOwner();

            //   if (isOwnerAddress && walletAddress) {
            //     navigate("/contractOwner"); // Redirect if the user is a Land Inspector
            //   } else {
            //     alert("You are not a Contract Owner");
            //     navigate("/"); // Redirect to the home page
            //   }
            if (currentUser && isOwner) {
                navigate("/contractOwner"); // Redirect if the user is a Land Inspector
                toast.success("Contract Owner Login Successfully")
            }
            else {
                navigate("/"); // Redirect to the home page
                toast.error("You are not a Contract Owner")
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
            toast.error("You are not a Contract Owner")
        }
    };


    const connectWalletForInspector = async () => {
        if (!window.ethereum) {
           // alert("MetaMask is not installed. Please install MetaMask to continue.");
            toast.error("MetaMask is not installed. Please install MetaMask to continue.")
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const walletAddress = accounts[0]; // Get the user's wallet address
            setWalletAddress(walletAddress);


            const isInspector = await isLandInspector(walletAddress);

            if (isInspector) {
                navigate("/landInspector"); 
            } else {
               // alert("You are not a Land Inspector");
                toast.error("You are not a Land Inspector")
                navigate("/"); // Redirect to the home page
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
           // alert("Wallet connection failed. Please try again.");
            toast.error("Wallet connection failed. Please try again.")
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center  mt-10">
                <h1 className="text-5xl font-sans text-gray-800">Login</h1>
                <div className="h-1 w-10 bg-green-400 mt-4"></div> 
            </div>

            <div className="flex justify-evenly gap-6  items-center mt-10">
                <div className="text-center border p-5 rounded-lg shadow-lg bg-gray-100 hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out w-64">
                    <img
                        src={contractOwner}
                        alt="Contract Owner"
                        className="w-32 h-32 mx-auto rounded-full"
                    />
                    <h1 className="font-semibold mt-4 text-lg text-gray-700">Contract Owner</h1>
                    <p className="text-sm text-gray-500 mt-2">Manages contract details and permissions.</p>
                    {/* <Link to="/contractOwner">
                        <button className="mt-4 border border-blue-500 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                            Continue
                        </button>
                    </Link> */}
                    <button
                        onClick={connectWalletForContractOwner}
                        className="mt-4 border border-blue-500 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                    >  Login with MetaMask</button>
                </div>
                <div className="text-center border p-5 rounded-lg shadow-lg bg-gray-100 hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out w-64">
                    <img
                        src={landInspector}
                        alt="Land Inspector"
                        className="w-32 h-32 mx-auto rounded-full"
                    />
                    <h1 className="font-semibold mt-4 text-lg text-gray-700">Land Inspector</h1>
                    <p className="text-sm text-gray-500 mt-2">Oversees land inspection and verification.</p>
                    {/* <Link to="/landInspector">
                        <button className="mt-4 border border-blue-500 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                            Continue
                        </button>
                    </Link> */}
                    <button
                        onClick={connectWalletForInspector}
                        className="mt-4 border border-green-500 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
                    >
                        Login with MetaMask
                    </button>
                </div>

                <div className=" text-center border p-5 rounded-lg shadow-lg bg-gray-100 hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out w-64">
                    <img src={user} alt="User" className="w-32 h-32 mx-auto rounded-full" />
                    <h1 className="font-semibold mt-4 text-lg text-gray-700">Land Owner</h1>
                    <p className="text-sm text-gray-500 mt-2">Accesses information and interacts with the system.</p>

                    <button
                        onClick={connectWallet}
                        className="mt-4 border border-yellow-500 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200"
                    >
                        Login with MetaMask
                    </button>
                </div>
            </div>
        </div>

    );
};

export default RoleCard;
