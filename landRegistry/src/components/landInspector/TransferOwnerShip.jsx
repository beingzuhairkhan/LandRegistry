import { useState, useContext, useEffect, useRef } from 'react';
import { FaArrowRight, FaCamera } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import Webcam from 'react-webcam';
import { LandContext } from '../../../context/LandRegistry'
import { MdVerified } from "react-icons/md";

const TransferOwnership = () => {

  const { sellerAndBuyerData, returnAllLandList, getLandDetails, transferOwnerShip } = useContext(LandContext);
  const [landRecords, setLandRecords] = useState([])
  const [landId, setLandId] = useState([])
  const [landData, setLandData] = useState([])
  const [witnessData, setWitnessData] = useState({
    witnessName: "",
    witnessAge: "",
    witnessAadhar: "",
    witnessAddress: "",
  });

  const sellerWebcamRef = useRef(null);
  const buyerWebcamRef = useRef(null);
  const witnessWebcamRef = useRef(null);
  const [selectedLand, setSelectedLand] = useState(null);
  const [capturedImages, setCapturedImages] = useState({ buyer: null, seller: null, witness: null });

  const handleOnchange = (e) => {
    setWitnessData({ ...witnessData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const landIds = await returnAllLandList();
        if (!isMounted) return;

        const records = await Promise.all(
          landIds.map(async (record) => {
            const details = await getLandDetails(record[0]);
            //  console.log("details", details);

            if (!details || details.length < 9) return null;

            setLandId(details[0]);

            //const owner = details[8] || await getLandDetails(record[0]);

            return {
              id: details[0],
              PID: details[5],
              Area: details[1],
              location: details[2],
              price: details[3],
              sellerAddress: details[8],
              coordinates: details[4] ? JSON.parse(details[4]) : null,
              surveyNo: details[6],
              document: details[10],
              status: details[9] === "false" ? "Pending" : "Verified",

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

  const transferLand = async (reqId, docURL) => {
    try {
      await transferOwnerShip(reqId, docURL);
      console.log("Land Transfered Successfully!");

    } catch (error) {
      console.error("Error transferring land ownership:", error);
    }
  }
  const handleClick = async () => {
    handleGeneratePdf(); 
    await transferLand(selectedLand.reqId, landRecords[0]?.document); 
  };


  useEffect(() => {
    if (!landId || isNaN(landId)) {
      console.error("Invalid landId:", landId);
      return;
    }

    const LandRequest = async (id) => {
      try {
        const request = await sellerAndBuyerData(id);
        console.log("Raw Request Data:", request);

        const { reqId, landId, sellerId, buyerId, isPaymentDone, sellerName, sellerAge, sellerCity, sellerAad,
          sellerPan, sellerMail, sellerDoc, buyerName, buyerAge, buyerCity, buyerAad, buyerPan, buyerMail, buyerDoc
        } = {
          reqId: request.landRequest[0].toNumber(),  
          landId: request.landRequest[3].toNumber(), 
          sellerId: request.landRequest[1],
          buyerId: request.landRequest[2],
          isPaymentDone: request.landRequest[5],
          sellerName: request.seller[1],
          sellerAge: request.seller.age,
          sellerCity: request.seller.city,
          sellerAad: request.seller.aadharNumber,
          sellerPan: request.seller.panNumber,
          sellerMail: request.seller.email,
          sellerDoc: request.seller.document,
          buyerName: request.buyer[1],
          buyerAge: request.buyer.age,
          buyerCity: request.buyer.city,
          buyerAad: request.buyer.aadharNumber,
          buyerPan: request.buyer.panNumber,
          buyerMail: request.buyer.email,
          buyerDoc: request.buyer.document,
        };
   
        setLandData([{
          reqId, landId, sellerId, buyerId, isPaymentDone, sellerName, sellerAge, sellerCity, sellerAad,
          sellerPan, sellerMail, sellerDoc, buyerName, buyerAge, buyerCity, buyerAad, buyerPan, buyerMail, buyerDoc
        }]); 


     
      } catch (error) {
        console.error(" Error fetching my sent land requests:", error);
      }
    };


    LandRequest(Number(landId));
  }, [landId, sellerAndBuyerData]);





  const handleTransferOwnership = (land) => {
    setSelectedLand(land);
  };

  const handleCapture = (role, ref) => {
    if (ref.current) {
      const imageSrc = ref.current.getScreenshot();
      setCapturedImages((prev) => ({ ...prev, [role]: imageSrc }));
    }
  };




  const handleGeneratePdf = () => {
    const doc = new jsPDF();

    const getTimestamp = () => new Date().toLocaleString();

    const addImageToPdf = (image, x, y, width = 60, height = 60) => {
      if (image) {
        const cleanBase64 = image.replace(/^data:image\/jpeg;base64,/, "");
        doc.addImage(cleanBase64, "JPEG", x, y, width, height);
      }
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont("helvetica", "bold").setFontSize(18);
    const title = "LAND SALE AGREEMENT";
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 20);

    doc.setFontSize(10).setFont("helvetica", "italic");
    doc.text(`Generated on: ${getTimestamp()}`, 10, 28);

    doc.setLineWidth(0.5);
    doc.line(10, 30, pageWidth - 10, 30);

    doc.setFontSize(14);
    const indexText = "Index No: 2";
    doc.text(indexText, (pageWidth - doc.getTextWidth(indexText)) / 2, 40);

    doc.line(10, 45, pageWidth - 10, 45);

    doc.setFontSize(12).setFont("helvetica", "normal");
    doc.text(`Village Name: ${landRecords[0]?.location || "N/A"}`, 10, 55);
    doc.line(10, 60, pageWidth - 10, 60);

    const leftX = 10;
    const rightX = pageWidth / 2 + 10;
    let y = 70;

    const addDetail = (label, value, isRightColumn = false) => {
      doc.setFont("helvetica", "bold").text(`${label}:`, isRightColumn ? rightX : leftX, y);
      doc.setFont("helvetica", "normal").text(value || "N/A", isRightColumn ? rightX + 50 : leftX + 60, y);
      y += 8;
    };

    addDetail("Type of Document", "Sale Deed");
    addDetail("Compensation", `Rs ${landRecords[0]?.price}`);
    addDetail("Market Value", `Rs ${landRecords[0]?.price}`, true);
    addDetail("Survey No", `${landRecords[0]?.surveyNo}`);
    addDetail("Area", `${landRecords[0]?.Area} sq meters`, true);
    addDetail("Seller Name & Address", `${selectedLand.sellerName}, 
      ${selectedLand.sellerCity}`);
    addDetail("Buyer Name & Address", `${selectedLand.buyerName},
       ${selectedLand.buyerCity}`, true);
    addDetail("Document Written Date", `${getTimestamp()}`);
    addDetail("Registration Date", `${getTimestamp()}`, true);
    addDetail("Stamp Duty Paid", "Rs 6000");
    addDetail("Registration Fee", "Rs 5000", true);

    doc.text("Land Document : ", 10, y + 10)
    doc.setTextColor(0, 0, 255);
    doc.textWithLink("View Document", 10, y + 20, { url: landRecords[0]?.document || "https://example.com/default-doc" });
    doc.setTextColor(0, 0, 0);

    doc.addPage();
    y = 20;

    doc.setFontSize(14).setFont("helvetica", "bold").text("Document Abstract", 10, y);
    doc.line(10, y + 5, pageWidth - 10, y + 5);
    y += 15;

    const addPersonDetails = (title, personData, imageKey) => {
      doc.setFont("helvetica", "bold").text(`${title}:`, 10, y);
      y += 8;
      doc.setFont("helvetica", "normal").setFontSize(11);
      doc.text(`Name: ${personData.name || "N/A"}`, 10, y);
      doc.text(`Address: ${personData.city || "N/A"}`, 10, y + 8);
      doc.text(`Aadhar No: ${personData.aadhar || "N/A"}`, 10, y + 16);
      doc.text(`PAN No: ${personData.pan || "N/A"}`, 10, y + 24);
      doc.text(`Email: ${personData.email || "N/A"}`, 10, y + 32);

      doc.setTextColor(0, 0, 255);
      doc.textWithLink("View Document", 10, y + 40, { url: personData.doc || "https://example.com/default-doc" });
      doc.setTextColor(0, 0, 0);

      doc.text(`Sign: __________________`, 10, y + 50);
      addImageToPdf(capturedImages[imageKey], 140, y - 10, 50, 50);
      y += 60;
    };

    addPersonDetails("Seller Details", {
      name: selectedLand.sellerName,
      city: selectedLand.sellerCity,
      aadhar: selectedLand.sellerAad,
      pan: selectedLand.sellerPan,
      email: selectedLand.sellerMail,
      doc: selectedLand.sellerDoc,
    }, "seller");

    addPersonDetails("Buyer Details", {
      name: selectedLand.buyerName,
      city: selectedLand.buyerCity,
      aadhar: selectedLand.buyerAad,
      pan: selectedLand.buyerPan,
      email: selectedLand.buyerMail,
      doc: selectedLand.buyerDoc,
    }, "buyer");

    addPersonDetails("Witness Details", {
      name: witnessData.witnessName,
      city: witnessData.witnessAddress,
      aadhar: witnessData.witnessAadhar,
      age: witnessData.witnessAge,
    }, "witness");

    doc.setFontSize(10).setFont("helvetica", "italic");
    doc.text(
      "This document is generated electronically and does not require a physical signature.",
      10,
      pageHeight - 20
    );
    doc.text(`Generated on: ${getTimestamp()}`, 10, pageHeight - 10);


    doc.save("ownership-transfer.pdf");
  };




  if (selectedLand) {
    return (
      <div className="p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Ownership Transfer Form</h1>

        <div className="">
 
          <div className="space-y-6">
            {/* Seller Camera */}
            <div className="flex gap-4" >
              <div className="p-4 border shadow-lg rounded-lg w-full border-gray-200">
                <h2 className="font-semibold text-xl ">Seller Profile </h2>
                <span className="text-green-600 font-medium text-sm flex mt-2 gap-1 " > {landRecords[0].status} <MdVerified size={20} color="green" /> </span>
                <div className="pt-4" >
                  <div className="flex justify-center ">
                    {!capturedImages.seller ? (
                      <Webcam
                        ref={sellerWebcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width="80%"
                        videoConstraints={{ facingMode: "environment" }}
                      />
                    ) : (
                      <img src={capturedImages.seller} alt="Seller" width="100%" />
                    )}
                  </div>


               
                  <center>
                    <button
                      onClick={() => handleCapture("seller", sellerWebcamRef)} // ✅ Capture Seller Image
                      className="mt-4 bg-gradient-to-r from-green-500 to-teal-500  text-white py-2 px-4 rounded-lg w-[250px]"
                    >
                      {capturedImages.seller ? "Retake Seller Photo" : "Capture Seller Photo"}
                    </button>
                  </center>

                  <div className="p-6 bg-white ">
                    <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-t-lg text-center">
                      Seller Details
                    </h2>
                    <div className="p-4 space-y-3">
                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">🏠 Seller Address: </span>
                        {selectedLand.sellerId.slice(0, 20)}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">👤 Name: </span>
                        {selectedLand.sellerName}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">🎂 Age: </span>
                        {selectedLand.sellerAge?.toString()}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">🏙️ City: </span>
                        {selectedLand.sellerCity}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">📄 Aadhar Number: </span>
                        {selectedLand.sellerAad}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">💳 PAN Number: </span>
                        {selectedLand.sellerPan}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">📧 Email ID: </span>
                        {selectedLand.sellerMail}
                      </p>

                      <div className="mt-4">
                        <a
                          href={selectedLand.sellerDoc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-green-700 transition"
                        >
                          📑 View Document
                        </a>
                      </div>
                    </div>
                  </div>

                </div>



              </div>


              <div className="p-4 shadow-lg rounded-lg border w-full border-gray-200">
                <h2 className="font-semibold text-xl ">Buyer Profile</h2>
                <span className="text-green-600 font-medium text-sm flex mt-2  gap-1 " > {landRecords[0].status} <MdVerified size={20} color="green" /> </span>
                <div className="pt-4" >
                  <div className="flex justify-center ">
                    {!capturedImages.buyer ? (
                      <Webcam
                        ref={buyerWebcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width="80%"
                        videoConstraints={{ facingMode: "environment" }}
                      />
                    ) : (
                      <img src={capturedImages.buyer} alt="Buyer" width="100%" />
                    )}
                  </div>



                  <center>
                    <button
                      onClick={() => handleCapture("buyer", buyerWebcamRef)}
                      className="mt-4  bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg w-[250px]"
                    >
                      {capturedImages.buyer ? "Retake Buyer Photo" : "Capture Buyer Photo"}
                    </button>
                  </center>
                  <div className="p-6  rounded-lg  ">
                    <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-t-lg text-center">
                      Buyer Details
                    </h2>
                    <div className="p-4 space-y-3">
                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">🏠 Buyer Address: </span>
                        {selectedLand.buyerId.slice(0, 20)}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">👤 Name: </span>
                        {selectedLand.buyerName}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">🎂 Age: </span>
                        {selectedLand.buyerAge?.toString()}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">🏙️ City: </span>
                        {selectedLand.buyerCity}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">📄 Aadhar Number: </span>
                        {selectedLand.buyerAad}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">💳 PAN Number: </span>
                        {selectedLand.buyerPan}
                      </p>

                      <p className="text-gray-700">
                        <span className="font-medium text-gray-900">📧 Email ID: </span>
                        {selectedLand.buyerMail}
                      </p>

                      <div className="mt-4">
                        <a
                          href={selectedLand.buyerDoc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
                        >
                          📑 View Document
                        </a>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Witness Camera */}
            <div className="flex gap-4 justify-between" >
              <div className="p-4 border shadow-lg rounded-lg w-full  border-gray-200">
                <h2 className="font-semibold text-xl mb-4">Enter Witness Info</h2>
                <div className="" >
                  <div className="flex justify-center">
                    {!capturedImages.witness ? (
                      <Webcam
                        ref={witnessWebcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width="80%"
                        videoConstraints={{
                          facingMode: 'environment',
                        }}

                      />
                    ) : (
                      <img src={capturedImages.witness} alt="Witness" width="80%" />
                    )}
                  </div>
                  <center>
                    <button
                      onClick={() => handleCapture("witness", witnessWebcamRef)}
                      className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg  w-[250px]"
                    >
                      {capturedImages.witness ? 'Retake Witness Photo' : 'Capture Witness Photo'}
                    </button>
                  </center>
                  <div className="p-6 ">


                    <div className="p-4 space-y-4">
                      <input
                        type="text"
                        name="witnessName"
                        value={witnessData.witnessName}
                        onChange={handleOnchange}
                        placeholder=" Enter Witness Name"

                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />

                      <input
                        type="number"
                        name="witnessAge"
                        value={witnessData.witnessAge}
                        onChange={handleOnchange}
                        placeholder=" Enter Witness Age"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        name="witnessAadhar"
                        value={witnessData.witnessAadhar}
                        onChange={handleOnchange}
                        placeholder=" Enter Witness Aadhar Number"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />

                      <input
                        type="text"
                        name="witnessAddress"
                        value={witnessData.witnessAddress}
                        onChange={handleOnchange}
                        placeholder=" Enter Witness Address"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />

                    </div>
                  </div>

                </div>

              </div>
              <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 w-full">
                <h2 className="text-xl font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-t-lg text-center">
                  Land Information
                </h2>
                <div className="p-4 space-y-3">

                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-medium text-sm"> {landRecords[0].status} </span>
                    <MdVerified size={20} className="text-green-600" />
                  </div>

                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">🏡 Owner Address: </span>
                    {landRecords[0]?.sellerAddress || "N/A"}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">📏 Area (sqft): </span>
                    {landRecords[0].Area || "N/A"}

                  </p>

                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">🏷️ PID: </span>
                    {landRecords[0]?.PID || "N/A"}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">📑 Survey Number: </span>
                    {landRecords[0]?.surveyNo || "N/A"}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">📍 Address: </span>
                    {landRecords[0]?.location || "N/A"}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">💰 Price: </span>
                    ₹{landRecords[0]?.price || "N/A"}
                  </p>

                  <div className="mt-4">
                    <a
                      href={landRecords[0]?.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
                    >
                      📑 View Document
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Generate PDF */}
            <div className="text-center">
              <button
                onClick={handleClick}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                <span> Transfer Ownership </span>
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
            {landData.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="py-3 px-6">{row.reqId}</td>
                <td className="py-3 px-6">{row.landId}</td>
                <td className="py-3 px-6 truncate">{row.sellerId.slice(0, 8)}</td>
                <td className="py-3 px-6 truncate">{row.buyerId.slice(0, 8)}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${row.isPaymentDone === true ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}
                  >
                    {row.isPaymentDone === true ? 'Payment Done' : 'Payment Pending'}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleTransferOwnership(row)}
                    className={`py-2 px-4 rounded-lg flex items-center justify-center transition duration-300 ${row.isPaymentDone === true ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    disabled={row.isPaymentDone === true}
                  >
                    {row.isPaymentDone === true ? "Transfer Done" : "Transfer Ownership"}
                    {row.isPaymentDone !== true && <FaArrowRight className="ml-2" />}
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

