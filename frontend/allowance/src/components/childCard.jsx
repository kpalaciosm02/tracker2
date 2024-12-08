import React, { useState } from "react";
import axios from "axios";
import "./childCard.css";
import { getAuth } from "firebase/auth";

const ChildCard = ({ childData }) => {
    const [modal, setModal] = useState(false);
    const [actionType, setActionType] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState(""); // State to hold the transaction reason
    const [balance, setBalance] = useState(childData.balance);

    // Toggle modal visibility
    const toggleModal = (type = "") => {
        setActionType(type);
        setModal(!modal);
        setAmount("");
        setReason("");
    };

    const handleTransaction = async () => {
        const auth = getAuth();
        const currentUserId = auth.currentUser?.uid;

        if (!currentUserId) {
            console.error("User is not authenticated.");
            return;
        }
        const parsedAmount = parseFloat(amount.trim());

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        if (actionType !== "deposit" && actionType !== "withdraw") {
            alert("Invalid action type");
            return;
        }

        try {
            const endpoint =
                actionType === "deposit"
                    ? "http://localhost:5000/deposit"
                    : "http://localhost:5000/withdraw";

            const response = await axios.post(endpoint, {
                userId: currentUserId,
                childName: childData.name,
                amount: parsedAmount,
                reason: reason.trim(),
            });

            setBalance(response.data.newBalance);
            alert(
                `${actionType === "deposit" ? "Deposit" : "Withdrawal"} successful!`
            );

            toggleModal();
        } catch (error) {
            console.error(
                `Error while processing the ${actionType}:`,
                error
            );
            alert(
                error.response?.data?.error ||
                "An error occurred while processing the transaction"
            );
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
                    <button
                        className="main-button"
                        onClick={() => toggleModal("deposit")}
                    >
                        Deposit
                    </button>
                    <button
                        className="main-button"
                        onClick={() => toggleModal("withdraw")}
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            {modal && (
                <div className="modal">
                    <div onClick={() => toggleModal()} className="overlay"></div>
                    <div className="modal-content">
                        <h2>
                            {actionType === "deposit"
                                ? "Make a Deposit"
                                : "Make a Withdrawal"}
                        </h2>
                        <p>
                            {actionType === "deposit"
                                ? "Enter the amount to deposit into your child's account."
                                : "Enter the amount to withdraw from your child's account."}
                        </p>

                        <textarea
                            rows="4"
                            columns="120"
                            placeholder="Enter the reason for the transaction"
                            className="description"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        ></textarea>

                        <div className="input-container">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                                }
                                placeholder="Enter amount"
                            />
                            <button
                                onClick={handleTransaction}
                                className="main-button"
                            >
                                {actionType === "deposit"
                                    ? "Deposit"
                                    : "Withdraw"}
                            </button>
                        </div>

                        <button
                            className="close-modal"
                            onClick={() => toggleModal()}
                        >
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChildCard;
