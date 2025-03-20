import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";

const NotificationItem = ({ message, time, status }) => (
    <div
        className={`flex items-center justify-between p-4 rounded-lg shadow-lg ${
            status === "read" ? "bg-gray-800" : "bg-gray-900"
        } hover:bg-gray-700 transition-colors`}
    >
      <div className="flex items-center space-x-3">
        <div
            className={`w-14 h-12 rounded-full flex items-center justify-center ${
                status === "read" ? "bg-gray-300" : "bg-blue-500"
            }`}
        >
          {status === "read" ? (
              <CheckCircle size={14} className="text-white" />
          ) : (
              <Bell size={14} className="text-white" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{message}</h3>
        </div>
      </div>
      <div className="text-right">
        <span className="text-xs text-gray-500">{new Date(time).toLocaleString()}</span>
      </div>
    </div>
);

export default function TNotification() {
  // State to hold the fetched notifications
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetch notifications from the API
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      if (!token) {
        setError("Unauthorized: No token found.");
        return;
      }

      const response = await axios.get(
          "http://localhost:4000/api/v1/notifications/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );
      setNotifications(response.data.data);
    } catch (err) {
      setError("Failed to fetch notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter notifications based on the search query
  const filteredNotifications = notifications.filter(
      (notification) =>
          notification.message.toLowerCase().includes(searchQuery) ||
          notification.status.toLowerCase().includes(searchQuery)
  );

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <div className="container mx-auto max-w-4xl">
              {/* Page Title */}
              <div className="mb-6 p-4">
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-sm text-gray-300">
                  View and manage your notifications.
                </p>
              </div>

              {/* Search Bar */}
              {!loading && !error && (
                  <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <div className="relative">
                      <input
                          type="text"
                          placeholder="Search notifications..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-3 pl-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
              )}

              {/* Loading and Error States */}
              {loading && (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-3 text-white">Loading notifications...</p>
                  </div>
              )}

              {error && (
                  <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-center text-red-200 mb-6">
                    <AlertTriangle className="inline-block mr-2" size={20} />
                    {error}
                  </div>
              )}

              {/* Notifications List */}
              {!loading && !error && (
                  <div className="space-y-4">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification, index) => (
                            <NotificationItem
                                key={index}
                                message={notification.message}
                                time={notification.createdAt}
                                status={notification.status}
                            />
                        ))
                    ) : (
                        <div className="p-6 bg-gray-800 rounded-lg text-center">
                          <h3 className="text-white font-semibold">No Notifications Found</h3>
                          {searchQuery && (
                              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
                          )}
                        </div>
                    )}
                  </div>
              )}
            </div>
          </main>
        </div>
      </div>
  );
}
