import { Navigate,Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext";


const ProtectedRoute = () =>{
    const {user,loading} = useAuth();
    
    if(loading) return <div className="p-6 text-center">Checking session…</div>;
    if(!user) return <Navigate to="/login" replace/>

    return <Outlet/>;
};

export default ProtectedRoute;

