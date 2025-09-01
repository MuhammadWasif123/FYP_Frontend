// src/pages/AdminDashboard.jsx
import { useState } from "react";
import axios from "axios";
import AdminReportsTable from "../components/AdminComponent/AdminReportsTable";
import ReportModal from "../components/UserDashboard/ReportModal"; // reuse your modal

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setMsg("");
    try {
      // If your API supports pagination you can append ?page=1 etc.
      const res = await axios.get("http://localhost:3004/api/v1/admin/reports/all", {
        withCredentials: true, // cookie-based auth
      });
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchReports}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Loading…" : "See all user reports"}
          </button>
        </div>
      </div>

      {msg && <div className="bg-gray-50 p-3 rounded text-sm">{msg}</div>}

      <AdminReportsTable reports={reports} onRowClick={(r) => setSelectedReport(r)} />

      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
