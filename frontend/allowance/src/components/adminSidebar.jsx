import React from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

const UserData = { name: "Alice", status: "Parent", pictureUrl: "./assets/placeholder.png" };

const AdminSidebar = () => {
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate("/adminDashboard");
    };

    const goToTransactionList = () => {
        navigate("/adminTransactionList");
    };

    const goToManageFamily = () => {
        navigate("/adminManageFamily");
    };

    const signOut = () => {
        navigate("/");
    }

    return (
        <div className="sidebar">
            <div className="userArea">
                <div className="center">
                    <img src={UserData.pictureUrl} alt="" />
                </div>
                <div className="center">
                    <h2>{UserData.name}</h2>
                </div>
                <div className="center">
                    <p>{UserData.status}</p>
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