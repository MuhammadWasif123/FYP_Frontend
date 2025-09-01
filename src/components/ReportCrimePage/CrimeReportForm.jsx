// src/components/CrimeReportForm.jsx
import { useState, useRef } from "react";
import axios from "axios";
import { encryptReportData } from "../../utils/encrypt";
import { useAuth } from "../../context/AuthContext";
import MapPicker from "../MapComponent/MapPicker";

const CrimeReportForm = () => {
  const { user } = useAuth();

  const initialFormState = {
    crime_type: "",
    description: "",
    incident_datetime: "",
    location_text: "",
    latitude: "",
    longitude: "",
    severity: "Low",
    is_anonymous: false,

    // file fields
    report_image: null,
    report_video: null,
    report_audio: null,
    report_document: null,
  };

  // 🔹 Create refs for file inputs
  const docRef = useRef();
  const imgRef = useRef();
  const audioRef = useRef();
  const videoRef = useRef();

  const [form, setForm] = useState(initialFormState);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // prepare encrypted JSON payload
      const payload = { ...form, reporter_id: user?.id };
      const encryptedPayload = await encryptReportData(payload);

      // prepare FormData for files + encrypted data
      const formData = new FormData();
      formData.append("encryptedKey", encryptedPayload.encryptedKey);
      formData.append("iv", encryptedPayload.iv);
      formData.append("encryptedData", encryptedPayload.encryptedData);

      // attach files only if they exist
      if (form.report_image) {
        Array.from(form.report_image).forEach((file) =>
          formData.append("report_image", file)
        );
      }
      if (form.report_video) {
        Array.from(form.report_video).forEach((file) =>
          formData.append("report_video", file)
        );
      }
      if (form.report_audio) {
        Array.from(form.report_audio).forEach((file) =>
          formData.append("report_audio", file)
        );
      }
      if (form.report_document) {
        Array.from(form.report_document).forEach((file) =>
          formData.append("report_document", file)
        );
      }

      // send request
      const res = await axios.post(
        "http://localhost:3004/api/v1/report/create",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Crime Report submitted successfully");
      setForm(initialFormState);
      // ✅ Clear file inputs manually
      docRef.current.value = "";
      imgRef.current.value = "";
      audioRef.current.value = "";
      videoRef.current.value = "";

      console.log("Response", res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error Submitting Report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto p-6 bg-white shadow-lg rounded"
    >
      <h2 className="text-2xl font-bold">Report a Crime</h2>
      <p className="text-sm text-gray-500">
        Note: All file uploads (image, video, audio, documents) are optional.
      </p>
      {message && <p className="text-blue-600">{message}</p>}

      <input
        type="text"
        name="crime_type"
        placeholder="Crime Type"
        value={form.crime_type}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="datetime-local"
        name="incident_datetime"
        value={form.incident_datetime}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="text"
        name="location_text"
        placeholder="Location"
        value={form.location_text}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      {/* Map for lat/lng */}
      <MapPicker form={form} setForm={setForm} className="z-10" />

      <select
        name="severity"
        value={form.severity}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_anonymous"
          checked={form.is_anonymous}
          onChange={handleChange}
        />
        Submit Anonymously
      </label>

      {/* File Uploads */}
      <div className="space-y-2">
        <label>
          Upload Images (optional)
          <input
            type="file"
            name="report_image"
            multiple
            ref={imgRef}
            accept="image/*"
            onChange={handleChange}
            className="block my-2"
          />
        </label>
        {form.report_image &&
          Array.from(form.report_image).map((file, i) => (
            <p key={i} className="text-sm text-gray-600">
              📷 {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          ))}

        <label>
          Upload Videos (optional)
          <input
            type="file"
            name="report_video"
            ref={videoRef}
            multiple
            accept="video/*"
            onChange={handleChange}
            className="block my-2"
          />
        </label>
        {form.report_video &&
          Array.from(form.report_video).map((file, i) => (
            <p key={i} className="text-sm text-gray-600">
              🎥 {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          ))}

        <label>
          Upload Audio (optional)
          <input
            type="file"
            name="report_audio"
            ref={audioRef}
            multiple
            accept="audio/*"
            onChange={handleChange}
            className="block my-2"
          />
        </label>
        {form.report_audio &&
          Array.from(form.report_audio).map((file, i) => (
            <p key={i} className="text-sm text-gray-600">
              🎵 {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          ))}

        <label>
          Upload Documents (optional)
          <input
            type="file"
            name="report_document"
            multiple
            ref={docRef}
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleChange}
            className="block my-2"
          />
        </label>
        {form.report_document &&
          Array.from(form.report_document).map((file, i) => (
            <p key={i} className="text-sm text-gray-600">
              📄 {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          ))}
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
        className="bg-blue-900 text-white px-4 py-2 rounded"
      >
        Submit Report
      </button>
    </form>
  );
};

export default CrimeReportForm;
