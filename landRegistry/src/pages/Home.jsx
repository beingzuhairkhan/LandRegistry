import Hero from '../assets/hero.png';
import RoleCard from '../components/RoleCard';
import KeyFeatures from '../components/KeyFeatures';
import HeroBorder from '../assets/hero-shape.svg';
import FAQ from '../components/FAQ'
import LandRecords from '../components/LandRecords'
const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-customBlue text-white p-24 ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-5xl font-semibold mb-4">Land </h1>
            <h1 className="text-5xl font-semibold mb-4"> Registration using</h1>
            <h1 className="text-5xl font-semibold mb-4">Blockchain</h1>
            <div className="h-1 w-8 bg-green-500 mt-3 mb-3" ></div>
            <p className="text-lg text-gray-400 mb-4">
              Our blockchain-based land registry system provides secure, transparent, and immutable management of land records.
            </p>
            <p className="text-lg text-gray-400 mb-6">
              Experience an efficient property transfer and verification system powered by decentralized technology.
            </p>

            {/* Buttons Section */}
            <div className="space-x-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300">
                Watch Video
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300">
                Learn More
              </button>
            </div>
          </div>


          {/* Image Section */}
          <div className="w-full md:w-2/3 h-2/3 mb-6 md:mb-0 relative">
            {/* Blurred border effect */}
            <div className="absolute inset-0 pointer-events-none" />
            <img src={Hero} alt="Blockchain Land Registry" className="w-full h-full object-cover rounded-lg " />
          </div>


        </div>
      </div>

      {/* Hero Border Section */}
      <div>
        <img src={HeroBorder} alt="Hero Border" className="w-full h-auto" />
      </div>

      {/* Additional Components */}
      <RoleCard />
      <LandRecords/>
      <KeyFeatures />
      <FAQ />
    </div>
  );
};

export default Home;
