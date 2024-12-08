import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './Login.css';

function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirmation: '',
        name: '', // Changed from parentName to name
        pin: '', // Changed from parentPin to pin
        pinConfirmation: '' // Changed from parentPinConfirmation to pinConfirmation
    });

    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { username, password, passwordConfirmation, name, pin, pinConfirmation } = formData;

        // Validation checks
        if (!username || !password || !passwordConfirmation || !name || !pin || !pinConfirmation) {
            alert('Please fill in all required fields.');
            return;
        }

        if (password !== passwordConfirmation) {
            alert('Passwords do not match.');
            return;
        }

        if (pin !== pinConfirmation) {
            alert('Pins do not match.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            const userId = userCredential.user.uid;

            await addDoc(collection(db, 'profile'), {
                userId,
                userType: 'Parent',
                name,
                pin,
                currentBalance: 0,
                pictureUrl: "./assets/placeholder.png",
            });

            navigate('/');
        } catch (err) {
            console.error('Sign-up error:', err);
            if (err.code === 'auth/email-already-in-use') {
                alert('This email is already in use.');
            } else if (err.code === 'auth/weak-password') {
                alert('Password should be at least 6 characters long.');
            } else {
                alert('Sign-up failed. Please try again.');
            }
        }
    };

    return (
        <div className="main-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                {error && <p className="error-message">{error}</p>}

                <div className="text-input-container">
                    <label htmlFor="username">Family account</label>
                    <input 
                        type="email" 
                        id="username" 
                        placeholder="Enter your family account email"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="text-input-container">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="text-input-container">
                    <label htmlFor="passwordConfirmation">Password Confirmation</label>
                    <input 
                        type="password" 
                        id="passwordConfirmation" 
                        placeholder="Confirm your password"
                        value={formData.passwordConfirmation}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="text-input-container">
                    <label htmlFor="name">Enter your name</label>
                    <input 
                        type="text" 
                        id="name" 
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="text-input-container">
                    <label htmlFor="pin">Enter your pin</label>
                    <input 
                        type="password" 
                        id="pin" 
                        placeholder="Enter your pin"
                        value={formData.pin}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="text-input-container">
                    <label htmlFor="pinConfirmation">Confirm your pin</label>
                    <input 
                        type="password" 
                        id="pinConfirmation" 
                        placeholder="Confirm your pin"
                        value={formData.pinConfirmation}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="button-container">
                    <button type="submit" className="main-button">
                        Sign Up
                    </button>
                    <button 
                        type="button" 
                        className="main-button"
                        onClick={() => navigate('/')}
                    >
                        Go to Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;