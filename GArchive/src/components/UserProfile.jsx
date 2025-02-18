import React, { useState, useEffect } from 'react';
import './CSS/UserProfile.css';
import { User } from 'lucide-react';
import axios from 'axios';

const UserProfile = ({ setUserData, onLogOut }) => {  // Fix props destructuring
    const [newBio, setNewBio] = useState('');
    const [myBio, setMyBio] = useState('');
    const [editBio, setEditBio] = useState(false);
    const [message, setMessage] = useState('');  // Add message state

    // Use useEffect to fetch bio on component mount
    useEffect(() => {
        getUserBio();
    }, []);

    const getUserBio = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user_bio', {
                params: {
                    username: setUserData.username, 
                }
            });
            
            // Check if we have data and access the bio correctly
            if (response.data && response.data[0].bio) {
                setMyBio(response.data[0].bio);
                setNewBio(response.data[0].bio);
            } else {
                setMyBio('');  // Set default empty string if no bio exists
                setNewBio('');
            }
        } catch (error) {
            console.error('Error details:', error);  // Log the full error for debugging
            setMessage('Error fetching bio');
        }
    };

    const handleSendBio = async () => {
        try {
            console.log(newBio);
            console.log(setUserData.username);
            const response = await axios.post('http://localhost:5000/change-bio', {
                username: setUserData.username,
                bio: newBio,
            });
            getUserBio();  // Fetch updated bio
            setEditBio(!editBio);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error changing bio');
        }
    };

    const handleBio = () => {
        return (
            <div>
                <textarea 
                    placeholder="Tell us about yourself"
                    value={newBio}  // Use newBio instead of undefined bio
                    onChange={(e) => setNewBio(e.target.value)}
                    className="bio-input"
                />
                <button 
                    className="save-bio"
                    onClick={handleSendBio}  // Simplified onClick handler
                >
                    Save
                </button>
            </div>
        );
    };
    
    return (
        <div className="main-container"> {/* Fix class name don't adjust it's design cause it's in the App.jsx */ }
            <div className="main-user-content">
                <div className="user-profile">
                    <User size={64} />  {/* Fix size prop syntax */}
                    <h2 className='nickname'>{setUserData.nickname}</h2>
                    <h3 className='UID'>ID: {setUserData.id}</h3>
                    
                    {!editBio && <span className='bio'>{myBio}</span>}  {/* Show myBio instead of newBio */}
                    {editBio && handleBio()}
                    
                    {!editBio && (
                        <button 
                            className='edit-bio'
                            onClick={() => setEditBio(true)}
                        >
                            edit bio
                        </button>
                    )}
                    
                    {message && <div className="message">{message}</div>}
                </div>

                <div className="user-stats">
                    <div className='stats'>
                        <h4>Posts: {0}</h4>
                        <h4>Comments: {0}</h4>
                        <h4>Reactions: {0}</h4>
                        <h4>Followers: {0}</h4>
                        <h4>Following: {0}</h4>
                        <h4>Forums: {0}</h4>
                    </div>
                    <br />
                    <div className='tags'>
                        <span>Achievements: </span><br /> 
                        <h4>#Moderator</h4> <h4>#Thirsty</h4> <h4>#Gamer</h4> <h4>#Star</h4>
                    </div>
                </div>

                <button 
                    className='Log-out'
                    onClick={() =>{
                        onLogOut();
                    }}
                >Log out</button>
            </div>
        </div>
    );
};

export default UserProfile;