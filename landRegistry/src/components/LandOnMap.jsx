import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import toast from 'react-hot-toast';
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic2F1cmFiaG13IiwiYSI6ImNreTRiYzNidjBhMTkydnB2dmpoeGt4ZmgifQ.2QZ4CsNiygDTAhkqASpbPg";

const LandOnMap = ({onLocationSelect }) => {
  const [viewport, setViewport] = useState({
    latitude: 19.0760,  // Mumbai Latitude
    longitude: 72.8777, // Mumbai Longitude
    zoom: 10,           // Adjust zoom level as needed
  });
  

  const [polygon, setPolygon] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSatelliteView, setIsSatelliteView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_ACCESS_TOKEN,
        mapboxgl: mapboxgl,
        marker: false,
      });

      map.addControl(geocoder);

      geocoder.on("result", (e) => {
        setViewport({
          latitude: e.result.center[1],
          longitude: e.result.center[0],
          zoom: 15,
        });
      });
    }
  }, []);

  const handleMapClick = (event) => {
    if (isDrawing) {
      setPolygon((prevPolygon) => {
        const newPolygon = [...prevPolygon, [event.lngLat.lng, event.lngLat.lat]];
        return newPolygon;
      });
    }
  };

  const clearPolygon = () => {
    setPolygon([]);
    setIsDrawing(false);
  };

  const savePolygon = () => {
    if (onLocationSelect) {
      onLocationSelect(polygon);
    } else {
      console.warn("onLocationSelect is not provided in parent component.");
    }
    console.log("Saved Polygon:", polygon);
    //alert("Polygon Saved: " + JSON.stringify(polygon));
    toast.success('Polygon saved successfully');
  };

  const toggleDrawing = () => {
    setIsDrawing(!isDrawing);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div style={{ padding: "10px", background: "white", color: "#fff" }}>
        {/* <input
          type="text"
          placeholder="Search location"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        /> */}
     <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
  <button
    onClick={toggleDrawing}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
  >
    {isDrawing ? "Stop Drawing" : "Start Drawing"}
  </button>
  <button
    onClick={clearPolygon}
    className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600 transition duration-300"
  >
    Clear
  </button>
  <button
    onClick={savePolygon}
    className="bg-green-500 text-white px-4 py-2 rounded ml-2 hover:bg-green-600 transition duration-300"
  >
    Save
  </button>
  <button
    onClick={() => setIsSatelliteView(!isSatelliteView)}
    className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600 transition duration-300"
  >
    {isSatelliteView ? "Road Map View" : "Satellite View"}
  </button>
</div>

      </div>

      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        initialViewState={viewport}
        mapStyle={
          isSatelliteView
            ? "mapbox://styles/mapbox/satellite-v9"
            : "mapbox://styles/mapbox/streets-v11"
        }
        onClick={handleMapClick}
        style={{ width: "100%", height: "80vh",  borderRadius: "10px" }}
      >
        {polygon.length > 0 && (
          <Source
            id="polygon"
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [polygon],
              },
            }}
          >
            <Layer
              id="polygon-layer"
              type="fill"
              paint={{
                "fill-color": "#2596be",
                "fill-opacity": 0.5,
              }}
            />
          </Source>
        )}
        {polygon.length > 0 && (
          <Source
            id="line"
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: polygon,
              },
            }}
          >
            <Layer
              id="line-layer"
              type="line"
              paint={{
                "line-color": "#FF6347",
                "line-width": 3,
              }}
            />
          </Source>
        )}
        {polygon.map((point, index) => (
          <Marker key={index} longitude={point[0]} latitude={point[1]}>
            <div
              style={{
                backgroundColor: "red",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
              }}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default LandOnMap;
