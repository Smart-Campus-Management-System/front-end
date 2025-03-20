import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [userName, setUserName] = useState("");

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/profile/student", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserName(response.data.name);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Attendance Data
  const attendanceData = [2, 3, 4, 5, 3, 4, 5];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const chartData = {
    labels: days,
    datasets: [
      {
        label: "Attendance (Hours)",
        data: attendanceData,
        backgroundColor: "rgb(0, 255, 255)",
        borderColor: "rgb(0, 255, 255)",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Attendance Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Hours",
        },
      },
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
        <Sidebar />
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-700 to-richblue-800 text-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold">
            Welcome, {userName || "Student"}!
          </h2>
          <p className="mt-2">"Keep pushing forward—success is just around the corner!"</p>
        </div>

        {/* Attendance Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h3 className="text-xl font-bold mb-4">Attendance Graph</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold">Subjects Enrolled</h3>
            <p className="text-3xl font-bold text-green-400 mt-2">5</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold">Upcoming Schedule</h3>
            <p className="text-lg mt-2">Math Class - 10:00 AM</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold">Community Updates</h3>
            <p className="text-lg mt-2">3 new posts</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Notifications</h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <p>Math Quiz tomorrow at 9:00 AM</p>
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs">Urgent</span>
            </li>
            <li className="flex items-center justify-between">
              <p>New announcement in Community</p>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">New</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}