import { useState, useContext, useEffect } from "react";
import { LandContext } from "../../../context/LandRegistry";

const AllLandInspector = () => {
    const { returnAllLandInspectorList, removeLandInspector } = useContext(LandContext);
    

    const [inspectors, setInspectors] = useState([]);

    useEffect(() => {
        const fetchInspectors = async () => {
            const allInspectors = await returnAllLandInspectorList();
            console.log("allInspectors", allInspectors);
            setInspectors(allInspectors);
        };

        fetchInspectors();
    }, [returnAllLandInspectorList]);

    const handleRemove = async (id) => {
        await removeLandInspector(id);
        setInspectors(inspectors.filter((inspector) => inspector.id !== id));
    };

    return (
        <div className="p-4">
            <h1 className="text-center text-3xl font-semibold mb-4">All Land Inspectors</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">No</th>
                        <th className="py-3 px-6 text-left">Name</th>
                        <th className="py-3 px-6 text-left">Address</th>
                        <th className="py-3 px-6 text-left">Age</th>
                        <th className="py-3 px-6 text-left">City</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {inspectors?.length > 0 ? (
                        inspectors.map((inspector, index) => (
                            <tr key={inspector.id} className="hover:bg-gray-100">
                                <td className="py-4 px-6 text-black">{index + 1}</td>
                                <td className="py-4 px-6 text-black">{inspector.name}</td>
                                <td className="py-4 px-6 text-black">{inspector.address}</td>
                                <td className="py-4 px-6 text-black">{inspector.age}</td>
                                <td className="py-4 px-6 text-black">{inspector.city}</td>
                                <td className="py-4 px-6 text-center">
                                    <button
                                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                                        onClick={() => handleRemove(inspector.id)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">
                                No Inspectors Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllLandInspector;
