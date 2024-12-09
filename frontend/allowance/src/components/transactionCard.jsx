import React from "react";
import "./transactionCard.css";

const TransactionCard = ({ transaction }) => {
    const { timestamp, reason, childName, amount, type } = transaction;

    return (
        <div className="transaction-card">
            <div className="transaction-header">
                <h3>{reason}</h3>
                <p>{new Date(timestamp).toLocaleDateString()}</p>
            </div>
            <div className="transaction-details">
                <p>
                    <strong>Child Name:</strong> {childName}
                </p>
                <p>
                    <strong>Type:</strong> {type}
                </p>
                <p>
                    <strong>Amount:</strong> ${amount.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default TransactionCard;
