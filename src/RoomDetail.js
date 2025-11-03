import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';

// Re-use the initialization from App.js
import { app } from './App'; 

const database = getDatabase(app);

// Logic to determine status colors/icons
const getStatusDetails = (room) => {
    let occupancyStatus = "Available";
    let statusColor = "#34C759"; // Green

    if (room.faculty_present === true) {
        occupancyStatus = "Formal Lecture";
        statusColor = "#FF3B30"; // Red
    } else if (room.count > 0) {
        occupancyStatus = "Student Occupancy";
        statusColor = "#FF9500"; // Orange
    }
    
    // Assume capacity is 60 for demonstration
    const availableSeats = 60 - room.count;
    const isFull = availableSeats <= 0;

    return { 
        occupancyStatus, 
        statusColor, 
        availableSeats,
        isFull
    };
};

function RoomDetail() {
    // Get the room ID from the URL (e.g., '/details/room_101')
    const { roomId } = useParams(); 
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (roomId) {
            const roomRef = ref(database, `rooms/${roomId}`);
            
            // Listen for changes on this specific room instantly
            const unsubscribe = onValue(roomRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Inject the room name if it's missing (for display)
                    setRoomData({ id: roomId, name: data.name || roomId.replace('_', ' '), ...data });
                }
                setLoading(false);
            });

            return () => unsubscribe(); // Cleanup the listener
        }
    }, [roomId]);

    if (loading) {
        return <div className="detail-loading">Loading Room Details...</div>;
    }

    if (!roomData) {
        return <div className="detail-error">Room Not Found.</div>;
    }

    const { occupancyStatus, statusColor, availableSeats, isFull } = getStatusDetails(roomData);

    return (
        <div className="detail-page-container">
            <Link to="/" className="back-button">← Back to List</Link>
            <div className="detail-card">
                <h2>{roomData.name}</h2>
                <div className="status-header" style={{ backgroundColor: statusColor }}>
                    {occupancyStatus}
                </div>
                
                <div className="metrics-grid">
                    <div className="metric-box">
                        <span className="metric-value">{roomData.count}</span>
                        <span className="metric-label">Current Occupants</span>
                    </div>
                    <div className="metric-box">
                        <span className="metric-value">60</span>
                        <span className="metric-label">Total Capacity</span>
                    </div>
                    <div className="metric-box" style={{ color: isFull ? 'red' : statusColor }}>
                        <span className="metric-value">{isFull ? 'FULL' : availableSeats}</span>
                        <span className="metric-label">Seats Available</span>
                    </div>
                </div>

                <div className="lecture-status">
                    <h3>Current Activity</h3>
                    <p>
                        {roomData.faculty_present ? 
                        `🔴 Official Lecture (${occupancyStatus}) is in progress.` : 
                        `🟢 Room is open for general study/next lecture.`}
                    </p>
                </div>
            </div>
            {/* Note: This component needs corresponding CSS in App.css */}
        </div>
    );
}

export default RoomDetail;