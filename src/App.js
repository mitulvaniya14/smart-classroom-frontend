import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
// NEW IMPORTS FOR ROUTING
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import './App.css';
import RoomDetail from './RoomDetail'; // Import the new page

// --- PASTE YOUR FIREBASE CONFIG HERE ---
// You must ensure this object is correctly filled with your keys!
const firebaseConfig = {
    // Your actual keys here
};
// ------------------------------------

export const app = initializeApp(firebaseConfig); // Exporting app for RoomDetail.js to use
const database = getDatabase(app);

// Main Component: Displays the List of Rooms
function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const roomsRef = ref(database, 'rooms');
        const unsubscribe = onValue(roomsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const roomList = Object.keys(data).map(key => ({
                    id: key,
                    name: data[key].name || key.replace('_', ' '),
                    ...data[key]
                }));
                setRooms(roomList);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getStatus = (room) => {
        if (room.faculty_present === true) return { text: "Occupied for Lecture", color: "red" };
        if (room.count > 0) return { text: "Occupied (Students)", color: "orange" };
        return { text: "FREE", color: "green" };
    };

    if (loading) return <div className="loading">Loading Real-Time Status...</div>;

    return (
        <div className="room-list">
            {rooms.map(room => {
                const status = getStatus(room);
                return (
                    <div key={room.id} className="room-card">
                        <div className="room-name">{room.name}</div>
                        <div className="room-details">
                            <div className="status-indicator" style={{ backgroundColor: status.color }}>
                                {status.text}
                            </div>
                            <div className="occupancy">
                                <span className="count-number">{room.count}</span>
                                <span className="count-label">Occupants</span>
                            </div>
                        </div>
                        <div className="availability-info">
                            {room.faculty_present ? "Official Lecture In Progress" : "Available for Study/Next Lecture"}
                        </div>
                        {/* THE NEW BUTTON LINK */}
                        <Link to={`/details/${room.id}`}>
                            <button className="check-seats-button">Check Seat Availability</button>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}

// Root Component: Handles Routing
function App() {
    return (
        <Router>
            <header className="App-header">
                <h1>🎓 Smart Campus Availability</h1>
            </header>
            <Routes>
                {/* Route for the main list page */}
                <Route path="/" element={<RoomList />} /> 
                {/* Route for the detailed room page */}
                <Route path="/details/:roomId" element={<RoomDetail />} /> 
            </Routes>
        </Router>
    );
}

export default App;