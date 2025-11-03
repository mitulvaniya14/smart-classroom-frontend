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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center text-white px-6">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          ← Back to List
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-900/60 border border-gray-700 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center"
      >
        <h2 className="text-3xl font-bold text-blue-400 mb-4">
          {room.name}
        </h2>

        <div
          className={`inline-block px-5 py-1.5 rounded-full text-sm font-semibold ${statusColor}`}
        >
          {room.faculty_present ? "Lecture in Progress" : "Available for Study"}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 text-gray-300">
          <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
            <p className="text-2xl font-bold text-white">{room.count || 0}</p>
            <p className="text-sm text-gray-400">Current Occupants</p>
          </div>
          <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
            <p className="text-2xl font-bold text-white">{room.capacity || 0}</p>
            <p className="text-sm text-gray-400">Total Capacity</p>
          </div>
          <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
            <p className="text-2xl font-bold text-green-400">
              {availableSeats}
            </p>
            <p className="text-sm text-gray-400">Seats Available</p>
          </div>
          <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700">
            <p className="text-lg font-semibold">
              {room.faculty_present ? "Formal Lecture" : "Open for Study"}
            </p>
            <p className="text-sm text-gray-400">Current Activity</p>
          </div>
        </div>

        <div className="mt-8 text-gray-400 text-sm italic">
          {room.faculty_present
            ? "📘 Official Lecture is ongoing in this classroom."
            : "🪑 Classroom is free — you may occupy it for self-study."}
        </div>
      </motion.div>
    </div>
  );
}
