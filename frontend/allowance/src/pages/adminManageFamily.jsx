import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import axios from 'axios';
import FamilyCard from "../components/familyCard";
import AdminSidebar from "../components/adminSidebar";
import "./adminManageFamily.css";

const AdminManageFamily = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pin, setPin] = useState(""); 
    const [familyMembers, setFamilyMembers] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState("");
    const [userType, setUserType] = useState("Parent");
    const [imageUrl, setImageUrl] = useState("");

    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const location = useLocation();
    const currentProfileName = location.state?.name || "Unknown";
    const status = location.state?.status || "Unknown";
    const pictureUrl = location.state?.pictureUrl || "../../public/assets/placeholder.png";

    const currentProfile = {name:currentProfileName,status:status,pictureUrl:pictureUrl};

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                console.log('Fetching for userId:', userId);
    
                const response = await axios.get(`http://localhost:5000/get-user`, {
                    params: { userId: userId }
                });
                
                //console.log('Full API Response:', response.data);
    
                const userData = response.data[0];
                setUserData(userData);
    
                const allFamilyMembers = response.data.map(member => ({
                    id: member.userId,
                    memberName: member.name,
                    memberUserType: member.userType,
                    imageUrl: member.imageUrl || "assets/placeholder.png",
                    currentBalance: member.currentBalance
                }));
    
                setFamilyMembers(allFamilyMembers);
            } catch (error) {
                console.error('Fetch error:', error.response || error);
                setError("Failed to load user data.");
                setFamilyMembers([]);
            } finally {
                setLoading(false);
            }
        };
    
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handlePinChange = (e) => {
        const numericValue = e.target.value.replace(/\D/g, "");
        setPin(numericValue);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        
        try {
            const newMember = {
                name,
                userType,
                imageUrl,
                pin,
                userId,
                balance: 0,
            };
            console.log("Payload being sent to API:", newMember);
            const response = await axios.post("http://localhost:5000/add-profile", newMember);
            console.log("Response from server:", response.data);
    
            setFamilyMembers((prev) => [...prev, newMember]);
    
            setName("");
            setUserType("Parent");
            setImageUrl("");
            setPin("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding member:", error.response || error);
            setError("Failed to add member.");
        }
    };

    const handleDeleteSuccess = (deletedUserId) => {
        setFamilyMembers((prev) =>
            prev.filter((member) => member.userId !== deletedUserId)
        );
    };

    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar currentProfile={currentProfile}/>
            <div>
                <div className="manage-family-header">
                    <button className="main-button" onClick={toggleModal}>Add member</button>
                </div>
                <div className="manage-family-content">
                    {loading && <p>Loading user data...</p>}
                    {error && <p>{error}</p>}
                    {familyMembers.length === 0 && !loading && !error && (
                        <p>No family members found.</p>
                    )}
                    {familyMembers.map((member, index) => (
                        <FamilyCard 
                            key={member.id || index} 
                            familyMemberData={member}
                            onDeleteSuccess={handleDeleteSuccess}
                        />
                    ))}
                </div>
                {isModalOpen && (
                    <div className="modal">
                        <div className="overlay" onClick={toggleModal}></div>
                        <div className="modal-content">
                            <h2>Add Family Member</h2>
                            <form onSubmit={handleAddMember}>
                                <label>
                                    Name:
                                    <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/>
                                </label>
                                <label>
                                    User Type: {}
                                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                                        <option value="Parent">Parent</option>
                                        <option value="Child">Child</option>
                                    </select>
                                </label>
                                <label>
                                    Image URL:
                                    <input type="text" placeholder="Enter image URL"  value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}/>
                                </label>
                                <label>
                                    PIN for this family member:
                                    <input
                                        type="password"
                                        placeholder="Enter PIN"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        value={pin}
                                        onChange={handlePinChange}
                                    />
                                </label>
                                <button type="submit" className="main-button">Add Member</button>
                            </form>
                            <button className="close-modal" onClick={toggleModal}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminManageFamily;
