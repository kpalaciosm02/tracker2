import React from "react";
import ChildSidebar from "../components/childSidebar";
import TransactionCard from "../components/transactionCard";
import "./adminTransactionList.css"

const ChildTransactionList = () => {
    const transactions = [
        {
            transactionDate: "2024-11-20T10:15:00Z",
            transactionDescription: "Toy purchase",
            transactionSender: "Michael",
            transactionReceiver: "Fresh Mart",
            amount: 75.5,
        },
        {
            transactionDate: "2024-11-21T14:30:00Z",
            transactionDescription: "Allowance",
            transactionSender: "Tech Corp",
            transactionReceiver: "Michael",
            amount: 3000.0,
        },
        {
            transactionDate: "2024-11-22T08:45:00Z",
            transactionDescription: "Football game",
            transactionSender: "XYZ Agency",
            transactionReceiver: "Michael",
            amount: 450.75,
        },
    ];
    return (
        <div style={{display:"flex"}}>
            <ChildSidebar/>
            <div>
                {transactions.map((transaction, index) => (
                    <TransactionCard key={index} transaction={transaction} />
                ))}
            </div>
            <div>
                <div className="input-group">
                    <label htmlFor="name-input">Search by name:</label>
                    <input type="text" placeholder="Name" id="name-input"/>
                </div>
                <div className="input-group">
                    <label htmlFor="start-date-input">Start date:</label>
                    <input type="date" placeholder="Start date" id="start-date-input"/>
                </div>
                <div className="input-group">
                    <label htmlFor="end-date-input">Final date:</label>
                    <input type="date" placeholder="End date" id="end-date-input"/>
                </div>
                <button className="main-button">Search</button>
                <p>Current balance: 200$</p>
            </div>
        </div>
        
    );
};

export default ChildTransactionList;