import { useState } from "react";

export default function AddLandInspectorForm() {
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    age: "",
    designation: "",
    city: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.address) formErrors.address = "Address is required";
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.age || formData.age < 18) formErrors.age = "Age must be 18 or above";
    if (!formData.designation) formErrors.designation = "Designation is required";
    if (!formData.city) formErrors.city = "City is required";
    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log(formData); // Submit the form data
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <h1 className="text-3xl font-semibold text-center mb-6">Add Land Inspector</h1>
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg space-y-4">

        {/* Address Input */}
        <div>
          <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
            Enter Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
            className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.address ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
          {errors.address && <span className="text-red-500 text-sm mt-1 block">{errors.address}</span>}
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Enter Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Sami Khan"
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
          {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name}</span>}
        </div>

        {/* Age Input */}
        <div>
          <label htmlFor="age" className="block text-gray-700 font-semibold mb-2">
            Enter Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            className={`w-full px-3 py-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.age ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
          {errors.age && <span className="text-red-500 text-sm mt-1 block">{errors.age}</span>}
        </div>

        {/* Designation Input */}
        <div>
          <label htmlFor="designation" className="block text-gray-700 font-semibold mb-2">
            Enter Designation
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Inspector"
            className={`w-full px-3 py-2 border ${errors.designation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.designation ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
          {errors.designation && <span className="text-red-500 text-sm mt-1 block">{errors.designation}</span>}
        </div>

        {/* City Input */}
        <div>
          <label htmlFor="city" className="block text-gray-700 font-semibold mb-2">
            Enter City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.city ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
          {errors.city && <span className="text-red-500 text-sm mt-1 block">{errors.city}</span>}
        </div>

        {/* Submit Button */}
        {/* Submit Button */}
        <div className="flex items-center justify-center">
          {/* <button
            type="submit"
            className="text-center w-[25%] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add
          </button> */}
          <button type="submit" className="relative  h-12 w-24 p-[2px] md:mt-10 overflow-hidden rounded-lg  focus:outline-none">
                    <span className="absolute inset-[-7000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"></span>

                    <span className=" p-4 inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-gray-900   font-medium text-white backdrop-blur-3xl text-md">
                    Add
                    </span>
                </button>
        </div>

      </form>
    </div>
  )
}
