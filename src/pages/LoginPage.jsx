import axios from "axios";
import { useState ,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({
    cnic_no: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { user,setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value, //just update text inputs
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3004/api/v1/user/login",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, //For Setting Cookies
        }
      );

      setMessage("Login Successful");
      // After Successfull Login Redirect the User to Home Page
      
      setUser(response.data.data.loginUser);

      console.log("user data from login api:", response.data);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Login Failed");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
    <div className="bg-[#eedcdc] py-6 h-screen flex items-center justify-center">
      <div className="min-w-xl mx-auto p-6 bg-white shadow rounded">
        <h2 className="text-3xl text-center">Login</h2>
        {message && <p className="mb-4 text-blue-700">{message}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <div className="flex flex-col gap-2 mt-4">
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
                  value={form.cnic_no}
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
                  value={form.password}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded bg-blue-900 transition cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>


      </div>
    </>
  );
};

export default LoginPage;
