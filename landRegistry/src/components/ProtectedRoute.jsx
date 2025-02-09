import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { LandContext } from "../../context/LandRegistry";
import { ethers } from "ethers";
import land from "../../context/Land.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = land.abi;

const ProtectedRoute = ({ element, allowedRole }) => {
    const { isUserRegistered, landInspectors, currentUser, isOwner } = useContext(LandContext);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            if (!window.ethereum) {
                setIsAuthorized(false);
                setLoading(false);
                return;
            }

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const walletAddress = accounts[0];

                if (allowedRole === "user") {
                    const registered = await isUserRegistered(walletAddress);
                    setIsAuthorized(registered);
                } else if (allowedRole === "landInspector") {
                    const inspector = landInspectors.includes(walletAddress);
                    setIsAuthorized(inspector);
                } else if (allowedRole === "contractOwner") {
                    const contract = new ethers.Contract(contractAddress, contractABI, provider);
                    const owner = await contract.isContractOwner(); // Fixed method
                    setIsAuthorized(walletAddress.toLowerCase() === owner.toLowerCase()); // Ensure case consistency
                }
            } catch (error) {
                console.error("Access check failed:", error);
            }

            setLoading(false);
        };

        checkAccess();
    }, [allowedRole, isUserRegistered, landInspectors]);

    if (loading) return <h1 className="text-center text-xl">Loading...</h1>;

    return isAuthorized ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
