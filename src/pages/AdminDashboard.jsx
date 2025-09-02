// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import AdminReportsTable from "../components/AdminComponent/AdminReportsTable";
import ReportModal from "../components/UserDashboard/ReportModal";
import AdminUsersTable from "../components/AdminComponent/AdminUsersTable";

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

  // Fetch all reports
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
    alert("Error deleting user: " + (err.response?.data?.message || err.message));
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
      {/* {msg && <div className="bg-gray-50 p-3 rounded text-sm">{msg}</div>} */}

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
      {users.length > 0 && <AdminUsersTable users={users} onDeleteUser={handleDeleteUser} />}

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
    </div>
  );
};

export default AdminDashboard;
