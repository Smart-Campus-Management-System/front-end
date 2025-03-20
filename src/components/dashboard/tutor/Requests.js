import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomLink, setZoomLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:4000/api/v1/classes/class-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const requestsWithCourses = await Promise.all(
          response.data.classRequests.map(async (req) => {
            // Fetch course name for each course ID
            const courseResponse = await axios.get(
                `http://localhost:4000/api/v1/courses/${req.course._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
            );
            const courseName = courseResponse.data.data.courseName || "Unknown Course";
            return {
              id: req._id,
              student: req.student.email,
              topic: courseName,
              date: new Date(req.time).toLocaleDateString(),
              time: new Date(req.time).toLocaleTimeString(),
              status: req.status,
              isNew: req.status === "Pending",
            };
          })
      );

      setRequests(requestsWithCourses);
      setFilteredRequests(requestsWithCourses);
    } catch (err) {
      setError("Failed to fetch class requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter requests based on student email or topic
    setFilteredRequests(
        requests.filter(
            (req) =>
                req.student.toLowerCase().includes(query) ||
                req.topic.toLowerCase().includes(query)
        )
    );
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
          `http://localhost:4000/api/v1/classes/handle-request/${id}`,
          { status: action },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setRequests((prevRequests) =>
          prevRequests.map((req) =>
              req.id === id ? { ...req, status: action, isNew: false } : req
          )
      );
      setFilteredRequests((prevRequests) =>
          prevRequests.map((req) =>
              req.id === id ? { ...req, status: action, isNew: false } : req
          )
      );
    } catch (err) {
      alert("Failed to update request status. Please try again.");
    }
  };

  return (
      <div className="bg-gray-100 flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Requests</h1>

          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}

          {!loading && !error && (
              <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md text-black">
                {/* Search Bar */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Requests</label>
                  <input
                      type="text"
                      placeholder="Search by student or topic..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {filteredRequests.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No requests available.</p>
                ) : (
                    <ul className="space-y-4">
                      {filteredRequests.map((request) => (
                          <li
                              key={request.id}
                              className={`border rounded-lg p-4 ${
                                  request.isNew
                                      ? "bg-yellow-50 border-yellow-300"
                                      : "border-gray-200"
                              }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <p className="text-gray-800 font-semibold">{request.student}</p>
                                <p className="text-gray-600 text-sm">
                                  Topic: {request.topic} | Date: {request.date}
                                  {request.status === "Accepted" && (
                                      <> | Scheduled Time: {request.time}</>
                                  )}
                                </p>
                                <p
                                    className={`mt-1 text-sm font-medium ${
                                        request.status === "Accepted"
                                            ? "text-green-600"
                                            : request.status === "Declined"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                    }`}
                                >
                                  Status: {request.status}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedRequest(request)}
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                >
                                  View Request
                                </button>
                                {request.status === "Accepted" && (
                                    <button
                                        onClick={() => setShowZoomModal(true)}
                                        className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
                                    >
                                      Add Zoom Link
                                    </button>
                                )}
                                {request.status === "Pending" && (
                                    <>
                                      <button
                                          onClick={() => handleAction(request.id, "Accepted")}
                                          className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                                      >
                                        Accept
                                      </button>
                                      <button
                                          onClick={() => handleAction(request.id, "Declined")}
                                          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                                      >
                                        Decline
                                      </button>
                                    </>
                                )}
                              </div>
                            </div>
                          </li>
                      ))}
                    </ul>
                )}
              </div>
          )}
        </div>

        {/* View Request Modal */}
        {selectedRequest && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Details</h2>
                <p className="mb-2">
                  <strong>Student:</strong> {selectedRequest.student}
                </p>
                <p className="mb-2">
                  <strong>Topic:</strong> {selectedRequest.topic}
                </p>
                <p className="mb-2">
                  <strong>Date:</strong> {selectedRequest.date}
                </p>
                <p className="mb-4">
                  <strong>Status:</strong>{" "}
                  <span className={
                    selectedRequest.status === "Accepted"
                        ? "text-green-600"
                        : selectedRequest.status === "Declined"
                            ? "text-red-600"
                            : "text-yellow-600"
                  }>
                {selectedRequest.status}
              </span>
                </p>
                <div className="text-right">
                  <button
                      onClick={() => setSelectedRequest(null)}
                      className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Add Zoom Link Modal */}
        {showZoomModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add Zoom Link</h2>
                <input
                    type="text"
                    placeholder="Enter Zoom meeting link"
                    value={zoomLink}
                    onChange={(e) => setZoomLink(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <div className="flex justify-end space-x-2">
                  <button
                      onClick={() => setShowZoomModal(false)}
                      className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={() => {
                        alert(`Zoom Link Saved: ${zoomLink}`);
                        setShowZoomModal(false);
                      }}
                      className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
