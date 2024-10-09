import landInspector from '../assets/inspector.jpg';
import user from '../assets/user.jpg';
import contractOwner from '../assets/owner.png';
import { Link } from 'react-router-dom';
const RoleCard = () => {
    return (
        <div>
            <div className="flex flex-col items-center mt-10">
                <h1 className="text-5xl font-sans text-gray-800">Login</h1>
                <div className="h-1 w-10 bg-green-400 mt-4"></div> {/* Adjusted height and width for better visibility */}
            </div>

            <div className=" mt-20 flex justify-evenly items-center  flex-wrap">
                {/* Card for Contract Owner */}
                <div className="text-center border p-5 rounded-lg shadow-lg bg-gray-100 hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out w-64">
                    <img
                        src={contractOwner}
                        alt="Contract Owner"
                        className="w-32 h-32 mx-auto rounded-full"
                    />
                    <h1 className="font-semibold mt-4 text-lg text-gray-700">Contract Owner</h1>
                    <p className="text-sm text-gray-500 mt-2">Manages contract details and permissions.</p>
                    <Link to="/contractOwner">
        <button className="mt-4 border border-blue-500 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
          Continue
        </button>
      </Link>
                </div>

                {/* Card for Land Inspector */}
                <div className="text-center border p-5 rounded-lg shadow-lg bg-gray-100 hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out w-64">
                    <img
                        src={landInspector}
                        alt="Land Inspector"
                        className="w-32 h-32 mx-auto rounded-full"
                    />
                    <h1 className="font-semibold mt-4 text-lg text-gray-700">Land Inspector</h1>
                    <p className="text-sm text-gray-500 mt-2">Oversees land inspection and verification.</p>
                    <Link to="/landInspector">
        <button className="mt-4 border border-blue-500 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
          Continue
        </button>
      </Link>
                </div>

                {/* Card for User */}
                <div className="text-center border p-5 rounded-lg shadow-lg bg-gray-100 hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out w-64">
                    <img
                        src={user}
                        alt="User"
                        className="w-32 h-32 mx-auto rounded-full"
                    />
                    <h1 className="font-semibold mt-4 text-lg text-gray-700">User</h1>
                    <p className="text-sm text-gray-500 mt-2">Accesses information and interacts with the system.</p>
                    <button className="mt-4 border border-yellow-500 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200">
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleCard;
