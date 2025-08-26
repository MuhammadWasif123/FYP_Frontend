import { useState } from "react";
import axios from "axios";
import { encryptReportData } from "../../utils/encrypt";
import { useAuth } from "../../context/AuthContext";

const CrimeReportForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    crime_type: "",
    description: "",
    incident_datetime: "",
    location_text: "",
    latitude: "",
    longitude: "",
    severity: "Low",
    is_anonymous: false,
  });

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
      


    }catch(err){

    }

  }



  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold">Report a Crime</h2>
      {message && <p className="text-blue-600">{message}</p>}





    </form>
  );
};

export default CrimeReportForm;
