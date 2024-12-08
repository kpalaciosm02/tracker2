import React from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";

const ChildSidebar = ({currentProfile}) => {
    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate("/childTransactionList", { 
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
                    <img src="./assets/transaction.webp" alt="" />
                    <p>Transaction List</p>
                </li>
            </ul>
            <button className="main-button" onClick={signOut}>Sign Out</button>
        </div>
    );
};

export default ChildSidebar;