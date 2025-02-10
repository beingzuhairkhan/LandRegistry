import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
//internal import
// import tracking from '../context/Tracking.json';
import land from './Land.json'
const ContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

// const ContractABI = tracking.abi;
const ContractABI = land.abi;
const fetchContract = (signerOrProvider) =>
    new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const LandContext = React.createContext();

export const LandProvider = ({ children }) => {

    const DappName = "Land Registry System";
    const [currentUser, setCurrentUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [landInspectors, setLandInspectors] = useState([]);
    //const [loading, setLoading] = useState(false);


    const isContractOwner = async (address) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const owner = await contract.isContractOwner();
            // return owner === address;
            return owner.toLowerCase() === address.toLowerCase();

        } catch (error) {
            console.error("Something went wrong in isContractOwner", error);
        }
    }

    const addLandInspector = async (items) => {
        const { address, name, age, designation, city } = items;
        console.log("items", items);

        // Check if addr is a valid Ethereum address
        // if (!addr || typeof addr !== 'string' || addr.trim() === '') {
        //     console.error("Invalid Ethereum address:", addr);
        //     return;
        // }

        // Validate Ethereum address format
        try {
            ethers.utils.getAddress(address); // This will throw an error if the address is invalid
            //ethers.utils.getContractAddress(addr)
        } catch (error) {
            console.error("Invalid Ethereum address format:", error);
            return;
        }

        // Validate and convert age to BigInt
        let ageBigInt;
        try {
            ageBigInt = BigInt(age); // Try converting age to BigInt
        } catch (error) {
            console.error("Invalid age value:", error);
            return;
        }

        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const addInspector = await contract.addLandInspector(
                ethers.utils.getAddress(address), // Convert to Ethereum address format
                name,
                ageBigInt,                     // Convert age to BigInt
                designation,
                city
            );
            const newLandInspector = await addInspector.wait();


            // Update state with the new inspector details
            setLandInspectors([...landInspectors, newLandInspector]);
            console.log("Land Inspector added successfully");

        } catch (error) {
            console.error("Something went wrong in addLandInspector", error);
        }
    };


    const returnAllLandInspectorList = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const contract = fetchContract(provider);
            const allLandInspector = await contract.returnAllLandInspectorList();
            console.log("allLandInspector", allLandInspector)

            const formattedInspectors = allLandInspector?.map(inspector => ({
                id: inspector[0].toNumber(),  // Convert BigNumber to a regular number
                address: inspector[1],
                name: inspector[2],
                age: inspector[3].toNumber(),  // Convert BigNumber to a regular number
                designation: inspector[4],
                city: inspector[5],
            }));
            return formattedInspectors;

        } catch (error) {
            console.error("Something went wrong in returnAllLandInspectorList", error);
        }
    };

    const removeLandInspector = async (address) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const removeInspector = await contract.removeLandInspector(address);
            await removeInspector.wait();
            console.log("Land Inspector removed successfully");

        } catch (error) {
            console.error("Something went wrong in removeLandInspector", error);
        }
    };

    const isLandInspector = async (address) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const isInspector = await contract.isLandInspector(address);
            console.log(isInspector);
            return isInspector;

        } catch (error) {
            console.error("Something went wrong in isLandInspector", error);
        }
    };

    const isUserRegistered = async (address) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const contract = fetchContract(provider);
            const isRegistered = await contract.isUserRegistered(address);
            console.log(isRegistered);
            return isRegistered;

        } catch (error) {
            console.error("Something went wrong in isUserRegistered", error);
        }
    }

    const registerUser = async (item) => {
        const { name, age, city, aadharNumber, panNumber, document, email } = item;
        if (!item || Object.values(item).some((value) => !value)) {
            console.error("Invalid input data:", item);
            return;
        }

        let ageBigInt;
        try {
            ageBigInt = BigInt(parseInt(age, 10));
        } catch (error) {
            console.error("Invalid age value:", error);
            return;
        }

        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            if (!contract) {
                console.error("Contract is not initialized.");
                return;
            }

            const tx = await contract.registerUser(
                name,
                ageBigInt,
                city,
                aadharNumber,
                panNumber,
                document,
                email
            );

            await tx.wait();
            console.log("User registered successfully");
        } catch (error) {
            console.error("Something went wrong in registerUser:", error.message || error);
        }
    };

    const getUserContract = async (item) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const contract = fetchContract(provider);
            const user = await contract.getUser(item);
            //console.log("user data",user)
            return user;


        } catch (error) {
            console.error("Something went wrong in getUser", error);
        }
    }

    const verifyUser = async (userId) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const verifyUser = await contract.verifyUser(userId);
            console.log("verifyUser", verifyUser);
            await verifyUser.wait();
            console.log("User verified successfully");
        } catch (error) {
            console.error("Something went wrong in verifyUser", error);
        }
    };


    const isUserVerified = async (id) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const contract = fetchContract(provider);
            const isVerified = await contract.isUserVerified(id);
            console.log(isVerified);
            return isVerified;
        } catch (error) {
            console.error("Something went wrong in isUserVerified", error);
        }
    }

    const returnAllUserList = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const contract = fetchContract(provider);
            const allUserList = await contract.returnAllUserList();
            console.log(allUserList);
            return allUserList;
        } catch (error) {
            console.error("Something went wrong in returnAllUserList", error);
        }
    }

    const addLand = async (landData) => {
        console.log("Received landData:", landData);
        const { area, landAddress, landPrice, polygon, propertyPID, surveyNumber, document } = landData;

        console.log("Extracted landPrice:", landPrice);

        let areaBigInt, landPriceBigInt, pidBigInt;


        try {
            if (!area || isNaN(Number(area)) || Number(area) <= 0)
                throw new Error("Invalid area value");
            areaBigInt = BigInt(area);
        } catch (error) {
            console.error("Error in area conversion:", error.message, { area });
            return;
        }


        const defaultLandPrice = "10000";
        const finalLandPrice = landPrice && !isNaN(Number(landPrice)) ? landPrice : defaultLandPrice;

        try {
            landPriceBigInt = BigInt(Number(finalLandPrice));
        } catch (error) {
            console.error("Error in land price conversion:", error.message, { finalLandPrice });
            return;
        }


        const defaultPropertyPID = "999";
        const finalPropertyPID = propertyPID && !isNaN(Number(propertyPID)) ? propertyPID : defaultPropertyPID;

        try {
            const pidNum = Number(finalPropertyPID);
            if (isNaN(pidNum) || pidNum <= 0) throw new Error("Invalid property PID value");
            pidBigInt = BigInt(pidNum);
        } catch (error) {
            console.error("Error in PID conversion:", error.message, { finalPropertyPID });
            return;
        }


        if (!surveyNumber || typeof surveyNumber !== "string") {
            console.error("Invalid survey number value:", surveyNumber);
            return;
        }

        console.log("Received coordinates (polygon):", polygon);


        if (!Array.isArray(polygon) || polygon.some(coord => !Array.isArray(coord) || coord.length !== 2)) {
            console.error("Invalid coordinates array:", polygon);
            return;
        }


        const coordinatesAsString = JSON.stringify(polygon);


        if (typeof document !== "string" && !(document instanceof File)) {
            console.error("Invalid document:", document);
            return;
        }



        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const addLandTx = await contract.addLand(
                areaBigInt,      
                landAddress,     
                landPriceBigInt, 
                coordinatesAsString,  
                pidBigInt,   
                surveyNumber,
                document        
            );

            await addLandTx.wait();
            console.log("Land added successfully!");
        } catch (error) {
            console.error("Something went wrong in addLand:", error);
        }
    };

    const myAllLands = async (userAddress) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const contract = fetchContract(provider);
            const myAllLands = await contract.myAllLands(userAddress);
            const formattedMyLandList = myAllLands.map((land) => land.toString());
            // console.log("myAllLands" , myAllLands);
            return formattedMyLandList;
        } catch (error) {
            console.error("Something went wrong in myAllLands", error);
        }
    }

    const getLandDetails = async (landId) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const contract = fetchContract(provider);
            const getLandDetails = await contract.getLandDetails(landId);
            const formattedGetLandLists = getLandDetails.map((land) => land.toString());
            console.log("getLandDetails", formattedGetLandLists);
            //  console.log("Document Field:", getLandDetails);
            return formattedGetLandLists;

        } catch (error) {
            console.error("Something went wrong in getLandDetails", error);
        }
    }




    const returnAllLandList = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const contract = fetchContract(provider);

            // Fetch the land list from the contract
            const allLandList = await contract.returnAllLandList();
            //console.log("allLandList (before conversion):", allLandList);

            // Convert BigNumber values to strings
            const formattedLandList = allLandList.map((land) => land.toString());  // Convert BigNumber to string
            //console.log("formattedLandList:", formattedLandList);

            return formattedLandList;

        } catch (error) {
            console.error("Something went wrong in returnAllLandList:", error);
        }
    };


    const verifyLand = async (id) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            console.log("Verifying land with ID:", id);

            // Send transaction to verify land
            const verifyTx = await contract.verifyLand(id);

            // Wait for the transaction to be mined
            const receipt = await verifyTx.wait();
            console.log("Transaction receipt:", receipt);

            // Check if the transaction was successful
            if (receipt.status === 1) {
                console.log("Land verified successfully");
                return true;  // Transaction was successful
            } else {
                console.error("Transaction failed");
                return false;  // Transaction failed
            }
        } catch (error) {
            console.error("Something went wrong in verifyLand:", error);
            return false;
        }
    };



    const isLandVerified = async (id) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const contract = fetchContract(provider);
            const isVerified = await contract.isLandVerified(id);
            console.log("isVerified",isVerified);
            return isVerified;
        } catch (error) {
            console.error("Something went wrong in isLandVerified", error);
        }
    }

    const makeLandForSell = async (id) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);

            const makeLandForSell = await contract.makeLandForSell(id);
            await makeLandForSell.wait();
            console.log("Land made for sale successfully");
        } catch (error) {
            console.error("Something went wrong in makeLandForSell", error);
        }
    }

    const requestForBuy = async (landId) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const requestForBuy = await contract.requestForBuy(landId);
            await requestForBuy.wait();
            console.log("Request for buy made successfully");
        } catch (error) {
            console.error("Something went wrong in requestForBuy", error);
        }
    }

    const fetchReceivedLandRequests = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(provider);
            
            // Fetch all received requests
            const receivedRequests = await contract.connect(signer).myReceivedLandRequests();
            
          //  console.log("Received Land Requests:", receivedRequests);
    
            const formattedReceivedRequests = await Promise.all(
                receivedRequests.map(async (requestId) => {
                  //  console.log("requestId",requestId.toString())
                    try {
                        const request = await contract.landRequestMapping(requestId);
                        console.log("Received Land Requests:", request);
                        return {
                            reqId: requestId.toString(), // Convert BigNumber to string
                            sellerId: request.sellerId,
                            buyerId: request.buyerId,
                            landId: request.landId.toString(),
                            requestStatus: request.requestStatus,
                            isPaymentDone: request.isPaymentDone,
                        };
                    } catch (error) {
                        console.error("Error fetching data for request ID:", requestId.toString(), error);
                        return null;
                    }
                })
            );
    
            // Remove any null entries due to errors
            const validRequests = formattedReceivedRequests.filter((request) => request !== null);
    
            //console.log("Formatted Received Land Requests:", validRequests);
    
            return validRequests;
        } catch (error) {
            console.error("Error fetching received land requests:", error);
            return [];
        }
    };
    



    const reqStatus = {
        requested: 0,
        accepted: 1,
        rejected: 2,
        paymentdone: 3,
        completed: 4
      };
      
      // Function to get status string from request status
      const getRequestStatusString = (status) => {
        switch (status) {
          case reqStatus.requested:
            return 'Pending';
          case reqStatus.accepted:
            return 'Accepted';
          case reqStatus.rejected:
            return 'Rejected';
          case reqStatus.paymentdone:
            return 'Payment Done';
          case reqStatus.completed:
            return 'Completed';
          default:
            return 'Unknown Status';
        }
      };


    const mySentLandRequests = async () => {
        try {
            // Initialize Web3Modal and connect to the provider
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(provider); // Fetch the contract instance

            // Fetch all the sent land request IDs
            const mySentRequests = await contract.connect(signer).mySentLandRequests();
            // const formateData = mySentRequests.toString();
            //  console.log("Fetched mySentRequests:", formateData); 

            // Fetch the details of each land request
            const formattedMySentRequest = await Promise.all(
                mySentRequests.map(async (requestId) => {
                    //console.log("request " , requestId.toString())
                    try {
                        // Fetch the request details from the contract
                        const request = await contract.landRequestMapping(requestId);
                         console.log("request " , request)
                        //  const requestId = request.reqId.toString()
                        //  console.log("request " ,requestId )
                       
                        const landIdStr = request.landId ? request.landId.toString() : "N/A";  // Safely convert landId
                        const ownerAddress = request.sellerId || "N/A"; // Get sellerId (owner address)
                        const statusStr = getRequestStatusString(request.requestStatus);
                        const seller = request.sellerId;
                        const buyer = request.buyerId;
                       // console.log("seller buyer" , seller , buyer)
                        const isPaymentMade = request.isPaymentDone || false;  // Assuming isPaymentDone is a boolean
                        const getLandDetails = await contract.getLandDetails(landIdStr);
                        const formattedGetLandLists = getLandDetails.map((land) => land.toString());
                        const priceStr = formattedGetLandLists[3];
                        //console.log("priceStr", priceStr);
                        // Return the filtered and formatted details
                        return {
                            landId: landIdStr,
                            ownerAddress,
                            status: statusStr,
                            price: priceStr,
                            isPaymentMade,
                             seller,
                             buyer
                        };
                    } catch (error) {
                        
                        console.error(`Error fetching details for request ID ${requestId}:`, error);
                        return null;  
                    }
                })
            );

            const validRequests = formattedMySentRequest.filter(request => request !== null);
            // console.log("Formatted Sent Requests:", validRequests);
            return validRequests;  
        } catch (error) {
            
            console.error("Something went wrong in mySentLandRequests", error);
        }
    };


    const acceptRequest = async (requestId) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const acceptRequest = await contract.acceptRequest(requestId);
            await acceptRequest.wait();
            console.log("Request accepted successfully");
        } catch (error) {
            console.error("Something went wrong in acceptRequest", error);
        }
    }

    const rejectRequest = async (requestId) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const rejectRequest = await contract.rejectRequest(requestId);
            await rejectRequest.wait();
            console.log("rejectRequest successfully");

        } catch (error) {
            console.error("Something went wrong in rejectRequest", error);
        }
    }

    const requestStatus = async (id)=>{
        try{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const requestStatus = await contract.requestStatus(id);
            // await requestStatus.wait();
            console.log("requestStatus successfully" , requestStatus);

        }catch(error){
            console.error("Something went wrong in requestStatus", error);
        }
    }

    const landPrice = async (id)=>{
        try{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const landPriceData = await contract.landPrice(id);
            //await landPriceData.wait();
            console.log("landPriceData successfully",landPriceData);

        }catch(error){
            console.error("Something went wrong in landPriceData", error);
        }
    }

    const makePayment = async (id) => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
    
            const price = await contract.landPrice(id); // Fetch land price first
      
            const makePayment = await contract.makePayment(id, {
                value: price,
            });
    
            await makePayment.wait(); 
            console.log(" Payment successful!");
    
        } catch (error) {
            console.error(" Something went wrong in makePayment:", error);
        }
    };

    const fetchPaymentDoneList = async () => {
        try{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const paymentDoneList = await contract.returnPaymentDoneList();
            await paymentDoneList.wait();
            console.log("paymentDoneList successfully");
        } catch (error) {
            console.error(" Error in transferOwnerShip:", error.message || error);
        }
        
      }

    const transferOwnerShip = async (requestId, documentUrl) => {
        try {
            if (!requestId || !documentUrl) {
                throw new Error("Invalid parameters: requestId and documentUrl are required.");
            }
    
            // Initialize Web3Modal and Connect Wallet
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
    
            // Fetch Smart Contract
            const contract = fetchContract(signer);
    
            if (!contract.transferOwnerShip) {
                throw new Error("Contract function transferOwnerShip() not found.");
            }
    
            console.log(`Initiating ownership transfer for Request ID: ${requestId}`);
    
            // Execute Ownership Transfer
            const tx = await contract.transferOwnerShip(requestId, documentUrl);
            await tx.wait();
    
            console.log("✅ Ownership transferred successfully:", tx);
            return tx;
        } catch (error) {
            console.error(" Error in transferOwnerShip:", error.message || error);
        }
    };

  
    const makePaymentTestFun = async (receiverAddress, amountInEther, landId) => {
        try {
            if (!window.ethereum) throw new Error("MetaMask is not installed");
         
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            const contract = new ethers.Contract(ContractAddress, ContractABI, signer);
    
            const amountInWei = ethers.utils.parseEther(amountInEther);
    
            const tx = await contract.makePaymentTestFun(landId, receiverAddress, {
                value: amountInWei, 
            });
    
            console.log("⏳ Transaction in progress...", tx.hash);
            await tx.wait(); 
            console.log(" Payment successful!");
    
        } catch (error) {
            console.error("Error in makePaymentTestFun:", error.message || error);
        }
    };
    
    
    
    
      


    // const checkIfWalletConnected = async () => {
    //     try {
    //         if (!window.ethereum) return "Install Metamask";
    //         const accounts = await window.ethereum.request({
    //             method: "eth_accounts",
    //         });
    //         if (accounts.length) {
    //             setCurrentUser(accounts[0]);
    //         } else {
    //             return "No account"
    //         }

    //     } catch (error) {
    //         console.log("something went wrong", error)
    //     }
    // }



    const connectWallet = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setCurrentUser(address);

            const contract = fetchContract(signer);

            const contractOwner = await contract.getContractOwner();

            console.log("Contract Owner Address:", contractOwner);

            const isOwner = await contract.isContractOwner(address);

            console.log("Connected wallet address:", address);
            console.log("Is contract owner:", isOwner);


            setIsOwner(isOwner);

            console.log("Wallet connected:", address);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };



    useEffect(() => {
        if (window.ethereum) {
            connectWallet();
        }
    }, []);
    return (
        <LandContext.Provider
            value={{
                DappName,
                currentUser,
                isOwner,
                isLandInspector,
                getUserContract,
                connectWallet,
                isContractOwner,
                addLandInspector,
                returnAllLandInspectorList,
                removeLandInspector,
                registerUser,
                verifyUser,
                addLand,
                myAllLands,
                getLandDetails,
                makeLandForSell,
                requestForBuy,
                fetchReceivedLandRequests,
                rejectRequest,
                transferOwnerShip,
                makePaymentTestFun,
            //    checkIfWalletConnected,
                acceptRequest,
                fetchPaymentDoneList,
                mySentLandRequests,
                isLandVerified,
                verifyLand,
                returnAllLandList,
                returnAllUserList,
                isUserVerified,
                isUserRegistered,
                requestStatus,
                landPrice,
                makePayment,

            }}
        >
            {children}
        </LandContext.Provider>
    );
};

LandProvider.propTypes = {
    children: PropTypes.node.isRequired,
};