// src/components/CrimeReportForm.jsx
import { useState } from "react";
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

  const [form, setForm] = useState(initialFormState);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // prepare encrypted JSON payload
      const payload = { ...form, reporter_id: user?.id };
      const encryptedPayload = await encryptReportData(payload);

      // prepare FormData for files + encrypted data
      const formData = new FormData();
      formData.append("encryptedData", encryptedPayload);

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
      console.log("Response", res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error Submitting Report");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto p-6 bg-white shadow rounded"
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
      <MapPicker form={form} setForm={setForm} />

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


      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Report
      </button>
    </form>
  );
};

export default CrimeReportForm;
