import React, { useState, useEffect } from "react";
import axios from "axios";
import ChildSidebar from "../components/childSidebar";
import TransactionCard from "../components/transactionCard";
import "./adminTransactionList.css";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Transaction from "../classes/Transaction"; // Import the Transaction class

const ChildTransactionList = () => {
    const location = useLocation();

    const name = location.state?.name || "Unknown";
    const status = location.state?.status || "Unknown";
    const pictureUrl = location.state?.pictureUrl || "../../public/assets/placeholder.png";

    const currentProfile = { name, status, pictureUrl };

    const [transactions, setTransactions] = useState([]);
    const [currentBalance, setCurrentBalance] = useState(null); // Store balance here
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        name: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        const fetchProfileAndTransactions = async () => {
            try {
                const auth = getAuth();
                const userId = auth.currentUser?.uid;

                if (!userId) {
                    setError("User is not authenticated.");
                    setIsLoading(false);
                    return;
                }

                // Fetch profile (balance)
                const profileResponse = await axios.get(
                    `http://localhost:5000/get-profile?userId=${userId}&name=${name}`
                );

                if (profileResponse.data.profile) {
                    setCurrentBalance(profileResponse.data.profile.currentBalance);
                } else {
                    setError("Profile not found");
                    setIsLoading(false);
                    return;
                }

                // Fetch transactions
                const transactionResponse = await axios.get(
                    `http://localhost:5000/get-child-transactions?userId=${userId}&childName=${name}`
                );

                const transactionsData = transactionResponse.data.transactions || [];

                // Map transactions to instances of the Transaction class
                const transactionInstances = transactionsData.map(
                    (t) =>
                        new Transaction(
                            t.amount,
                            t.childName,
                            t.reason,
                            t.timestamp,
                            t.type,
                            t.userId
                        )
                );

                setTransactions(transactionInstances);
                setIsLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || "Failed to fetch data.");
                setIsLoading(false);
            }
        };

        fetchProfileAndTransactions();
    }, [name]);

    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [id]: value,
        }));
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesStartDate =
            filters.startDate === "" || transaction.timestamp >= new Date(filters.startDate);
        const matchesEndDate =
            filters.endDate === "" || transaction.timestamp <= new Date(filters.endDate);
        return matchesStartDate && matchesEndDate;
    });

    return (
        <div style={{ display: "flex" }}>
            <ChildSidebar currentProfile={currentProfile} />
            <div>
                {isLoading ? (
                    <p>Loading data...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div>
                        {currentBalance !== null && (
                            <div>
                                <h3>Current Balance: ${currentBalance}</h3>
                            </div>
                        )}
                        {filteredTransactions.length === 0 ? (
                            <p>No transactions match the current filters.</p>
                        ) : (
                            filteredTransactions.map((transaction, index) => (
                                <TransactionCard
                                    key={index}
                                    transaction={{
                                        ...transaction,
                                        formattedTimestamp: transaction.getFormattedTimestamp(),
                                    }}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
            <div>
                <div className="input-group">
                    <label htmlFor="startDate">Start date:</label>
                    <input
                        type="date"
                        id="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="endDate">Final date:</label>
                    <input
                        type="date"
                        id="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChildTransactionList;
