import { useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// fix default marker icon path (only need once in app; you can put this in a leafletConfig file)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ReportModal = ({ report, loading, error, onClose }) => {
  // This will close Modal on ESC

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!report && !loading && !error) return null;

  const lat = report?.latitude ? parseFloat(report.latitude) : null;
  const lng = report?.longitude ? parseFloat(report.longitude) : null;
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

  return (
    <>
    <div className="py-4">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center "
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="text-center py-12">Loading report…</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold mb-2">
                  {report.crime_type}
                </h2>
                {/* <button onClick={onClose} className="text-gray-600">
                Close
              </button> */}
              </div>

              <div className="text-sm space-y-2">
                <p>
                  <strong>Description:</strong> {report.description || "-"}
                </p>
                <p>
                  <strong>Location:</strong> {report.location_text || "-"}
                </p>
                <p>
                  <strong>Severity:</strong> {report.severity || "-"}
                </p>
                <p>
                  <strong>Status:</strong> {report.status || "-"}
                </p>
                <p>
                  <strong>Incident At:</strong>{" "}
                  {report.incident_datetime
                    ? new Date(report.incident_datetime).toLocaleString()
                    : "-"}
                </p>
                <p>
                  <strong>Reported At:</strong>{" "}
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "-"}
                </p>
                <p>
                  <strong>Anonymous:</strong>{" "}
                  {report.is_anonymous ? "Yes" : "No"}
                </p>
              </div>

              {/* Map: only if coordinates are valid */}
              {hasCoords && (
                <div className="mt-4 h-48">
                  <MapContainer
                    center={[lat, lng]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[lat, lng]} />
                  </MapContainer>
                </div>
              )}

              {/* evidences list (if any). Could be URLs to images/files */}
              <div className="mt-4">
                <h3 className="font-medium">Evidences</h3>
                {report.evidences && report.evidences.length ? (
                  <ul className="space-y-2 mt-2">
                    {report.evidences.map((ev) => (
                      <li key={ev.id || ev}>
                        {/* adjust rendering depending on evidence shape (URL or object) */}
                        {ev.url ? (
                          <a
                            href={ev.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline"
                          >
                            View evidence
                          </a>
                        ) : (
                          <span> {JSON.stringify(ev)} </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    No evidences attached.
                  </p>
                )}
              </div>

              <div className="mt-4 text-right">
                <button
                  onClick={onClose}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default ReportModal;
