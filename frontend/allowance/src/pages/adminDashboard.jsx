import React from "react";
import AdminSidebar from "../components/adminSidebar";
import ChildList from "../components/childList";


const AdminDashboard = () => {
    
    const children = [
        { name: "Maria", childId: 1, pictureUrl: "./assets/placeholder.png", balance: 100.00 },
        { name: "Bob", childId: 2, pictureUrl: "./assets/placeholder.png", balance: 100.00 },
        { name: "Charlie", childId: 3, pictureUrl: "./assets/placeholder.png", balance: 100.00 },
        { name: "Diana", childId: 4, pictureUrl: "./assets/placeholder.png", balance: 100.00 },
    ]
    return (
        <div style={{display:"flex"}}>
            <AdminSidebar/>
            <ChildList list={children} />
        </div>
    );
};

export default AdminDashboard;