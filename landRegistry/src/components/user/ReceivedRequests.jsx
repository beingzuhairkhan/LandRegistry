import { useEffect, useState, useContext } from 'react';
import { LandContext } from '../../../context/LandRegistry';

const reqStatus = {
    requested: 0,   
    accepted: 1,    
    rejected: 2,     
    paymentdone: 3, 
    completed: 4    
};

const ReceivedRequests = () => {
    const [requests, setRequests] = useState([]);
    const { fetchReceivedLandRequests, acceptRequest, rejectRequest } = useContext(LandContext);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetchReceivedLandRequests();
                console.log("Received requests response:", response);
                setRequests(response || []);
            } catch (error) {
                console.error("Error fetching received land requests:", error);
                setRequests([]);
            }
        };

        fetchRequests();
    }, [fetchReceivedLandRequests]);

    const handleAccept = async (reqId) => {
        console.log("handleAccept", reqId)
        try {
            await acceptRequest(reqId);
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.reqId === reqId ? { ...req, requestStatus: 1 } : req
                )
            );
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleReject = async (reqId) => {
        console.log("handleReject", reqId)
        try {
            await rejectRequest(reqId);
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req.reqId === reqId ? { ...req, requestStatus: 2 } : req
                )
            );
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Received Requests</h1>
            <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Serial Number</th>
                            <th className="py-3 px-6 text-left">Land ID</th>
                            <th className="py-3 px-6 text-left">Buyer Address</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Payment Done</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-3 px-6 text-center">No Requests Found</td>
                            </tr>
                        ) : (
                            requests.map((request, index) => (
                                <tr key={request.reqId} className="border-b hover:bg-gray-50 transition duration-200">
                                    <td className="py-3 px-6">{index + 1}</td>
                                    <td className="py-3 px-6">{request.landId}</td>
                                    <td className="py-3 px-6 truncate">{request.buyerId}</td>
                                    {/* <td className="py-3 px-6">
                                        <span className={`px-2 py-1 rounded-full text-sm ${
                                            request.requestStatus === 0
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : request.requestStatus === 1
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {request.requestStatus === 0 ? 'Pending' : request.requestStatus === 1 ? 'Approved' : 'Rejected'}
                                        </span>
                                    </td> */}
                                    {
                                        console.log("status", request.requestStatus)
                                    }
                                    <td className="py-3 px-6">
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm ${request.status === reqStatus.requested
                                                ? "bg-yellow-100 text-yellow-600"
                                                : request.status === reqStatus.accepted
                                                    ? "bg-green-100 text-green-600"
                                                    : request.status === reqStatus.rejected
                                                        ? "bg-red-100 text-red-600"
                                                        : request.status === reqStatus.paymentdone
                                                            ? "bg-blue-100 text-blue-600"
                                                            : "bg-purple-100 text-purple-600"
                                                }`}
                                        >
                                            {request.requestStatus === 0
                                                ? "Pending"
                                                : request.requestStatus === 1
                                                    ? "Approved"
                                                    : request.requestStatus === 2
                                                        ? "Rejected"
                                                        : request.requestStatus === 3
                                                            ? "Payment Done"
                                                            : "Completed"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6">{request.isPaymentDone ? 'Yes' : 'No'}</td>
                                    <td className="py-3 px-6 text-center">
                                        {request.requestStatus === 0 && (
                                            <div className="flex space-x-2 justify-center">
                                                <button
                                                    onClick={() => handleReject(request.reqId)}
                                                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                                                >
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => handleAccept(request.reqId)}
                                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReceivedRequests;
