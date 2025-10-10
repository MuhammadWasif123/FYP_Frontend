import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import topLogo from "../assets/logo.png";

const Navbar = () => {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:3004/api/v1/user/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  console.log(user);
  return (
    <nav className="bg-[#2b303a]">
      <div className="flex items-center justify-between max-w-screen-xl px-4 py-2 mx-auto">
        <div>
          <a href="#" className="flex justify-center items-center">
            <img
              src={topLogo}
              className="h-6 mr-3 sm:h-9"
              alt="Landwind Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-[#D9CAC2]">
              Crime Reporting
            </span>
          </a>
        </div>

        <div className="items-center justify-between lg:flex lg:w-auto lg:order-1">
          <ul className="flex mt-4 font-medium md:flex md:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <Link
                to="/"
                className="block py-2 pl-3 pr-4 text-[#D9CAC2] rounded lg:p-0"
              >
                Home
              </Link>
            </li>
            <li>
              {/* 👇 Only show if logged in */}
              {user && user.role !== "admin" && (
                <Link
                  to="/report-crime"
                  className="block py-2 pl-3 pr-4 text-[#D9CAC2] rounded lg:p-0"
                >
                  Report Crime
                </Link>
              )}
            </li>

            <li>
              {/* Only Show If User is Logged In */}
              {user && user.role !== "admin" && (
                <Link
                  to="/dashboard"
                  className="block py-2 pl-3 pr-4 text-[#D9CAC2] rounded lg:p-0"
                >
                  Dashboard
                </Link>
              )}
            </li>
        
            {/* Admin Dashboard Link */}
            <li>
              {user && user.role === "admin" && (
                <Link
                  to="/admin"
                  className="block py-2 pl-3 pr-4 text-[#D9CAC2] rounded lg:p-0"
                >
                  Admin Dashboard
                </Link>
              )}
            </li>
          </ul>
        </div>

        <div className="items-center justify-between lg:flex lg:w-auto lg:order-2 gap-2">
          {user ? (
            <>
              <span className="mr-4 text-[#D9CAC2]">
                {user.firstname} ({user.email})
              </span>
              <div className="max-w-[20px]">
                <img
                  src={user.profile_image}
                  alt=""
                  className="rounded-full w-full"
                />
              </div>
              <button
                onClick={handleLogout}
                className="bg-[#e8d6d6] px-3 py-1 rounded cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="text-[#D9CAC2] cursor-pointer">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
