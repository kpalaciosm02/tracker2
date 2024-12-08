import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';  // Ensure firebaseConfig is correctly set up
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignInClick = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //console.log('User signed in:', userCredential.user);
                navigate('/userSelector');
            })
            .catch((err) => {
                console.error('Error signing in:', err);
                alert('Invalid credentials. Please try again.');
            });
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div className="main-container">
            <h2>Login</h2>
            <form onSubmit={handleSignInClick}>

                <div className="text-input-container">
                    <label htmlFor="username">Email</label>
                    <input
                        type="email"
                        id="username"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="text-input-container">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="button-container">
                    <button type="submit" className="main-button">
                        Login
                    </button>
                    <button
                        type="button"
                        className="main-button"
                        onClick={handleSignUpClick}
                    >
                        Go to Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
