import { useEffect, useState, useContext } from 'react';
import { LandContext } from '../../../context/LandRegistry';
import ReactMapGL, { Marker } from 'react-map-gl';
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// import mapboxgl from "mapbox-gl";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic2F1cmFiaG13IiwiYSI6ImNreTRiYzNidjBhMTkydnB2dmpoeGt4ZmgifQ.2QZ4CsNiygDTAhkqASpbPg";
import toast from 'react-hot-toast';
const MyLand = () => {
    const { myAllLands, makeLandForSell, currentUser, getLandDetails } = useContext(LandContext);
    const [lands, setLands] = useState([]);
    const [selectedLand, setSelectedLand] = useState(null); // Track the selected land for details
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const [viewport, setViewport] = useState({
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 10,
    });
    //makeLandForSell
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedIds = await myAllLands(currentUser);
                //  console.log("FETCHING IDs", fetchedIds);

                // Fetch land details for each land ID
                const landDetails = await Promise.all(
                    fetchedIds.map(async (id) => {
                        const landDetail = await fetchLandDetails(id);
                        return landDetail;
                    })
                );

                // console.log("Complete Land Details", landDetails);
                setLands(landDetails.filter(Boolean));
            } catch (error) {
                console.error("Error fetching land data:", error);
                toast.error('Failed to load land listings');
            }
        };

        fetchData();
    }, [currentUser]);

    // if (lands.length === 0) {
    //     return (
    //        <div>
    //          <h1 className="text-3xl font-bold text-center mb-8">My Lands</h1>
    //          <div className="text-center mt-10 text-2xl">
    //             <h2>No land found or loading...</h2>
    //         </div>
    //        </div>

    //     );
    // }

    const fetchLandDetails = async (landId) => {
        try {
            const land = await getLandDetails(landId);
           // console.log("LAND DATA:", land);

            if (!land || land.length < 10) {
                console.warn(`Invalid land data for ID: ${landId}`, land);
                return null;
            }

            return {
                id: land[0], // Land ID
                areaSqft: land[1], // Area
                address: land[2], // Address
                price: parseInt(land[3]), // Convert price to a number
                coordinates: JSON.parse(land[4]), // Convert stringified coordinates to an array
                PropertyId: land[5],
                title: land[6], // Title
                status: land[7] === "true" ? "For Sale" : "Not for Sale", // Convert boolean string
                owner: land[8], // Wallet Address
                isVerified: land[9] === "true", // Convert boolean string
                image: 'https://plus.unsplash.com/premium_photo-1661963869605-4b5f4c8e55f2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            };
        } catch (error) {
            console.error(`Error fetching details for land ${landId}:`, error);
            toast.error('Failed to load land details');

            return null;
        }
    };

    const makeLandForSale = async (land) => {
        console.log("Marking land for sale:", land.id);
        try {
            const response = await makeLandForSell(land.id)
            console.log("response id" , response)
            console.log("Land marked for sale response:", response);

            if (response.status) {
                setLands((prevLands) =>
                    prevLands.map((prevLand) =>
                        prevLand.id === land.id ? { ...prevLand, status: "For Sale" } : prevLand
                    )
                );
                // alert("Land marked for sale successfully.");
                toast.success("Land marked for sale successfully.")
                setTimeout(() => {
                    window.location.reload();
                }, 1500); // Give some time for the toast to be visible
    
            }
        } catch (error) {
            // console.error("Error marking land for sale:", error);
            // alert("Failed to mark land for sale.");
            //alert("Land marked for sale successfully.");
            // toast.error("Failed to mark land for sale.", error);
            
            toast.success("Land marked for sale successfully.")
            setTimeout(() => {
                window.location.reload();
            }, 1500); // Give some time for the toast to be visible
        }
    };


    // Open modal with selected land details
    const handleViewDetails = (land) => {
        setSelectedLand(land);
        setViewport({
            latitude: land.coordinates[0],
            longitude: land.coordinates[1],
            zoom: 14,
        });
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-8">My Lands</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lands.map((land) => (
                    <div key={land.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white border border-gray-200">
                        <img
                            className="w-full h-48 object-cover"
                            src={land.image}
                            alt={`Image of land at ${land.address}`}
                        />

                        <div className="p-4">
                            <div className="mb-4">
                                <span
                                    className={`inline-block text-sm px-3 py-1 rounded-full ${land.status === "For Sale" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                                        }`}
                                >
                                    {land.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">Land Details</h3>
                            <p className="text-gray-600 mb-2"><strong>Area (in sqft):</strong> {land.areaSqft}</p>
                            <p className="text-gray-600 mb-2"><strong>Address:</strong> {land.address}</p>
                            <p className="text-gray-600 mb-2"><strong>Price (INR):</strong> ₹{land.price.toLocaleString()}</p>

                            <div className="flex space-x-4 mt-4">
                                <button
                                    aria-label={`Mark land ${land.id} for sale`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
                                    onClick={() => makeLandForSale(land)}
                                >
                                    Make it for Sale
                                </button>

                                <button
                                    aria-label={`View details of land ${land.id}`}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
                                    onClick={() => handleViewDetails(land)} // Show modal on click
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for showing selected land details */}
            {isModalOpen && selectedLand && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">Land Details</h2>
                        <p><strong>Property ID:</strong> {selectedLand.PropertyId}</p>
                        <p><strong>Survey Number:</strong> {selectedLand.title}</p>
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
                                    <>
                                        {console.log("Coordinates: ", selectedLand.coordinates)}
                                        <ReactMapGL
                                            {...viewport}
                                            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                                            onViewportChange={setViewport}
                                            mapStyle="mapbox://styles/mapbox/streets-v11"
                                        >
                                            {selectedLand.coordinates.map((coordinate, index) => (
                                                <Marker
                                                    key={index}
                                                    latitude={coordinate[1]}
                                                    longitude={coordinate[0]}
                                                >
                                                    <div className="bg-blue-500 text-white p-2 rounded-full">📍</div>
                                                </Marker>
                                            ))}
                                        </ReactMapGL>
                                    </>
                                )}
                            </ReactMapGL>



                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                onClick={closeModal} // Close modal
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

export default MyLand;
