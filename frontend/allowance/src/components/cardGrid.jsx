import React from "react";
import Card from "./card"; // Import the Card component
import './cardGrid.css'; // Import the grid styles

const CardGrid = ({ items }) => {
    return (
        <div className="card-grid">
            {items.map((item, index) => (
                <Card 
                    key={index} 
                    name={item.name} 
                    status={item.status} 
                    pictureUrl={item.pictureUrl} 
                    correctPin={item.pin}
                />
            ))}
        </div>
    );
};

export default CardGrid;
