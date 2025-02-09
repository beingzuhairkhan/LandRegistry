import { useEffect, useState } from "react";

const LandRecords = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.data.gov.in/resource/e0044f1d-bba9-4da6-90ec-cfbee247c7b3?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=10"
      );
      const result = await response.json();
      console.log("result" , result)
      setData(result.records || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Land Records (DILRMP)</h1>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full bg-white border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Sl. No.</th>
              <th className="border px-4 py-2">State/UT</th>
              <th className="border px-4 py-2">No. of Districts Covered</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border px-4 py-2">{item.sl__no_}</td>
                <td className="border px-4 py-2">{item.states_ut}</td>
                <td className="border px-4 py-2">{item.no__of_district_covered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LandRecords;
