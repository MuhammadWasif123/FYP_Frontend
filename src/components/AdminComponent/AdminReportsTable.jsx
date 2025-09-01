// src/components/Admin/AdminReportsTable.jsx
import React from "react";

const fmt = (d) => (d ? new Date(d).toLocaleString() : "-");

const AdminReportsTable = ({ reports = [], onRowClick }) => {
  if (!reports || reports.length === 0) {
    return <div className="text-center text-gray-600 py-8">No reports found.</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-3">ID</th>
            <th className="text-left p-3">Reporter</th>
            <th className="text-left p-3">Crime Type</th>
            <th className="text-left p-3">Location</th>
            <th className="text-left p-3">Severity</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Incident At</th>
            <th className="text-left p-3">Created</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr
              key={r.id}
              className="border-t cursor-pointer hover:bg-gray-50"
              onClick={() => onRowClick?.(r)}
            >
              <td className="p-3">{r.id}</td>
              <td className="p-3">{r.reporter_id || "-"}</td>
              <td className="p-3">{r.crime_type || "-"}</td>
              <td className="p-3">{r.location_text || "-"}</td>
              <td className="p-3">{r.severity || "-"}</td>
              <td className="p-3">{r.status || "-"}</td>
              <td className="p-3">{fmt(r.incident_datetime)}</td>
              <td className="p-3">{fmt(r.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReportsTable;
