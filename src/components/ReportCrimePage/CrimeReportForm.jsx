import { useState } from "react";
import axios from "axios";
import { encryptReportData } from "../../utils/encrypt";
import { useAuth } from "../../context/AuthContext";
import MapPicker from "../MapComponent/MapPicker";

const CrimeReportForm = () => {
  const { user } = useAuth();
  const initialFormState= {
    crime_type: "",
    description: "",
    incident_datetime: "",
    location_text: "",
    latitude: "",
    longitude: "",
    severity: "Low",
    is_anonymous: false,
  };
  const [form, setForm] = useState(initialFormState);

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const {name,value,type,checked} = e.target;
    setForm((prev)=>({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      //Attach Repoter ID
      const payload = { ...form, reporter_id: user?.id };

      // Encrypt data
      const encryptedPayload = await encryptReportData(payload);

      //Send to backend
      const res = await axios.post(
        "http://localhost:3004/api/v1/report/create",
        encryptedPayload,
        {
          withCredentials:true,
          headers:{"Content-Type":"multipart/form-data"},
        }
      );
      setMessage("Crime Report submitted successfully");
      setForm(initialFormState);
      console.log("Response",res.data);
    }catch(err){
      console.error(err);
      setMessage("Error Submitting Report");
    }
  }



  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold">Report a Crime</h2>
      {message && <p className="text-blue-600">{message}</p>}
      <input type="text" name="crime_type"  placeholder="Crime Type"  value={form.crime_type} onChange={handleChange} className="border p-2 w-full" required />

       <textarea name="description" placeholder="Description"
        value={form.description} onChange={handleChange}
        className="border p-2 w-full" required />

        <input type="datetime-local" name="incident_datetime"
        value={form.incident_datetime} onChange={handleChange}
        className="border p-2 w-full" required />

        <input type="text" name="location_text" placeholder="Location"
        value={form.location_text} onChange={handleChange}
        className="border p-2 w-full" required />

        {/* <input type="number" step="0.000001" name="latitude" placeholder="Latitude"
        value={form.latitude} onChange={handleChange}
        className="border p-2 w-full" />

         <input type="number" step="0.000001" name="longitude" placeholder="Longitude"
        value={form.longitude} onChange={handleChange}
        className="border p-2 w-full" /> */}

        {/* Map for the latitude and longitude values calculation */}
        <MapPicker form={form} setForm={setForm} />

        <select name="severity" value={form.severity} onChange={handleChange}
        className="border p-2 w-full">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_anonymous"
          checked={form.is_anonymous} onChange={handleChange} />
        Submit Anonymously
      </label>

      <button type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Report
      </button>
    </form>
  );
};

export default CrimeReportForm;
