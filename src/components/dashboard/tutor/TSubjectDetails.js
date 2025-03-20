import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import Sidebar from "../Sidebar";

export default function TSubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/courses/${id}`);
        setCourse(response.data.data); // Set the fetched course data
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [id]);

  const handleRedirect = () => {
    // Redirect to the AddSection page
    navigate("/dashboard/tutor/add-section"); // Adjust the route if necessary
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

            {/* Instructions Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-400 mb-4">Instructions</h2>
              <ul className="list-disc list-inside text-gray-300 pl-4">
                {course.instructions?.length > 0 ? (
                    course.instructions.map((instruction, index) => <li key={index} className="mb-2">{instruction}</li>)
                ) : (
                    <li>No instructions available.</li>
                )}
              </ul>
            </div>

            {/* Tags Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-400 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {course.tag?.length > 0 ? (
                    course.tag.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm font-semibold"
                        >
                    {tag}
                  </span>
                    ))
                ) : (
                    <span className="text-gray-300">No tags available.</span>
                )}
              </div>
            </div>
          </div>

          {/* Add Sections Button */}
          <div className="mt-8 mb-16 text-center">
            <button
                onClick={handleRedirect}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold rounded-lg shadow hover:from-green-700 hover:to-green-900 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-200"
            >
              Add Sections to Course
            </button>
          </div>
        </div>
      </div>
  );
}
