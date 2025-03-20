import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Sidebar from "../Sidebar";

export default function TSubjects() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/courses");
        const data = response.data.data;

        const groupedByCategory = data.reduce((acc, course) => {
          const category = course.category?.name || "Uncategorized"; // Ensure category.name exists
          if (!acc[category]) acc[category] = [];
          acc[category].push(course);
          return acc;
        }, {});

        const formattedCategories = Object.entries(groupedByCategory).map(
            ([title, courses]) => ({
              title,
              subjects: courses.map((course) => ({
                id: course._id,
                title: course.courseName,
                description: course.courseDescription || "No description available.",
                thumbnail: course.thumbnail || "No thumbnail available.",
                tags: course.tag?.join(", ") || "No tags available.",
              })),
            })
        );

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filterSubjects = (subjects) =>
      subjects.filter(
          (subject) =>
              subject.title.toLowerCase().includes(searchQuery) ||
              subject.description.toLowerCase().includes(searchQuery) ||
              subject.tags.toLowerCase().includes(searchQuery)
      );

  const handleAddCourse = () => {
    navigate("/dashboard/tutor/add-course");
  };

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-6">Tutor Courses</h1>

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-700 to-richblue-800 text-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold">
              Manage Your Courses
            </h2>
            <p className="mt-2">"Create and update courses to help students succeed in their learning journey!"</p>
          </div>

          {/* Search Bar */}
          <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
            <h3 className="text-xl font-bold mb-4">Find Your Course</h3>
            <input
                type="text"
                placeholder="Search for a subject by title, description, or tags..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full border text-black border-gray-300 rounded-lg p-3 placeholder-gray-600"
            />
          </div>

          {/* Categories Section */}
          <div className="space-y-8">
            {categories.map((category, index) => {
              const filteredSubjects = filterSubjects(category.subjects);
              return (
                  filteredSubjects.length > 0 && (
                      <div key={index} className="bg-gray-800 p-6 rounded-lg shadow mb-8">
                        {/* Category Title */}
                        <h3 className="text-xl font-bold mb-4">
                          {category.title}
                        </h3>

                        {/* Courses */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {filteredSubjects.map((subject, i) => (
                              <Link
                                  to={`/dashboard/tutor/subject/${subject.id}`}
                                  key={i}
                                  className="bg-gray-700 hover:bg-gray-600 p-6 rounded-lg shadow transition duration-200"
                              >
                                {/* Course Title */}
                                <h3 className="text-lg font-semibold text-white mb-2">
                                  {subject.title}
                                </h3>

                                {/* Course Description */}
                                <p className="text-gray-300 mb-3 text-sm">
                                  {subject.description}
                                </p>

                                {/* Tags */}
                                <p className="text-gray-400 text-xs mb-3">
                                  <strong>Tags:</strong> {subject.tags}
                                </p>

                                {/* Thumbnail */}
                                {subject.thumbnail && subject.thumbnail !== "No thumbnail available." && (
                                    <img
                                        src={subject.thumbnail}
                                        alt={`${subject.title} Thumbnail`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                )}
                              </Link>
                          ))}
                        </div>
                      </div>
                  )
              );
            })}
          </div>

          {/* Add New Course Button */}
          <div className="mt-8">
            <button
                onClick={handleAddCourse}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow hover:from-blue-700 hover:to-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            >
              Add New Course
            </button>
          </div>
        </div>
      </div>
  );
}
