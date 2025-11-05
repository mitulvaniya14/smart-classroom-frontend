import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db as database } from "./firebase";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

// 🔹 Room List Component
function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const roomsRef = ref(database, "rooms");
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let roomList = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name || key.replace("_", " "),
          ...data[key],
        }));

        roomList.sort((a, b) => {
          if (a.name === "C-013") return -1;
          if (b.name === "C-013") return 1;
          return a.name.localeCompare(b.name);
        });

        setRooms(roomList);
      }
    });
    return () => unsubscribe();
  }, []);

  const getStatus = (room) => {
    if (room.faculty_present)
      return { text: "Lecture Ongoing", color: "bg-red-500" };
    if (room.count > 0) return { text: "Occupied", color: "bg-yellow-500" };
    return { text: "Free", color: "bg-green-500" };
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* HEADER NAVBAR */}
      <header className="w-full bg-gray-900/30 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo + Title */}
          <div className="flex items-center space-x-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1161/1161388.png"
              alt="logo"
              className="w-8 h-8 animate-pulse"
            />
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent glow-text">
              Shodh
            </h1>
            <p className="text-gray-400 text-sm hidden sm:block ml-1">
              Smart Classroom Finder
            </p>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 text-gray-300 text-sm">
            <a href="#about" className="hover:text-cyan-400 transition duration-200">
              About
            </a>
            <a href="#how" className="hover:text-cyan-400 transition duration-200">
              How It Works
            </a>
            <a href="#contact" className="hover:text-cyan-400 transition duration-200">
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-cyan-400 focus:outline-none"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-gray-900/90 text-center border-t border-gray-800 py-4 space-y-4 text-gray-300"
            >
              <a
                href="#about"
                onClick={toggleMenu}
                className="block hover:text-cyan-400"
              >
                About
              </a>
              <a
                href="#how"
                onClick={toggleMenu}
                className="block hover:text-cyan-400"
              >
                How It Works
              </a>
              <a
                href="#contact"
                onClick={toggleMenu}
                className="block hover:text-cyan-400"
              >
                Contact
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ROOM GRID */}
      <section id="rooms">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 py-12 place-items-center">
          {rooms.map((room) => {
            const status = getStatus(room);
            return (
              <motion.div
                key={room.id}
                whileHover={{ scale: 1.03 }}
                className="card-glow bg-gray-900/60 border border-gray-700 rounded-2xl p-6 w-80 shadow-lg backdrop-blur-md"
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
                  👥 {room.count || 0} occupants
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
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="px-6 py-16 text-center bg-gray-900/20 border-t border-gray-800">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-cyan-400 mb-4"
        >
          About Shodh
        </motion.h2>
        <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Shodh is a Smart Classroom Finder system that provides real-time information about
          classroom occupancy and faculty presence. Powered by IoT sensors, Firebase, and React,
          it enables students and administrators to monitor space availability efficiently.
        </p>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="px-6 py-16 text-center bg-gray-900/40 border-t border-gray-800">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-blue-400 mb-4"
        >
          How It Works
        </motion.h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-gray-300">
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h3 className="text-cyan-400 font-semibold mb-2">1️⃣ IoT Sensors</h3>
            <p>IR sensors and RFID modules detect occupancy and faculty presence in real-time.</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h3 className="text-cyan-400 font-semibold mb-2">2️⃣ Firebase Cloud</h3>
            <p>All sensor data is synced instantly with Firebase Realtime Database for global access.</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h3 className="text-cyan-400 font-semibold mb-2">3️⃣ Web Dashboard</h3>
            <p>Your Netlify-hosted React dashboard displays live classroom info anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="px-6 py-16 text-center bg-gray-900/60 border-t border-gray-800">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-indigo-400 mb-4"
        >
          Contact
        </motion.h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Have suggestions or want to collaborate? Reach out to the developer!
        </p>
        <div className="mt-6 flex justify-center space-x-6 text-cyan-400 text-2xl">
          <a href="mailto:mitulvaniya@gmail.com" className="hover:text-blue-400">
            📧
          </a>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-blue-400">
            💻
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="hover:text-blue-400">
            🔗
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-10 py-6 text-center text-gray-400 text-sm border-t border-gray-800 bg-gray-900/20 backdrop-blur-md">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-cyan-400 font-semibold">Shodh</span> · Smart
          Classroom Finder · Built by{" "}
          <span className="text-blue-400 font-medium">Mitul Vaniya</span>
        </p>
      </footer>
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
