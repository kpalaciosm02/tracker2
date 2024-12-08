import React from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

const AdminSidebar = ({ currentProfile }) => {
    const navigate = useNavigate();
    //console.log("User data in admin sidebar:", currentProfile);
    const goToDashboard = () => {
        navigate("/adminDashboard", { 
            state: { 
                name: currentProfile.name, 
                status: currentProfile.status, 
                pictureUrl: currentProfile.pictureUrl 
            } 
        });
    };

    const goToTransactionList = () => {
        navigate("/adminTransactionList", { 
            state: { 
                name: currentProfile.name, 
                status: currentProfile.status, 
                pictureUrl: currentProfile.pictureUrl 
            } 
        });
    };

    const goToManageFamily = () => {
        navigate("/adminManageFamily", { 
            state: { 
                name: currentProfile.name, 
                status: currentProfile.status, 
                pictureUrl: currentProfile.pictureUrl 
            } 
        });
    };

    const signOut = () => {
        navigate("/");
    }

    return (
        <div className="sidebar">
            <div className="userArea">
                <div className="center">
                    <img src={currentProfile.pictureUrl} alt="" />
                </div>
                <div className="center">
                    <h2>{currentProfile.name}</h2>
                </div>
                <div className="center">
                    <p>{currentProfile.status}</p>
                </div>
            </div>
            <ul>
                <li onClick={goToDashboard}>
                    <img src="./assets/dashboard.png" alt="" />
                    <p>Dashboard</p>
                </li>
                <li onClick={goToTransactionList}>
                    <img src="./assets/transaction.webp" alt="" />
                    <p>Transaction list</p>
                </li>
                <li onClick={goToManageFamily}>
                    <img src="./assets/family.png" alt="" />
                    <p>Manage family</p>
                </li>
            </ul>
            <button className="main-button" onClick={signOut}>Sign Out</button>
        </div>
    );
};

export default AdminSidebar;