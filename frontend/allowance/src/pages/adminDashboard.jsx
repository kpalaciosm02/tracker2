import React, { useEffect, useState } from "react";
import axios from "axios"
import AdminSidebar from "../components/adminSidebar";
import ChildList from "../components/childList";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";

const AdminDashboard = () => {
    const location = useLocation();
    
    const name = location.state?.name || "Unknown";
    const status = location.state?.status || "Unknown";
    const pictureUrl = location.state?.pictureUrl || "../../public/assets/placeholder.png";

    const currentProfile = {name:name,status:status,pictureUrl:pictureUrl};

    const [children, setChildren] = useState([]);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const auth = getAuth();
                const currentUserId = auth.currentUser?.uid;

                if (!currentUserId) {
                    console.error("User is not authenticated.");
                    return;
                }

                const response = await axios.get("http://localhost:5000/get-children", {
                    params: { userId: currentUserId },
                });

                const formattedChildren = response.data.map((child) => ({
                    childId: child.name,
                    name: child.name,
                    balance: child.currentBalance,
                    pictureUrl: child.pictureUrl || "./assets/placeholder.png",
                }));

                setChildren(formattedChildren);
            } catch (error) {
                console.error("Error fetching children:", error.response?.data || error.message);
            }
        };

        fetchChildren();
    }, []);

    return (
        <div style={{display:"flex"}}>
            <AdminSidebar currentProfile={currentProfile}/>
            <ChildList list={children} />
        </div>
    );
};

export default AdminDashboard;