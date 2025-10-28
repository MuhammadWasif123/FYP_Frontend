// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import AdminReportsTable from "../components/AdminComponent/AdminReportsTable";
import ReportModal from "../components/UserDashboard/ReportModal";
import AdminUsersTable from "../components/AdminComponent/AdminUsersTable";
import Papa from "papaparse";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  "Pending",
  "Under Investigation",
  "Resolved",
  "Rejected",
];

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectedReport, setSelectedReport] = useState(null); // for details modal
  const [updateReport, setUpdateReport] = useState(null); // for status update modal
  const [newStatus, setNewStatus] = useState("Pending");
  const [users, setUsers] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvEData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    station_name: "",
    email: "",
    sub_division: "",
    station_lng: "",
    station_lat: "",
    district: "",
    zone: "",
    head_muharar_name: "",
    head_muharar_phone: "",
    station_map_url: "",
    area_cord: "",
    city: "",
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("Please Upload a CSV File");

    setCsvFile(file);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((row) => {
          if (row.area_cord) {
            try {
              if (typeof row.area_cord === "string") {
                row.area_cord = row.area_cord.trim().startsWith("[")
                  ? row.area_cord
                  : JSON.stringify(row.area_cord);
              } else {
                row.area_cord = JSON.stringify(row.area_cord);
              }
            } catch (err) {
              console.error("Invalid area_cord format:", row.area_cord);
              row.area_cord = null;
            }
          } else {
            row.area_cord = null;
          }

          return row;
        });
        // console.log("Parsed CSV Data:", parsedData);

        setCsvEData(parsedData);
        toast.success("CSV Parsed Successfully");
      },
      error: (err) => {
        console.error("Error Parsing CSV:", err);
        toast.error("Failed to parse CSV File");
      },
    });
  };

  const handleSubmitCSV = async () => {
    if (!csvData.length) return toast.error("Please Upload a CSV File First!");

    console.log(
      `Final Checking of CSV array of object before sending ${csvData}`
    );

    try {
      const res = await axios.post(
        "http://localhost:3004/api/v1/authority/add/bulk",
        csvData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("File Uploaded Successfully");
      console.log("Server Response: ", res);

      setCsvFile(null);
      setCsvEData([]);
    } catch (error) {
      const backendErrorData = error.response?.data;
      if (backendErrorData?.errors && backendErrorData.errors.length > 0) {
        backendErrorData.errors.forEach((err) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(backendErrorData?.message || "Something went wrong!");
      }
      setMessage(error.response?.data?.message || "Login Failed");
    }
  };

  // Handle Input Change Function
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch all reports User has added
  const fetchReports = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.get(
        "http://localhost:3004/api/v1/admin/reports/all",
        { withCredentials: true }
      );
      setReports(res.data?.reports || []);
      setMsg(res.data?.message || "");
    } catch (err) {
      console.error("Admin fetch error:", err);
      setMsg(err?.response?.data?.message || "Failed to fetch reports.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchUsers();
  }, []);

  // Delete a report
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(
        `http://localhost:3004/api/v1/admin/reports/delete/${id}`,
        { withCredentials: true }
      );
      alert("Report deleted successfully!");
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(
        "Error deleting report: " + (err.response?.data?.message || err.message)
      );
    }
  };

  //   Admin Fetching All Users

  const fetchUsers = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.get(
        "http://localhost:3004/api/v1/admin/user/all",
        {
          withCredentials: true,
        }
      );
      setUsers(res.data?.users || []);
      setMsg(res.data?.message || "");
    } catch (err) {
      console.error("User fetch error:", err);
      setMsg(err?.response?.data?.message || "Failed to fetch users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Making API Integration Function Authrity Form Add

  const handleAddAuthority = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3004/api/v1/authority/add",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Authority Added Successfully");

      setShowModal(false);

      console.log(
        `This is the success response from authority add form api ${res}`
      );

      setFormData({
        station_name: "",
        email: "",
        sub_division: "",
        station_lng: "",
        station_lat: "",
        district: "",
        zone: "",
        head_muharar_name: "",
        head_muharar_phone: "",
        station_map_url: "",
        area_cord: "",
        city: "",
      });
    } catch (error) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add authority");
    } finally{
      setLoading(false)
    }
  };

  // Updating report status
  const handleStatusUpdate = async () => {
    if (!updateReport) return;

    try {
      const res = await axios.put(
        `http://localhost:3004/api/v1/admin/reports/update-status/${updateReport.id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      alert(res.data.message);

      // Update UI instantly
      setReports((prev) =>
        prev.map((r) =>
          r.id === updateReport.id ? { ...r, status: newStatus } : r
        )
      );

      // Close modal
      setUpdateReport(null);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  //   Admin Deleting Registered Users
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:3004/api/v1/admin/user/delete/${id}`,
        { withCredentials: true }
      );

      alert(res.data.message || "User deleted successfully!");

      // Update UI instantly
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete user error:", err);
      alert(
        "Error deleting user: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        {/* Button to see all user reports */}
        <div className="flex justify-center">
          <button
            onClick={fetchReports}
            disabled={loading}
            className="bg-[#2b303a] text-white px-4 py-2 rounded disabled:opacity-60 cursor-pointer text-sm"
          >
            {loading ? "Loading…" : "See all user reports"}
          </button>
        </div>

        {/* Button to see all users */}
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="bg-[#2b303a] text-white px-4 py-2 rounded disabled:opacity-60 cursor-pointer text-sm"
        >
          {loading ? "Loading…" : "See all users"}
        </button>
      </div>

      {/* CSV Upload Section Adding Authority */}
      <div>
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="border border-gray-300 p-2 rounded text-sm"
          />
          <button
            onClick={handleSubmitCSV}
            className="bg-[#2b303a] text-white px-3 py-2 rounded text-sm cursor-pointer"
          >
            Upload CSV
          </button>
        </div>

        <div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#2b303a] text-[#fff] px-4 py-2 rounded cursor-pointer"
          >
            Add new Authority
          </button>
        </div>
      </div>

      {/* Reports table */}
      <AdminReportsTable
        reports={reports}
        onRowClick={(r) => setSelectedReport(r)}
        onDelete={handleDelete}
        onUpdateClick={(r) => {
          setUpdateReport(r);
          setNewStatus(r.status);
        }}
      />

      {/* Report details modal */}
      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* Users Table Only Active When users length greater than zero */}
      {users.length > 0 && (
        <AdminUsersTable users={users} onDeleteUser={handleDeleteUser} />
      )}

      {/* Status update modal */}
      {updateReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">
              Update Status for Report {updateReport.id}
            </h2>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUpdateReport(null)}
                className="px-4 py-2 bg-[#2b303a] text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-[#2b303a] text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal for the Authority Add Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add New Authority</h2>
            <form onSubmit={handleAddAuthority} className="space-y-3">
              <input
                name="station_name"
                value={formData.station_name}
                onChange={handleInputChange}
                placeholder="Station Name"
                className="border p-2 rounded"
                required
              />

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border p-2 rounded"
              />

              <input
                name="sub_division"
                value={formData.sub_division}
                onChange={handleInputChange}
                placeholder="Sub Division"
                className="border p-2 rounded"
              />

              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                className="border p-2 rounded"
                required
              />

              <input
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                placeholder="District"
                className="border p-2 rounded"
              />

              <input
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                placeholder="Zone"
                className="border p-2 rounded"
              />

              <input
                name="station_lng"
                value={formData.station_lng}
                onChange={handleInputChange}
                placeholder="Station Longitude"
                className="border p-2 rounded"
              />

              <input
                name="station_lat"
                value={formData.station_lat}
                onChange={handleInputChange}
                placeholder="Station Latitude"
                className="border p-2 rounded"
              />

              <input
                name="head_muharar_name"
                value={formData.head_muharar_name}
                onChange={handleInputChange}
                placeholder="Head Muharar Name"
                className="border p-2 rounded"
              />

              <input
                name="head_muharar_phone"
                type="number"
                value={formData.head_muharar_phone}
                onChange={handleInputChange}
                placeholder="Head Muharar Phone"
                className="border p-2 rounded"
              />

              <input
                name="station_map_url"
                value={formData.station_map_url}
                onChange={handleInputChange}
                placeholder="Station Map URL"
                className="border p-2 rounded"
              />

              <input
                name="area_map_url"
                value={formData.area_map_url}
                onChange={handleInputChange}
                placeholder="Area Map URL"
                className="border p-2 rounded"
              />

              <textarea
                name="area_cord"
                value={formData.area_cord}
                onChange={handleInputChange}
                placeholder="Area Coordinates (e.g. [[[24.93,67.02],[24.94,67.03]]])"
                className="border p-2 rounded col-span-2"
                rows={4}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#2b303a] text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2b303a] text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
