import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import "../style/profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);

    const { token } = useAuth();
    if (!token) return <h1 className="text-center d-flex justify-content-center align-items-center"  style={{"height" : "100vh"}}>Please Login</h1>


    const config = {
        headers: {
            Authorization: token
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/getUser', config);
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <>
            <div className="fullHt">
                <div className="user-profile">
                    <h2>User Profile</h2>
                    {user ? (
                        <div className="profile-info">
                            <div className="info-item">
                                <label>Username:</label>
                                <span>{user.username}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{user.email}</span>
                            </div>
                            {/* You can add more profile information here */}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>

            </div>
        </>

    );
};

export default Profile;
