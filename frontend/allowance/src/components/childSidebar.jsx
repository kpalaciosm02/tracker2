import React from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

const UserData = { name: "Michael", status: "Child", pictureUrl: "./assets/placeholder.png" };

const ChildSidebar = () => {
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate("/childTransactionList");
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
                    <img src="./assets/transaction.webp" alt="" />
                    <p>Transaction List</p>
                </li>
            </ul>
            <button className="main-button" onClick={signOut}>Sign Out</button>
        </div>
    );
};

export default ChildSidebar;