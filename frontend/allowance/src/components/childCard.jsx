import React, { useState } from "react";
import "./childCard.css";

const ChildCard = ({ childData }) => {
    const [modal, setModal] = useState(false);
    const [actionType, setActionType] = useState(""); // "deposit" or "withdraw"
    const [amount, setAmount] = useState("");
    const [balance, setBalance] = useState(childData.balance);

    const toggleModal = (type = "") => {
        setActionType(type);
        setModal(!modal);
        setAmount("");
    };

    const handleTransaction = () => {
        const parsedAmount = parseFloat(amount.trim());
        if (!isNaN(parsedAmount) && parsedAmount > 0) {
            if (actionType === "deposit") {
                setBalance(balance + parsedAmount);
            } else if (actionType === "withdraw") {
                if (parsedAmount <= balance) {
                    setBalance(balance - parsedAmount);
                } else {
                    alert("Insufficient balance");
                    return;
                }
            }
            toggleModal(); // Close the modal
        } else {
            alert("Please enter a valid amount");
        }
    };

    return (
        <div className="childCard parallelContainer">
            <div className="imgContainer">
                <img src={childData.pictureUrl} alt="" />
            </div>
            <div className="dataContainer">
                <p className="name">{childData.name}</p>
                <p className="balance">{balance.toFixed(2)} $</p>
                <div className="parallelContainer">
                    <button className="main-button" onClick={() => toggleModal("deposit")}>
                        Deposit
                    </button>
                    <button className="main-button" onClick={() => toggleModal("withdraw")}>
                        Withdraw
                    </button>
                </div>
            </div>

            {modal && (
                <div className="modal">
                    <div onClick={() => toggleModal()} className="overlay"></div>
                    <div className="modal-content">
                        <h2>{actionType === "deposit" ? "Make a Deposit" : "Make a Withdrawal"}</h2>
                        <p>
                            {actionType === "deposit"
                                ? "Enter the amount to deposit into your child's account."
                                : "Enter the amount to withdraw from your child's account."}
                        </p>

                        <textarea rows="4" columns="120" placeholder="Enter the reason for the transaction" className="description"></textarea>

                        <div className="input-container">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                                placeholder="Enter amount"
                            />
                            <button onClick={handleTransaction} className="main-button">
                                {actionType === "deposit" ? "Deposit" : "Withdraw"}
                            </button>
                        </div>

                        <button className="close-modal" onClick={() => toggleModal()}>
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChildCard;
