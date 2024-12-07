import React from "react";
import "./transactionCard.css";

const TransactionCard = ({ transaction }) => {
    const { transactionDate, transactionDescription, transactionSender, transactionReceiver, amount } = transaction;

    return (
        <div className="transaction-card">
            <div className="transaction-header">
                <h3>{transactionDescription}</h3>
                <p>{new Date(transactionDate).toLocaleDateString()}</p>
            </div>
            <div className="transaction-details">
                <p>
                    <strong>Sender:</strong> {transactionSender}
                </p>
                <p>
                    <strong>Receiver:</strong> {transactionReceiver}
                </p>
                <p>
                    <strong>Amount:</strong> ${amount.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default TransactionCard;
