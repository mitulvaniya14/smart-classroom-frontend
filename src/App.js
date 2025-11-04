import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db as database } from "./firebase";
import { motion } from "framer-motion";
import "./App.css";

// 🔹 Room List Component
function RoomList() {
  const [rooms, setRooms] = useState([]);

useEffect(() => {
        const roomsRef = ref(database, 'rooms');
        const unsubscribe = onValue(roomsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert the Firebase object into an array
                let roomList = Object.keys(data).map(key => ({
                    id: key,
                    name: data[key].name || key.replace('_', ' '), // This line creates the name
                    ...data[key]
                }));

                // --- UPDATED CUSTOM SORTING LOGIC ---
                // We now sort by the 'name' field, not the 'id'
                roomList.sort((a, b) => {
                    // Rule 1: If 'a' is C-013, move it to the front
                    if (a.name === 'C-013') return -1; 
                    // Rule 2: If 'b' is C-013, move it to the back
                    if (b.name === 'C-013') return 1;

                    // Rule 3: Sort all other rooms by name
                    return a.name.localeCompare(b.name);
                });
                // --- END UPDATED LOGIC ---

                setRooms(roomList); // Set the new, sorted list
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []); // Empty array means this runs only once
    
  const getStatus = (room) => {
    if (room.faculty_present)
      return { text: "Lecture Ongoing", color: "bg-red-500" };
    if (room.count > 0) return { text: "Occupied", color: "bg-yellow-500" };
    return { text: "Free", color: "bg-green-500" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <header className="text-center py-6 text-3xl font-bold text-blue-400">
        🔍 Shodh - Classroom Finder
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 place-items-center">
        {rooms.map((room) => {
          const status = getStatus(room);
          return (
            <motion.div
              key={room.id}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6 w-80 shadow-lg backdrop-blur-md"
            >
              <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
              >
                {status.text}
              </div>
              <div className="mt-4 text-gray-300">
                {room.faculty_present
                  ? "Lecture in progress"
                  : "Available for students"}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                👥 {room.count} occupants
              </div>

              <Link to={`/details/${room.id}`}>
                <button className="w-full mt-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 rounded-xl hover:opacity-90">
                  Check Seat Availability
                </button>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// 🔹 Room Details Page
function RoomDetail() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      setRoom(snapshot.val());
    });
    return () => unsubscribe();
  }, [roomId]);

  if (!room)
    return (
      <div className="text-white text-center mt-20">Loading details...</div>
    );

  const availableSeats = (room.capacity || 0) - (room.count || 0);
  const statusColor = room.faculty_present ? "bg-red-500" : "bg-green-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex flex-col items-center p-8">
      <Link
        to="/"
        className="text-blue-400 hover:text-blue-300 mb-6 text-sm self-start"
      >
        ← Back to List
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/70 p-8 rounded-2xl border border-gray-700 shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4">{room.name}</h2>
        <div
          className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${statusColor}`}
        >
          {room.faculty_present ? "Lecture in Progress" : "Available"}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-gray-300">
          <div>
            <p className="text-lg font-semibold">{room.count || 0}</p>
            <p className="text-sm text-gray-400">Current Occupants</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{room.capacity || 0}</p>
            <p className="text-sm text-gray-400">Total Capacity</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-green-400">
              {availableSeats}
            </p>
            <p className="text-sm text-gray-400">Seats Available</p>
          </div>
          <div>
            <p className="text-lg font-semibold">
              {room.faculty_present ? "Formal Lecture" : "Open for Study"}
            </p>
            <p className="text-sm text-gray-400">Current Activity</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// 🔹 Root App
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomList />} />
        <Route path="/details/:roomId" element={<RoomDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
