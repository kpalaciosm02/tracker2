import React from "react";
import "./familyCard.css"

const FamilyCard = ({ familyMemberData }) => {
    const { memberName, memberRole, imageUrl } = familyMemberData;

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
                    <p className="memberRole">{memberRole}</p>
                </div>
                
            </div>
            <div className="center delete-margin">
                <button className="main-button">Delete</button>
            </div>
            
        </div>
    );
};

export default FamilyCard;