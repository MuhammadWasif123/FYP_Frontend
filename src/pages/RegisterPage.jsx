import { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    cnic_no: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    profile_image: null,
    cnic_front: null,
    cnic_back: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (let key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3004/api/v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Registered Successfully...");
    } catch (error) {
      console.error(error);
      setMessage("Registration Failed...");
    }
  };

  return (
    <>
    <div className="bg-[#eedcdc] py-6">
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-3xl text-center"> Register</h2>
      {message && <p className="mb-4 text-blue-700">{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <div className="flex justify-around mt-4">
            <div>
              <label
                htmlFor="firstname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <input
                name="firstname"
                type="text"
                placeholder="First Name"
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <input
                name="lastname"
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-around mt-4">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-around mt-4">
            <div>
              <label
                htmlFor="cnic_no"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                CNIC No
              </label>
              <input
                name="cnic_no"
                type="text"
                placeholder="CNIC No"
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="date_of_birth"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                DOB
              </label>
              <input
                name="date_of_birth"
                type="date"
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-around mt-4">
            <div>
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Gender
              </label>
              <select
                name="gender"
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="other">other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Mobile Number
              </label>
              <input
                name="phone"
                type="text"
                placeholder="Mobile Number"
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-around mt-4">
            <div>
              <label
                htmlFor="profile_image"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Profile Image
              </label>
              <input
                name="profile_image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="cnic_front"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                CNIC Front (required)
              </label>
              <input
                name="cnic_front"
                type="file"
                accept="image/*"
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-around mt-4">
            <div>
              <label
                htmlFor="cnic_back"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                CNIC Back (required)
              </label>
              <input
                name="cnic_back"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
        </div>
         <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded bg-blue-900 transition"
          >
            Submit
          </button>
      </form>
    </div>
    </div>
    </>
  );
};

export default RegisterPage;
