import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";

export default function TAddSection() {
  const [sections, setSections] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({
            type: "error",
            text: "Authentication token is missing. Please log in.",
          });
          return;
        }

        const response = await axios.get(
            "http://localhost:4000/api/v1/sections/tutor",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        if (response.status === 200) {
          setSections(response.data.data);
          setFilteredSections(response.data.data);
        }
      } catch (error) {
        const errorMessage =
            error.response?.data?.message || "An error occurred.";
        setMessage({ type: "error", text: errorMessage });
      }
    };

    fetchSections();
  }, []);

  // Handle section selection
  const handleSelectSection = (sectionId) => {
    setSelectedSection(sectionId);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = sections.filter((section) =>
        section.sectionName.toLowerCase().includes(searchValue)
    );
    setFilteredSections(filtered);
  };

  // Handle confirm button click
  const handleConfirmSelection = () => {
    if (!selectedSection) {
      setMessage({ type: "error", text: "Please select a section first." });
      return;
    }

    localStorage.setItem("selectedSection", JSON.stringify(selectedSection));

    navigate(`/dashboard/tutor/add-course`, {
      state: { sectionId: selectedSection },
    });
  };

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-6">Your Sections</h1>

          {/* Welcome Section similar to Dashboard */}
          <div className="bg-gradient-to-r from-blue-700 to-richblue-800 text-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold">
              Course Sections Management
            </h2>
            <p className="mt-2">Select a section to add or modify courses</p>
          </div>

          {/* Search Bar with improved styling */}
          <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-bold mb-4">Find Your Section</h3>
            <input
                type="text"
                placeholder="Search for a section..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Feedback Message */}
          {message && (
              <div
                  className={`p-4 mb-6 rounded-lg ${
                      message.type === "success"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                  }`}
              >
                {message.text}
              </div>
          )}

          {/* Sections List with improved card styling */}
          <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-bold mb-4">Available Sections</h3>
            <div className="space-y-4">
              {filteredSections.length > 0 ? (
                  filteredSections.map((section) => (
                      <div
                          key={section._id}
                          className={`p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
                              selectedSection === section._id
                                  ? "bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-500"
                                  : "bg-gray-700 hover:bg-gray-600"
                          }`}
                          onClick={() => handleSelectSection(section._id)}
                      >
                        <h2 className="text-xl font-bold text-white">
                          {section.sectionName}
                        </h2>
                        <p className="text-gray-300 mt-2">{section.description}</p>
                        <div className="flex items-center mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                        section.status === "active"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                    }`}>
                      {section.status || "N/A"}
                    </span>
                        </div>
                      </div>
                  ))
              ) : (
                  <p className="text-gray-400 text-center py-10">No sections found. Try a different search term.</p>
              )}
            </div>
          </div>

          {/* Confirm Button with improved styling */}
          <div className="flex justify-end">
            <button
                onClick={handleConfirmSelection}
                disabled={!selectedSection}
                className={`px-6 py-4 font-bold rounded-lg shadow text-lg transition-all duration-300 ${
                    selectedSection
                        ? "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
  );
}
