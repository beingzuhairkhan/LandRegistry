import { useState, useContext, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import LandOnMap from '../LandOnMap';
import { LandContext } from '../../../context/LandRegistry';
import axios from 'axios';
import toast from 'react-hot-toast';
const AddLand = () => {
  const { isUserVerified, addLand } = useContext(LandContext);
  const mapRef = useRef(null);

  const [landData, setLandData] = useState({
    area: '',
    landAddress: '',
    landPrice: '',
    propertyPID: '',
    surveyNumber: '',
    document: null,
    polygon: [],
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [uploading, setUploading] = useState(false); 
  const [documentUrl, setDocumentUrl] = useState(''); 

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLandData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      //alert("Only PDF documents are allowed!");
      toast.error("Only PDF documents are allowed!")
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // Limit to 5MB
     // alert("File size must be less than 5MB.");
      toast.error("File size must be less than 5MB.")
      return;
    }

    setLandData((prev) => ({ ...prev, document: file }));
  };

  // Upload document to IPFS using Pinata
  const uploadDocument = async () => {
    if (!landData.document) {
     // alert("Please select a file to upload.");
      toast.error("Please select a file to upload.")
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", landData.document);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: "85b349cea6317e38b967",
            pinata_secret_api_key: "6f637a1ff8a843f9036d1069f8a065e758abafb57b463d793906fcd4e37e1f47",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      setDocumentUrl(url); // Save IPFS URL
     // alert("Document uploaded successfully!");
      toast.success("Document uploaded successfully!");
    } catch (error) {
      console.error("Error uploading document:", error);
      //alert("Failed to upload document. Please try again.");
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isUserVerified) {
    // alert("You must be verified to add land.");
      toast.error("You must be verified to add land.");
      return;
    }

    if (landData.polygon.length < 3) {
     // alert("Please draw a valid polygon on the map.");
      toast.error("Please draw a valid polygon on the map.");
      return;
    }

    if (!documentUrl) {
      //alert("Please upload a document before submitting.");
      toast.error("Please upload a document before submitting.");
      return;
    }

    // Include the IPFS document URL in the land data
    addLand({ ...landData, document: documentUrl })
    .then(() => {
      // Toast on success
      toast.success("Land added successfully!");

      // Reset input fields
      setLandData({
        area: '',
        landAddress: '',
        landPrice: '',
        propertyPID: '',
        surveyNumber: '',
        document: null,
        polygon: [],
      
      });
      setDocumentUrl(""); // Reset document URL

      // Reset any other necessary fields here
    })
    .catch((error) => {
      // Handle error if any during the API request
      toast.error("An error occurred while adding the land.");
    });
};
  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">Add New Land</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Area and Price */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label className="block font-semibold text-gray-700 mb-1">Area (in Sqft):</label>
            <input
              type="number"
              name="area"
              value={landData.area}
              onChange={handleChange}
              placeholder="Enter area in sqft"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="w-full mt-1 md:w-1/2">
            <label className="block font-semibold text-gray-700">Land Price (INR):</label>
            <input
              type="number"
              name="landPrice"
              value={landData.landPrice}
              onChange={handleChange}
              placeholder="Enter land price"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Land Address */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Land Address:</label>
          <input
            type="text"
            name="landAddress"
            value={landData.landAddress}
            onChange={handleChange}
            placeholder="Enter full land address"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* PID & Survey Number */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label className="block font-semibold text-gray-700">Property PID:</label>
            <input
              type="text"
              name="propertyPID"
              value={landData.propertyPID}
              onChange={handleChange}
              placeholder="Enter Property Identification Number (PID)"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="w-full md:w-1/2">
            <label className="block font-semibold text-gray-700">Survey Number:</label>
            <input
              type="text"
              name="surveyNumber"
              value={landData.surveyNumber}
              onChange={handleChange}
              placeholder="Enter survey number"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Map Component */}
        <div className="mb-10 mt-20">
          <label className="block font-semibold text-gray-700 mb-2">Draw Land on Map:</label>
          <LandOnMap
            onLocationSelect={(polygon) => setLandData((prev) => ({ ...prev, polygon }))}
          />
        </div>

        {/* Upload Document */}
        <div>
          <label className="block font-semibold text-gray-700">Upload Land Document:</label>
          <input
            type="file"
            name="document"
            accept=".pdf"
            onChange={handleFileUpload}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button type="button"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
        onClick={uploadDocument} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload to IPFS"}
        </button>
        {documentUrl && (
          <div>
            <p>Document uploaded to IPFS:</p>
            <a href={documentUrl} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
          >
            Add Land
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLand;
