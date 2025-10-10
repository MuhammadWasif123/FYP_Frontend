import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

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

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      let newValue = value;

      if (name === "cnic_no") {
        let digits = newValue.replace(/\D/g, "").slice(0, 13);

        if (digits.length > 5 && digits.length <= 12) {
          newValue = digits.slice(0, 5) + "-" + digits.slice(5, 12);
        }
        if (digits.length === 13) {
          newValue =
            digits.slice(0, 5) +
            "-" +
            digits.slice(5, 12) +
            "-" +
            digits.slice(12);
        } else if (digits.length <= 5) {
          newValue = digits;
        }
      }

      if (name === "phone") {
        let digits = newValue.replace(/\D/g, "");
        if (digits.length > 11) digits = digits.slice(0, 11);
        newValue = digits;
      }

      setForm((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Invalid email format.Please Add @";
    }

    if (name === "password") {
      if (value.length < 8) error = "Password must be at least 8 characters";
    }

    if (name === "phone") {
      if (value.length !== 11) error = "Phone number must be 11 digits";
    }

    if (name === "cnic_no") {
      if (!/^\d{5}-\d{7}-\d{1}$/.test(value)) {
        error = "CNIC must be in format 12345-1234567-1";
      }
    }

    if (name === "date_of_birth") {
      const today = new Date().toISOString().split("T")[0];
      if (value > today) {
        error = "DOB cannot be any future Date";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    for (let key in form) {
      validateField(key, form[key]);
    }
    if (Object.values(errors).some((err) => err)) return;

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
      const userId = response.data.data.id;
      // console.log("wasif response data testing",response.data.data.id)
      navigate("/verify-otp", {
        state: {
          id: userId,
          successMessage:
            "Registration successfull! Please verify your OTP sent to your email.",
        },
      });
    } catch (error) {
      // console.error("Error:", error.response?.data);
      const backendErrorData = error.response?.data;
      if (backendErrorData?.errors && backendErrorData.errors.length > 0) {
        backendErrorData.errors.forEach((err) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(backendErrorData?.message || "Something went wrong!");
      }
      setMessage(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#eedcdc] py-6">
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
          <h2 className="text-3xl text-center mb-4"> Register</h2>
          {message && <p className="mb-4 text-blue-700">{message}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-6">
              <div className="flex justify-start gap-8 w-full">
                <div className="w-1/2">
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
                <div className="w-1/2">
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
              <div className="flex justify-start gap-8 w-full">
                <div className="w-1/2">
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
                    onBlur={(e) => validateField("email", e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="w-1/2">
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
                    onBlur={(e) => validateField("password", e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-start gap-8 w-full">
                <div className="w-1/2">
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
                    onBlur={(e) => validateField("cnic_no", e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.cnic_no && (
                    <p className="text-red-500 text-sm">{errors.cnic_no}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="date_of_birth"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    DOB
                  </label>
                  <input
                    name="date_of_birth"
                    type="date"
                    max={new Date().toISOString().split("T")[0]} // restricts future dates
                    onChange={handleChange}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-start gap-8 w-full">
                <div className="w-1/2">
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
                <div className="w-1/2">
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
                    onBlur={(e) => validateField("phone", e.target.value)}
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-start gap-8 w-full">
                <div className="w-1/2">
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
                <div className="w-1/2">
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
              <div className="flex justify-start gap-8 w-full">
                <div className="w-full">
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

            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs z-99999">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded bg-[#2b303a] transition cursor-pointer"
            >
              Submit
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
