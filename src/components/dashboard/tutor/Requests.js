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
    const [currentRequestId, setCurrentRequestId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized: No token found.");
                setLoading(false);
                return;
            }

            const response = await axios.get("http://localhost:4000/api/v1/requests", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.classRequests) {
                // Data is already properly populated
                const formattedRequests = response.data.classRequests.map((req) => ({
                    id: req._id,
                    student: req.student.email,
                    studentName: req.student.name,
                    topic: req.course.courseName,
                    date: new Date(req.time).toLocaleDateString(),
                    time: new Date(req.time).toLocaleTimeString(),
                    status: req.status,
                    zoomLink: req.zoomLink || "",
                    notes: req.notes || "",
                    isNew: req.status === "Pending",
                    createdAt: new Date(req.createdAt).toLocaleDateString(),
                }));

                setRequests(formattedRequests);
                setFilteredRequests(formattedRequests);
            } else {
                setError("No class requests found");
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
            setError("Failed to load class requests. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter requests based on student email, name, or topic
        setFilteredRequests(
            requests.filter(
                (req) =>
                    req.student.toLowerCase().includes(query) ||
                    (req.studentName && req.studentName.toLowerCase().includes(query)) ||
                    req.topic.toLowerCase().includes(query)
            )
        );
    };

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://localhost:4000/api/v1/requests/handle-request/${id}`,
                { status: action },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update local state
            const updatedRequests = requests.map((req) =>
                req.id === id ? { ...req, status: action, isNew: false } : req
            );

            setRequests(updatedRequests);
            setFilteredRequests(
                updatedRequests.filter(
                    (req) =>
                        req.student.toLowerCase().includes(searchQuery) ||
                        (req.studentName && req.studentName.toLowerCase().includes(searchQuery)) ||
                        req.topic.toLowerCase().includes(searchQuery)
                )
            );

            // Refresh data from server
            fetchRequests();
        } catch (err) {
            console.error("Error updating request:", err);
            alert("Failed to update request status. Please try again.");
        }
    };

    const handleAddZoomLink = async () => {
        if (!zoomLink.trim()) {
            alert("Please enter a valid Zoom link");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `http://localhost:4000/api/v1/requests/zoom-link/${currentRequestId}`,
                { zoomLink },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update local state
            const updatedRequests = requests.map((req) =>
                req.id === currentRequestId ? { ...req, zoomLink } : req
            );

            setRequests(updatedRequests);
            setFilteredRequests(
                updatedRequests.filter(
                    (req) =>
                        req.student.toLowerCase().includes(searchQuery) ||
                        (req.studentName && req.studentName.toLowerCase().includes(searchQuery)) ||
                        req.topic.toLowerCase().includes(searchQuery)
                )
            );

            setShowZoomModal(false);
            setZoomLink("");
            setCurrentRequestId(null);

            // Show success message
            alert("Zoom link has been added successfully");

            // Refresh data from server
            fetchRequests();
        } catch (err) {
            console.error("Error adding Zoom link:", err);
            alert("Failed to add Zoom link. Please try again.");
        }
    };

    const openZoomModal = (request) => {
        setCurrentRequestId(request.id);
        setZoomLink(request.zoomLink || "");
        setShowZoomModal(true);
    };

    return (
        <div className="bg-gray-100 flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Class Requests</h1>

                {loading && <div className="text-center">Loading...</div>}
                {error && <div className="text-red-500 text-center">{error}</div>}

                {!loading && !error && (
                    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md text-black">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Requests</label>
                            <input
                                type="text"
                                placeholder="Search by student, email or topic..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Request Count */}
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                Total Requests: {filteredRequests.length}
                            </h2>
                            <button
                                onClick={fetchRequests}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                            >
                                Refresh
                            </button>
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
                                                : request.status === "Accepted"
                                                    ? "bg-green-50 border-green-300"
                                                    : request.status === "Declined"
                                                        ? "bg-red-50 border-red-300"
                                                        : "border-gray-200"
                                        }`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <p className="text-gray-800 font-semibold">{request.studentName || request.student}</p>
                                                <p className="text-gray-600 text-sm">
                                                    Topic: {request.topic} | Requested: {request.createdAt}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    Scheduled for: {request.date} at {request.time}
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
                                                    {request.zoomLink && (
                                                        <span className="ml-2 text-blue-600">
                              <a href={request.zoomLink} target="_blank" rel="noopener noreferrer">
                                (View Zoom Link)
                              </a>
                            </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                                >
                                                    View Details
                                                </button>
                                                {request.status === "Accepted" && (
                                                    <button
                                                        onClick={() => openZoomModal(request)}
                                                        className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700"
                                                    >
                                                        {request.zoomLink ? "Update Zoom Link" : "Add Zoom Link"}
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
                        <div className="space-y-2">
                            <p>
                                <strong>Student Name:</strong> {selectedRequest.studentName || "N/A"}
                            </p>
                            <p>
                                <strong>Student Email:</strong> {selectedRequest.student}
                            </p>
                            <p>
                                <strong>Course/Topic:</strong> {selectedRequest.topic}
                            </p>
                            <p>
                                <strong>Requested On:</strong> {selectedRequest.createdAt}
                            </p>
                            <p>
                                <strong>Scheduled Date:</strong> {selectedRequest.date}
                            </p>
                            <p>
                                <strong>Scheduled Time:</strong> {selectedRequest.time}
                            </p>
                            <p>
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
                            {selectedRequest.zoomLink && (
                                <p>
                                    <strong>Zoom Link:</strong>{" "}
                                    <a
                                        href={selectedRequest.zoomLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        {selectedRequest.zoomLink}
                                    </a>
                                </p>
                            )}
                            {selectedRequest.notes && (
                                <div>
                                    <strong>Notes:</strong>
                                    <p className="mt-1 p-2 bg-gray-100 rounded">{selectedRequest.notes}</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 text-right">
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
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {zoomLink ? "Update Zoom Link" : "Add Zoom Link"}
                        </h2>
                        <input
                            type="text"
                            placeholder="Enter Zoom meeting link"
                            value={zoomLink}
                            onChange={(e) => setZoomLink(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setShowZoomModal(false);
                                    setZoomLink("");
                                    setCurrentRequestId(null);
                                }}
                                className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddZoomLink}
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
