import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ReportsTable from "../components/UserDashboard/ReportsTable";
import ReportModal from "../components/UserDashboard/ReportModal"

const UserDashboard = () => {
  const { user, setUser } = useAuth();
  const [reports, setReports ] = useState([]);
  const [loading, setLoading] = useState(false);


  console.log("This is the user getting",user);
// States for a Single Report Fetch
const [selectedReport,setSelectedReport] =useState(null);
const [detailLoading,setDetailLoading]=useState(false);
const [detailError,setDetailError]=useState("");

 // fetch all reports
  const fetchReports = async () => {
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:3004/api/v1/report/all", {
        withCredentials: true,
      });
      setReports(res.data?.reports || []);
      console.log(res.data?.reports)
    } catch (err) {
      const status = err?.response?.status;
      setReports([]);
      // If token expired or invalid, optionally clear user and force re-login
      if (status === 401) {
        setUser(null);
      }
    } finally{
        setLoading(false);
    }
  };

//   Fetching Single Report by ID
const fetchReportById= async(id) =>{
    setDetailLoading(true);
    setDetailError("");
    try{
        const res = await axios.get(`http://localhost:3004/api/v1/report/${id}`,{
            withCredentials:true
        });
        setSelectedReport(res.data?.report || null);
    }catch(err){
        const status= err?.response?.status;
        const serverMsg= err?.response?.data?.message || "Failed to load report.";
        setDetailError(serverMsg);
        setSelectedReport(null);
        if(status === 401) setUser(null);
    } finally{
        setDetailLoading(false);
    }
};

  useEffect(()=>{
    if(user) fetchReports();
  }, [user]); 


  const handleRowClick = (r)=>{
    fetchReportById(r.id);
  }

  return (
    <>
    <div>
     <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mx-2">Your Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchReports}
            disabled={loading}
            className="bg-[#2b303a] text-white px-4 py-2 rounded disabled:opacity-60 my-4 mx-2 cursor-pointer"
          >
            {loading ? "Loading…" : "See all reports"}
          </button>
        </div>
      </div>

      <ReportsTable reports={reports} onRowClick= {handleRowClick}  />

      {/* Show Modal when selectedReport is set */}
      {selectedReport && (
        <ReportModal report={selectedReport} loading={detailLoading} error={detailError} onClose={()=>setSelectedReport(null)} />
      )}

    </div>
    </>
  );
};

export default UserDashboard;
