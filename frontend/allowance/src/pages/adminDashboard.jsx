import React from "react";
import AdminSidebar from "../components/adminSidebar";
import ChildList from "../components/childList";
import { useLocation } from "react-router-dom";


const AdminDashboard = () => {
    const location = useLocation();

    //console.log("Full location state:", location.state);
    //console.log("Typeof location.state:", typeof location.state);
    
    const name = location.state?.name || "Unknown";
    const status = location.state?.status || "Unknown";
    const pictureUrl = location.state?.pictureUrl || "../../public/assets/placeholder.png";

    const currentProfile = {name:name,status:status,pictureUrl:pictureUrl};

    //console.log("Current profile:", currentProfile);

    const children = [
        { name: "Maria", childId: 1, pictureUrl: "./assets/placeholder.png", balance: 100.00 },
        { name: "Bob", childId: 2, pictureUrl: "./assets/placeholder.png", balance: 100.00 },
        { name: "Charlie", childId: 3, pictureUrl: "./assets/placeholder.png", balance: 100.00 },
        { name: "Diana", childId: 4, pictureUrl: "./assets/placeholder.png", balance: 100.00 },
    ]
    return (
        <div style={{display:"flex"}}>
            <AdminSidebar currentProfile={currentProfile}/>
            <ChildList list={children} />
        </div>
    );
};

export default AdminDashboard;