import { useState , useContext , useEffect } from 'react';
import { FaArrowRight, FaCamera } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import Webcam from 'react-webcam';
import { LandContext } from '../../../context/LandRegistry'
const TransferOwnership = () => {
  //transferOwnerShip
  const { mySentLandRequests, returnAllLandList,getLandDetails,transferOwnerShip } = useContext(LandContext);
  const [landRecords , setLandRecords] = useState([])
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
                        sellerAddress:details[8],
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
  // const data = [
  //   {
  //     serialNumber: 1,
  //     landId: 'LND001',
  //     sellerAddress: '0xdD2FD458127....',
  //     buyerAddress: '0xdD2250D8127',
  //     status: 'Pending',
  //   },
  //   {
  //     serialNumber: 2,
  //     landId: 'LND002',
  //     sellerAddress: '0xdD2FD458127....',
  //     buyerAddress: '0xdD25142AC8127',
  //     status: 'Completed',
  //   },
    
  // ];

  const [selectedLand, setSelectedLand] = useState(null);
  const [capturedImages, setCapturedImages] = useState({ buyer: null, seller: null, witness: null });
  // useEffect(() => {
  //   const fetchOwnershipTransfer = async () => {
  //     try {
  //       const response = await transferOwnerShip();
  //       console.log("Response:", response);
  //     } catch (error) {
  //       console.error("Error fetching ownership transfer:", error);
  //     }
  //   };

  //   fetchOwnershipTransfer();
  // }, [transferOwnerShip]);

 

  const handleTransferOwnership = (land) => {
    setSelectedLand(land);
  };


  const handleCapture = (role, imageData) => {
    setCapturedImages((prev) => ({ ...prev, [role]: imageData }));
  };


  const handleGeneratePdf = () => {
    const doc = new jsPDF();

  
    doc.text(`Transfer Ownership Details`, 10, 10);
    doc.text(`Land ID: ${selectedLand.landId}`, 10, 20);
    doc.text(`Seller Address: ${selectedLand.sellerAddress}`, 10, 30);
    doc.text(`Buyer Address: ${selectedLand.buyerAddress}`, 10, 40);
    doc.text(`Status: ${selectedLand.status}`, 10, 50);


    if (capturedImages.buyer) {
      doc.addImage(capturedImages.buyer, 'JPEG', 10, 60, 60, 60);
    }
    if (capturedImages.seller) {
      doc.addImage(capturedImages.seller, 'JPEG', 10, 130, 60, 60);
    }
    if (capturedImages.witness) {
      doc.addImage(capturedImages.witness, 'JPEG', 10, 200, 60, 60);
    }

    doc.save('ownership-transfer.pdf');
  };

  if (selectedLand) {
    return (
      <div className="p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Ownership Transfer Form</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Details Section */}
          <div className="space-y-6">
            <div className="p-4 border border-gray-300 rounded-lg">
              <h2 className="font-semibold text-xl mb-4">Seller Details</h2>
              <p>Serial Number: {selectedLand.serialNumber}</p>
              <p>Seller Address: {selectedLand.sellerAddress}</p>
              <p>Land Id: {selectedLand.landId}</p>
              <p>Buyer Address: {selectedLand.buyerAddress}</p>
              <p>status: {selectedLand.status}</p>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg">
              <h2 className="font-semibold text-xl mb-4">Buyer Details</h2>
              <p>Serial Number: {selectedLand.serialNumber}</p>
              <p>Seller Address: {selectedLand.sellerAddress}</p>
              <p>Land Id: {selectedLand.landId}</p>
              <p>Buyer Address: {selectedLand.buyerAddress}</p>
              <p>status: {selectedLand.status}</p>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg">
              <h2 className="font-semibold text-xl mb-4">Eye Witness</h2>
              <p>Witness Details Here...</p>
            </div>

            {/* Generate PDF */}
            <div className="text-center">
              <button
                onClick={handleGeneratePdf}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Generate Ownership Transfer PDF
                <FaCamera className="ml-2" />
              </button>
            </div>
          </div>

          {/* Camera Section */}
          <div className="space-y-6">
            {/* Seller Camera */}
            <div className="p-4 border border-gray-300 rounded-lg">
              <h2 className="font-semibold text-xl mb-4">Capture Seller Photo</h2>
              <div className="flex justify-center">
                {!capturedImages.seller ? (
                  <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    width="80%"
                    videoConstraints={{
                      facingMode: 'environment',
                    }}
                    onScreenshot={(image) => handleCapture('seller', image)}
                  />
                ) : (
                  <img src={capturedImages.seller} alt="Seller" width="100%" />
                )}
              </div>
              <button
                onClick={() => setCapturedImages((prev) => ({ ...prev, seller: null }))}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg w-full"
              >
                {capturedImages.seller ? 'Retake Seller Photo' : 'Capture Seller Photo'}
              </button>
            </div>

            {/* Buyer Camera */}
            <div className="p-4 border border-gray-300 rounded-lg">
              <h2 className="font-semibold text-xl mb-4">Capture Buyer Photo</h2>
              <div className="flex justify-center">
                {!capturedImages.buyer ? (
                  <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    width="80%"
                    videoConstraints={{
                      facingMode: 'environment',
                    }}
                    onScreenshot={(image) => handleCapture('buyer', image)}
                  />
                ) : (
                  <img src={capturedImages.buyer} alt="Buyer" width="100%" />
                )}
              </div>
              <button
                onClick={() => setCapturedImages((prev) => ({ ...prev, buyer: null }))}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg w-full"
              >
                {capturedImages.buyer ? 'Retake Buyer Photo' : 'Capture Buyer Photo'}
              </button>
            </div>

            {/* Witness Camera */}
            <div className="p-4 border border-gray-300 rounded-lg">
              <h2 className="font-semibold text-xl mb-4">Capture Witness Photo</h2>
              <div className="flex justify-center">
                {!capturedImages.witness ? (
                  <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    width="80%"
                    videoConstraints={{
                      facingMode: 'environment',
                    }}
                    onScreenshot={(image) => handleCapture('witness', image)}
                  />
                ) : (
                  <img src={capturedImages.witness} alt="Witness" width="100%" />
                )}
              </div>
              <button
                onClick={() => setCapturedImages((prev) => ({ ...prev, witness: null }))}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg w-full"
              >
                {capturedImages.witness ? 'Retake Witness Photo' : 'Capture Witness Photo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Transfer Ownership Table</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
              <th className="py-3 px-6 text-left">Serial Number</th>
              <th className="py-3 px-6 text-left">Land ID</th>
              <th className="py-3 px-6 text-left">Seller Address</th>
              <th className="py-3 px-6 text-left">Buyer Address</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Transfer Ownership</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {landRecords.map((row) => (
              <tr key={row.serialNumber} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="py-3 px-6">{row.id}</td>
                <td className="py-3 px-6">{row.id}</td>
                <td className="py-3 px-6 truncate">{row.sellerAddress.slice(0,8)}</td>
              <td className="py-3 px-6 truncate">{row.buyerAddress}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${row.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleTransferOwnership(row)}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
                  >
                    Transfer Ownership <FaArrowRight className="ml-2" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransferOwnership;

