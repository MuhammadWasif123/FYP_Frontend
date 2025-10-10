import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
    }
  }, [location.state]);

  // ✅ Access CNIC number passed via state (from RegisterPage)
  const id = location.state?.id;
//   console.log("This is the user id we are getting", id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setMessage("User with this ID not found. Please register again.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3004/api/v1/user/verify-otp",
        {
          id,
          otp,
        }
      );

      setMessage(response.data.message);

      if (response.data.success) {
        setTimeout(() => {
          navigate("/login", {
            state: { successMessage: "OTP successfully verified" },
          });
        }, 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3004/api/v1/user/resend-otp",
        {
          id: id,
        }
      );
      toast.success("A new OTP has been sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-[400px]">
        <h2 className="text-2xl font-semibold mb-4 text-center">Verify OTP</h2>
        {message && <p className="text-center mb-3 text-blue-600">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2b303a] text-white py-2 rounded hover:bg-[#3b414e]"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            disabled={loading}
            className="w-full bg-[#2b303a] text-white py-2 rounded hover:bg-[#3b414e] mt-4"
            onClick={handleResendOtp}
          >
            {loading ? "Resending OTP..." : "Resend OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
