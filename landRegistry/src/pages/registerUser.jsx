import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LandContext } from '../../context/LandRegistry';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    city: "",
    aadharNumber: "",
    panNumber: "",
    email: "",
  });
  const [file, setFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { currentUser, registerUser } = useContext(LandContext);

  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Upload the document to IPFS via Pinata
  const uploadDocument = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

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
      setDocumentUrl(url);
      toast.success("Document uploaded successfully!");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  // Validate the form
  const validateForm = () => {
    const { name, age, city, aadharNumber, panNumber, email } = formData;
    const formattedAadhar = aadharNumber.replace(/\s/g, "");
    // Aadhar Number Validation
    const aadharRegex = /^[0-9]{12}$/;
    if (!formattedAadhar.match(aadharRegex)) {
      toast.error("Invalid Aadhar number. It should be 12 digits.");
      return false;
    }

    // PAN Number Validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panNumber.match(panRegex)) {
      toast.error("Invalid PAN number. Format should be: ABCd2073B");
      return false;
    }
    if(age < 18){
      toast.error("Age should be greater than or equal to 18");
      return false;
    }

    if (!name || !age || !city || !aadharNumber || !panNumber || !email) {
      toast.error("All fields are required.");
      return false;
    }

    if (!documentUrl) {
      toast.error("Please upload a document.");
      return false;
    }

    return true;
  };

  // Register the user with the smart contract
  const addUser = async () => {
    if (!validateForm()) return;
    if (!documentUrl) {
      toast.error("Please upload a document first");
      return;
    }

    try {
      const data = await registerUser({
        name: formData.name,
        age: formData.age,
        city: formData.city,
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber,
        email: formData.email,
        document: documentUrl,
      });
      toast.success("User registered successfully!");
      navigate("/user");
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register user.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-5xl font-sans text-gray-800">Register</h1>
      <div className="h-1 w-10 bg-green-400 mt-4"></div>

      <div className="mt-10 w-96 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Registration</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="aadharNumber"
          placeholder="Aadhar Number"
          value={formData.aadharNumber}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="panNumber"
          placeholder="PAN Number"
          value={formData.panNumber}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
          required
        />

        <div className="mb-3">
          <label className="block text-gray-700 font-medium">Upload Document (JPG/PDF)</label>
          <input
            type="file"
            accept=".jpg,.pdf"
            onChange={handleFileChange}
            className="mt-2 w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={uploadDocument}
          disabled={uploading}
          className={`mt-2 p-2 text-white mr-20 rounded ${uploading ? "bg-gray-400" : "bg-green-500"} transition duration-200`}
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>

        <button
          onClick={addUser}
          className="mt-4 border left-10 border-green-500 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
