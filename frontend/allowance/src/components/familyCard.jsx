import React from "react";
import "./familyCard.css"
import { getAuth } from "firebase/auth";
import axios from 'axios';

const FamilyCard = ({ familyMemberData, onDeleteSuccess }) => {
    const { memberName = "Unknown", memberUserType = "Unknown", imageUrl = "assets/placeholder.png", currentBalance = 0, memberRole = "Unknown" } = familyMemberData;

    const handleDelete = async () => {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId || !memberName) {
            alert("Missing required user information.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${memberName}?`)) {
            try {
                // Make DELETE request to the API
                const response = await axios.delete("http://localhost:5000/delete-profile", {
                    data: { name: memberName, userId: userId },
                });

                if (response.status === 200) {
                    alert("Profile deleted successfully.");
                    onDeleteSuccess(userId);
                }
            } catch (error) {
                console.error("Error deleting profile:", error.response || error);
                alert("Failed to delete profile. Please try again.");
            }
        }
    };

    return (
        <div className="familyCardContainer">
            <div className="imageContainer">
                <img src={imageUrl} alt={`${memberName}`} />
            </div>
            <div className="infoContainer">
                <div className="center">
                   <h3 className="memberName">{memberName}</h3> 
                </div>
                <div className="center">
                    <p className="memberRole">{memberUserType}</p>
                </div>
                
            </div>
            <div className="center delete-margin">
                <button className="main-button" onClick={handleDelete}>Delete</button>
            </div>
            
        </div>
    );
};

export default FamilyCard;