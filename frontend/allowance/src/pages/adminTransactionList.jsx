import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/adminSidebar";
import TransactionCard from "../components/transactionCard";
import "./adminTransactionList.css";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";

const AdminTransactionList = () => {
    const location = useLocation();

    const name = location.state?.name || "Unknown";
    const status = location.state?.status || "Unknown";
    const pictureUrl = location.state?.pictureUrl || "../../public/assets/placeholder.png";

    const currentProfile = { name, status, pictureUrl };

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        name: "",
        startDate: "",
        endDate: "",
    });

    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/get-user-transactions?userId=${userId}`
                );
                setTransactions(response.data.transactions || []);
                setIsLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || "Failed to fetch transactions.");
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [userId]);

    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [id]: value,
        }));
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesName = filters.name === "" || transaction.childName.toLowerCase().includes(filters.name.toLowerCase());
        const matchesStartDate = filters.startDate === "" || new Date(transaction.timestamp) >= new Date(filters.startDate);
        const matchesEndDate = filters.endDate === "" || new Date(transaction.timestamp) <= new Date(filters.endDate);

        return matchesName && matchesStartDate && matchesEndDate;
    });

    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar currentProfile={currentProfile} />

            <div style={{ flex: 1 }}>
                <h1>Transactions</h1>

                {isLoading ? (
                    <p>Loading transactions...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div style={{ display: "flex" }}>
                        <div>
                            {filteredTransactions.length === 0 ? (
                                <p>No transactions match the current filters.</p>
                            ) : (
                                filteredTransactions.map((transaction, index) => (
                                    <TransactionCard key={index} transaction={transaction} />
                                ))
                            )}
                        </div>
                        <div style={{ marginLeft: "20px" }}>
                            <h2>Filters</h2>
                            <div className="input-group">
                                <label htmlFor="name">Search by name:</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    id="name"
                                    value={filters.name}
                                    onChange={handleFilterChange}
                                />
                            </div>
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
                )}
            </div>
        </div>
    );
};


export default AdminTransactionList;
