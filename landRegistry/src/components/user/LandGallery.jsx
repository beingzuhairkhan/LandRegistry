import { useState, useEffect, useContext } from "react";
import { LandContext } from "../../../context/LandRegistry";
import toast from "react-hot-toast";
import ReactMapGL, { Marker } from 'react-map-gl';
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic2F1cmFiaG13IiwiYSI6ImNreTRiYzNidjBhMTkydnB2dmpoeGt4ZmgifQ.2QZ4CsNiygDTAhkqASpbPg";

const LandGallery = () => {
  const { returnAllLandList, getLandDetails, requestForBuy } = useContext(LandContext);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 25.207,
    longitude: 72.707,
    zoom: 10,
    width: "100%",
    height: "100%",
  });

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await returnAllLandList();
       // console.log("Land list:", response);

        if (response && Array.isArray(response)) {
       
          const detailedLands = await Promise.all(
            response.map(async (landId) => {
              try {
                const detailsArray = await getLandDetails(landId);
                    console.log("price info" , detailsArray)
                if (!Array.isArray(detailsArray) || detailsArray.length < 10) {
                  console.error("Unexpected land details format:", detailsArray);
                  return { id: landId }; 
                }

               
                const details = {
                  id: landId,
                  areaSqft: detailsArray[1], 
                  owner: detailsArray[8], 
                  price: detailsArray[3],
                  address: detailsArray[2], 
                  status: detailsArray[7] === "true" ? "Verified" : "Pending", 
                  isVerified: detailsArray[7] === "true",
                  coordinates: JSON.parse(detailsArray[4]), 
                };

                return details;
              } catch (error) {
                console.error(`Error fetching details for land ID ${landId}:`, error);
                return { id: landId, error: true }; 
              }
            })
          );

          setLands(detailedLands);
        }
      } catch (error) {
        console.error("Error fetching land data:", error);
        toast.error("Failed to load land listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, [returnAllLandList, getLandDetails]);

  const makeLandRequest = async (land) => {
    try {
      const response = await requestForBuy(land.id);
      toast.success("Land request sent successfully");
      console.log("response", response);
    } catch (error) {
      console.error("Error making land request:", error);
      toast.error("Failed to send land request");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Lands</h1>

      {loading ? (
        <p className="text-center">Loading lands...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => (
            <div key={land.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white border border-gray-200">
              <img
                className="w-full h-48 object-cover"
                src="https://plus.unsplash.com/premium_photo-1661963869605-4b5f4c8e55f2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Land Image"
              />

              <div className="p-4">
                <span
                  className={`inline-block text-sm px-3 py-1 rounded-full ${
                    land.status === "Verified" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                  }`}
                >
                  {land.status}
                </span>

                <h3 className="text-xl font-bold text-gray-800 mb-2">Land Details</h3>
                <p className="text-gray-600">
                  <strong>Area:</strong> {land.areaSqft} sqft
                </p>
                <p className="text-gray-600">
                  <strong>Address:</strong> {land.address}
                </p>
                <p className="text-gray-600">
                  {/* <strong>Price:</strong> ₹{land.price} */}
                  <p className="text-gray-600 mb-2"><strong>Price (INR):</strong> ₹{land.price.toLocaleString()}</p>
                </p>

                <div className="flex space-x-4 mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => makeLandRequest(land)}
                  >
                    Buy Land
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setSelectedLand(land);
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedLand && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Land Details</h2>
            <p><strong>Property ID:</strong> {selectedLand.id}</p>
            <p><strong>Area:</strong> {selectedLand.areaSqft} sqft</p>
            <p><strong>Address:</strong> {selectedLand.address}</p>
            <p><strong>Price:</strong> ₹{selectedLand.price.toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedLand.status}</p>
            <p><strong>Owner:</strong> {selectedLand.owner}</p>
            <p><strong>Verified:</strong> {selectedLand.isVerified ? "Yes" : "No"}</p>

            {/* Map display */}
            <div className="h-96 w-full mt-4">
              <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                onViewportChange={setViewport}
                mapStyle="mapbox://styles/mapbox/streets-v11"
              >
                {selectedLand.coordinates && selectedLand.coordinates.length > 0 && (
                  selectedLand.coordinates.map((coordinate, index) => (
                    <Marker
                      key={index}
                      latitude={coordinate[1]}
                      longitude={coordinate[0]}
                    >
                      <div className="bg-blue-500 text-white p-2 rounded-full">📍</div>
                    </Marker>
                  ))
                )}
              </ReactMapGL>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsModalOpen(false)} // Close modal
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandGallery;
