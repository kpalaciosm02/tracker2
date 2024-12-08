import React, { useState } from "react";
import './card.css';
import { useNavigate } from "react-router-dom";

const Card = ({ name, status, pictureUrl, correctPin }) => {
    const [isPinVisible, setIsPinVisible] = useState(false);
    const [pin, setPin] = useState("");
    const navigate = useNavigate();

    const handleCardClick = () => {
        setIsPinVisible(true);
    };

    const handlePinChange = (e) => {
        const numericValue = e.target.value.replace(/\D/g, "");
        setPin(numericValue);
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (pin === correctPin) {
            setIsPinVisible(false);
            if (status === 'Parent') {
                navigate('/adminDashboard', { 
                    state: { 
                        name: name, 
                        status: status, 
                        pictureUrl: pictureUrl 
                    } 
                });
            } else {
                navigate('/childTransactionList', { 
                    state: { 
                        name: name, 
                        status: status, 
                        pictureUrl: pictureUrl 
                    } 
                });
            }
        } else {
            alert("Incorrect PIN!");
        }
    };

    return (
        <div className="card" onClick={handleCardClick}>
            <div className="center-card">
                <img src={pictureUrl} alt="" />
            </div>
            <div className="center-card">
                <h2>{name}</h2>
            </div>
            <div className="center-card">
                <p>{status}</p>
            </div>
            {isPinVisible && (
                <div className="pin-container">
                    <form onSubmit={handlePinSubmit}>
                        <input
                            type="password"
                            value={pin}
                            onChange={handlePinChange}
                            placeholder="Enter PIN"
                            inputMode="numeric"
                            pattern="\d*"
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Card;
