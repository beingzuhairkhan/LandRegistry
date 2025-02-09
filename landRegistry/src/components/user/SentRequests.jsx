import { useEffect, useState, useContext } from "react";
import { LandContext } from "../../../context/LandRegistry";
import { FaArrowDown } from "react-icons/fa6";
// Enum for request statuses
const reqStatus = {
  requested: 0,    // Pending
  accepted: 1,     // Approved
  rejected: 2,     // Rejected
  paymentdone: 3,  // Payment Done
  completed: 4     // Completed
};

const SentRequests = () => {
  const { mySentLandRequests, makePayment } = useContext(LandContext);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  //  console.log("selectedRequest",selectedRequest)
  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const response = await mySentLandRequests(); // Fetch the sent requests
     //   console.log("response", response)
        setSentRequests(response); // Update the state with the fetched requests
      } catch (error) {
        console.error("Something went wrong in mySentLandRequests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, [mySentLandRequests]);

  const handleMakePayment = async (landId) => {
    try {
      // const ethPrice = (priceInRupees / 250000).toFixed(6);

      // console.log(`Converting ₹${priceInRupees} to ${ethPrice} ETH...`);

      const transaction = await makePayment(landId);

      console.log("Payment Successful! Transaction Details:", transaction);

    } catch (error) {
      console.error("Error in making payment:", error);
    }
  };


  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
              <th className="py-3 px-6 text-left">Serial No</th>
              <th className="py-3 px-6 text-left">Land ID</th>
              <th className="py-3 px-6 text-left">Owner Address</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Price(in ₹)</th>
              <th className="py-3 px-6 text-center">Make Payment</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {sentRequests.length > 0 ? (
              sentRequests.map((row, index) => (

                <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">{row.landId}</td>
                  <td className="py-3 px-6">{row.ownerAddress}</td>
                  {/* {console.log("row", row)} */}
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${row.status === reqStatus.requested
                        ? "bg-yellow-100 text-yellow-600"
                        : row.status === reqStatus.accepted
                          ? "bg-green-100 text-green-600"
                          : row.status === reqStatus.rejected
                            ? "bg-red-100 text-red-600"
                            : row.status === reqStatus.paymentdone
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600"
                        }`}
                    >
                      {row.status === "Pending"
                        ? "Pending"
                        : row.status === "Accepted"
                          ? "Approved"
                          : row.status === "Rejected"
                            ? "Rejected"
                            : row.status === "Payment Done"
                              ? "Payment Done"
                              : "Completed"}
                    </span>
                  </td>
                  <td className="py-3 px-6">{row.price}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className={`py-2 px-4 rounded-lg transition duration-300 
      ${row.status === "Payment Done"
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : row.isPaymentMade
                            ? "bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer"
                            : row.status === "Accepted"
                              ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                              : "bg-gray-300 text-gray-600 opacity-50 cursor-not-allowed"
                        }`}
                      onClick={() => {
                        if (row.status === "Accepted" && !row.isPaymentMade) {
                          setSelectedRequest(row);
                        }
                      }}
                      disabled={row.status === "Payment Done"}
                    >
                      {row.status === "Payment Done"
                        ? "Payment Done"
                        : row.isPaymentMade
                          ? "Payment Pending"
                          : "Make Payment"}
                    </button>
                    {selectedRequest && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="p-6 bg-white rounded-lg shadow-md">
                          <h2 className="text-2xl font-bold mb-4">Confirm Payment</h2>
                          <p className="text-lg">
                            Seller ID: <span className="font-semibold">{selectedRequest.seller}</span>
                          </p>
                          <center className="mt-2 mb-2" >
                            <FaArrowDown size={30} />
                          </center>
                          <p className="text-lg">
                            Buyer ID: <span className="font-semibold">{selectedRequest.buyer}</span>
                          </p>
                          <p className="text-2xl mt-4">
                            Amount: <span className="font-semibold">{selectedRequest.price} ₹</span>
                          </p>
                          <p className="text-2xl mt-4">
                            1 ETH: <span className="font-semibold">250,000 ₹</span>
                          </p>
                          <p className="text-2xl mt-4">
                            Total ETH: <span className="font-semibold">  {(selectedRequest.price / 250000).toFixed(6)}</span>
                          </p>
                          <p className="mt-4">
                            Please confirm the amount to be paid to the owner of the land.
                          </p>
                          <div className="mt-6 flex justify-end">
                            <button
                              className="mr-4 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-300"
                              onClick={() => setSelectedRequest(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                              onClick={() => {
                                handleMakePayment(selectedRequest.landId);
                                setSelectedRequest(null);
                              }}
                            >
                              Confirm Payment
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SentRequests;

