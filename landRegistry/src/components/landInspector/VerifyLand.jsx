import { useState, useContext, useEffect } from "react";
import { LandContext } from "../../../context/LandRegistry";

const VerifyLand = () => {
    const { verifyLand, returnAllLandList, getLandDetails } = useContext(LandContext);
    const [landRecords, setLandRecords] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const landIds = await returnAllLandList();
                if (!isMounted) return;
    
                const records = await Promise.all(
                    landIds.map(async (record) => {
                        const details = await getLandDetails(record[0]);
                        console.log("details", details);

                        if (!details || details.length < 9) return null;

                        
                        const owner = details[8] || await getLandDetails(record[0]);

                        return {
                            id: details[0],
                            PID: details[1],
                            location: details[2],
                            price: details[3],
                            coordinates: details[4] ? JSON.parse(details[4]) : null,
                            surveyNo: details[5],
                            document: details[10],
                            status: details[7] === "false" ? "Pending" : "Verified",
                            owner: owner || "Unknown", 
                        };
                    })
                );
    
                setLandRecords(records.filter(Boolean));
            } catch (error) {
                console.error("Error fetching land records:", error);
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false; 
        };
    }, [returnAllLandList, getLandDetails]);
    

    const handleVerify = async (id) => {
        console.log("Verifying land ID:", id);
    
        try {
            const isVerified = await verifyLand(id);
            console.log("VerifyLand Response:", isVerified);
    
            if (isVerified) {
                setLandRecords((prevRecords) =>
                    prevRecords.map((record) =>
                        record.id === id ? { ...record, status: "Verified" } : record
                    )
                );
            } else {
                console.error("Verification failed: Contract response was false");
            }
        } catch (error) {
            console.error("Error in verifyLand:", error);
        }
    };
    

    const handleReject = (id) => {
        console.log("id reject", id);
        setLandRecords((prevRecords) =>
            prevRecords.map((record) =>
                record.id === id ? { ...record, status: "Rejected" } : record
            )
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Verify Land Records</h1>
            <div className="overflow-x-auto rounded-lg">
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
                                <td className="py-4 px-6 truncate">{record.owner.slice(0, 6)}...</td>
                                <td className="py-4 px-6">{record.PID}</td>
                                <td className="py-4 px-6">{record.location}</td>
                                <td className="py-4 px-6">{record.price}</td>
                                <td className="py-4 px-6">{record.surveyNo}</td>
                                <td className="py-4 px-6">
                                    <a href={record.document} className="text-blue-500 underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                                     Document
                                    </a>
                                </td>
                                <td className={`py-4 px-6 text-center font-semibold ${
                                    record.status === "Verified"
                                        ? "text-green-500"
                                        : record.status === "Rejected"
                                            ? "text-red-500"
                                            : "text-yellow-500"
                                    }`}
                                >
                                    {record.status}
                                </td>
                                <td className="py-4 px-6 text-center">
                                    {record.status === "Pending" && (
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
