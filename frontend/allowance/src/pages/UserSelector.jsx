import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";  // Import Firebase Auth
import CardGrid from "../components/cardGrid";
import Account from "../classes/Account";

const UserSelector = () => {
    const [userAccounts, setUserAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = getFirestore();
            const auth = getAuth();
            const currentUserId = auth.currentUser?.uid;

            if (!currentUserId) {
                console.error("No user is currently logged in");
                return;
            }

            const userQuery = query(collection(db, "users"), where("userId", "==", currentUserId));
            const querySnapshot = await getDocs(userQuery);

            const accounts = querySnapshot.docs.map((doc) => {
                // Log the data of each user document
                const userData = doc.data();
                console.log("Fetched user data:", userData);
        
                return new Account(
                    userData.name,
                    userData.pin,
                    userData.userId,
                    userData.userType,
                    userData.pictureUrl || "./assets/placeholder.png",
                    userData.pin // Make sure pin is passed into Account
                );
            });
            setUserAccounts(accounts.map((account) => account.getDisplayInfo()));
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Welcome to family members</h1>
            <CardGrid items={userAccounts} />
        </div>
    );
};

export default UserSelector;
