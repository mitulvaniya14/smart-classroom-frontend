import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import './App.css'; 

// --- PASTE YOUR FIREBASE CONFIG HERE ---
// You MUST replace the content of this object with the code you copied from the Firebase console (the AIzaSy... keys).
const firebaseConfig = {
  apiKey: "AIzaSyDX8rjGOoUzYa6kXP-bkU0GMxM9kTRueC4",
  authDomain: "smart-classroom-finder-d7f1f.firebaseapp.com",
  databaseURL: "https://smart-classroom-finder-d7f1f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-classroom-finder-d7f1f",
  storageBucket: "smart-classroom-finder-d7f1f.firebasestorage.app",
  messagingSenderId: "848097026511",
  appId: "1:848097026511:web:b07f8b10f3589f152d72ba",
  measurementId: "G-VKW3XF1DNY"
};
// ------------------------------------

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to determine the displayed status based on sensor data
const getStatus = (room) => {
  if (room.faculty_present === true) {
    return { text: "Occupied for Lecture", color: "red" };
  }
  if (room.count > 0) {
    return { text: "Occupied (Students)", color: "orange" };
  }
  return { text: "FREE", color: "green" };
};

function App() {
  // State to hold all room data
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get a reference to the 'rooms' node in your database
    const roomsRef = ref(database, 'rooms');

    // 2. This is the REAL-TIME MAGIC (onValue)
    // When ANY data under 'rooms' changes, this function runs instantly.
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the Firebase object into an array for easy listing
        const roomList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setRooms(roomList);
      }
      setLoading(false);
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []); // Empty array means this runs only once when the app starts

  if (loading) {
    return <div className="loading">Loading Real-Time Status...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 Smart Campus Availability</h1>
      </header>
      <div className="room-list">
        {rooms.map(room => {
          const status = getStatus(room);
          return (
            <div key={room.id} className="room-card">
              <div className="room-name">{room.name || room.id.replace('_', ' ')}</div>
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
              
              {status.text !== "FREE" ? (
                <button className="check-seats-button" onClick={() => alert(`Room capacity is 60. Current occupants: ${room.count}`)}>
                  Check Seat Availability
                </button>
              ) : (
                <button className="free-button">Available Now</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;