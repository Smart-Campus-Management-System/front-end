import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import Sidebar from "../Sidebar";

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [ratingsAndReviews, setRatingsAndReviews] = useState([]);
  const [sections, setSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassType, setSelectedClassType] = useState("group");
  const [formData, setFormData] = useState({
    time: "",
    suggestions: "",
  });
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${id}`);
        setCourse(response.data.data);
        const tutorId = response.data.data.tutor._id;
        fetchTutor(tutorId);
        fetchSections(id);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    const fetchTutor = async (tutorId) => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/tutor/${tutorId}`);
        setTutor(response.data.data);
      } catch (error) {
        console.error("Error fetching tutor details:", error);
      }
    };

    const fetchSections = async (courseId) => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/sections/course/${courseId}`);
        setSections(response.data.data);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    const fetchRatingsAndReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/rating/${id}`);
        setRatingsAndReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching ratings and reviews:", error);
      }
    };

    const checkEnrollment = async () => {
      try {
        setIsCheckingEnrollment(true);
        const response = await axios.get("http://localhost:4000/api/v1/profile/student", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userCourses = response.data.courses.map((course) => course._id || course.$oid);
        setIsEnrolled(userCourses.includes(id));
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      } finally {
        setIsCheckingEnrollment(false);
      }
    };

    fetchCourse();
    fetchRatingsAndReviews();
    checkEnrollment();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
          `http://localhost:4000/api/v1/enrollment/enroll/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );
      alert("Enrolled successfully!");
      setIsEnrolled(true);
    } catch (error) {
      console.error("Error enrolling:", error.response?.data || error);
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        type: selectedClassType,
        time: formData.time,
        suggestions: formData.suggestions,
      };

      const response = await axios.post(
          `http://localhost:4000/api/v1/classes/send-request/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );

      alert("Class request sent successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error sending class request:", error.response?.data || error);
      alert(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  if (!course) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
          <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
            <Sidebar />
          </div>
          <div className="flex-1 ml-64 p-8 overflow-y-auto flex items-center justify-center">
            <div className="text-2xl font-bold text-white">Loading course details...</div>
          </div>
        </div>
    );
  }

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
          <Sidebar />
        </div>

        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          {/* Back Button */}
          <button
              onClick={() => navigate(-1)}
              className="flex items-center mb-6 text-blue-400 font-bold hover:text-blue-300 transition duration-200"
          >
            <IoArrowBack className="mr-2 text-2xl" />
            Back to Courses
          </button>

          <div className="relative mb-8">
            <img
                src={course.thumbnail || "https://via.placeholder.com/150"}
                alt={`${course.courseName || "Course"} thumbnail`}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{course.courseName || "Untitled Course"}</h1>
            </div>
          </div>

          {/* Course Information Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Course Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Category</h3>
                <p className="text-gray-300">{course.category?.name || "No category assigned."}</p>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Students Enrolled</h3>
                <p className="text-gray-300">
                  {course.studentsEnrolled?.length > 0
                      ? `${course.studentsEnrolled.length} student${course.studentsEnrolled.length !== 1 ? 's' : ''}`
                      : "No students enrolled."}
                </p>
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 gap-8">
            {/* Description Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-400 mb-4">Course Description</h2>
              <p className="text-gray-300">{course.courseDescription || "No description available."}</p>
            </div>

            {/* What You Will Learn Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-400 mb-4">What You Will Learn</h2>
              <p className="text-gray-300">{course.whatYouWillLearn || "No details provided."}</p>
            </div>

            {/* Tutor Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-400 mb-4">Tutor</h2>
              {tutor ? (
                  <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition duration-200">
                    <h3 className="text-xl font-bold text-white">
                      {tutor.firstName} {tutor.lastName}
                    </h3>
                    <p className="text-gray-300 mt-2"><strong className="text-blue-300">Email:</strong> {tutor.email}</p>
                  </div>
              ) : (
                  <p className="text-gray-300">No tutor assigned to this course.</p>
              )}
            </div>

            {/* Course Sections */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-400 mb-4">Course Sections</h2>
              {sections.length > 0 ? (
                  <ul className="space-y-2 text-gray-300 pl-4">
                    {sections.map((section) => (
                        <li
                            key={section._id}
                            className="cursor-pointer hover:text-blue-300 transition duration-200 flex items-center"
                            onClick={() => navigate(`/dashboard/student/section/${section._id}`)}
                        >
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          {section.sectionName}
                        </li>
                    ))}
                  </ul>
              ) : (
                  <p className="text-gray-300">No sections available for this course.</p>
              )}
            </div>

            {/* Ratings and Reviews Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-400 mb-4">Ratings and Reviews</h2>
              <div className="space-y-4">
                {ratingsAndReviews.length > 0 ? (
                    ratingsAndReviews.map((review, index) => (
                        <div key={index} className="bg-gray-700 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                              {review.user.firstName.charAt(0)}
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                              {review.user.firstName} {review.user.lastName}
                            </h3>
                          </div>
                          <div className="flex items-center mb-2">
                            <span className="text-gray-300 mr-2"><strong className="text-blue-300">Rating:</strong></span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-500'}`}>★</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300"><strong className="text-blue-300">Review:</strong> {review.review}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-300">No ratings or reviews available for this course.</p>
                )}
              </div>
            </div>
          </div>

          {/* Enrollment/Request Button */}
          <div className="mt-8 mb-16 text-center">
            {isCheckingEnrollment ? (
                <button
                    disabled
                    className="px-8 py-4 bg-gray-600 text-white font-bold rounded-lg shadow opacity-70 cursor-not-allowed"
                >
                  Checking Enrollment...
                </button>
            ) : isEnrolled ? (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                >
                  Request to Class
                </button>
            ) : (
                <button
                    onClick={handleEnroll}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold rounded-lg shadow hover:from-green-700 hover:to-green-900 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
                >
                  Enroll in Course
                </button>
            )}
          </div>
        </div>

        {/* Request Class Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-blue-500/30 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-blue-400">Request Class</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="time">Preferred Time</label>
                    <input
                        type="text"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Weekdays 6-8 PM"
                        required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-white mb-2" htmlFor="suggestions">Suggestions</label>
                    <textarea
                        id="suggestions"
                        name="suggestions"
                        value={formData.suggestions}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Any specific topics or questions you'd like covered..."
                        required
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <label className="block text-white mb-2">Class Type</label>
                    <select
                        value={selectedClassType}
                        onChange={(e) => setSelectedClassType(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="group">Group</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}
