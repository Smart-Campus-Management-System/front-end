import React, { useState } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const TAddNewSection = () => {
  const [sectionName, setSectionName] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState([
    {
      questionText: "",
      options: [
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
      ],
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuizChange = (index, field, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[index][field] = value;
    setQuiz(updatedQuiz);
  };

  const handleOptionChange = (quizIndex, optionIndex, field, value) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[quizIndex].options[optionIndex][field] = value;
    setQuiz(updatedQuiz);
  };

  const handleCorrectOptionChange = (quizIndex, optionIndex) => {
    const updatedQuiz = [...quiz];
    const selectedOption = updatedQuiz[quizIndex].options[optionIndex];
    selectedOption.isCorrect = !selectedOption.isCorrect;
    setQuiz(updatedQuiz);
  };

  const addQuestion = () => {
    setQuiz([
      ...quiz,
      {
        questionText: "",
        options: [
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
          { optionText: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuiz = quiz.filter((_, i) => i !== index);
    setQuiz(updatedQuiz);
  };

  const addOption = (quizIndex) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[quizIndex].options.push({ optionText: "", isCorrect: false });
    setQuiz(updatedQuiz);
  };

  const removeOption = (quizIndex, optionIndex) => {
    const updatedQuiz = [...quiz];
    updatedQuiz[quizIndex].options = updatedQuiz[quizIndex].options.filter((_, i) => i !== optionIndex);
    setQuiz(updatedQuiz);
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "edulink_uploads");
      formData.append("cloud_name", "dhgyagjqw");
      formData.append("folder", "videos");

      try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dhgyagjqw/video/upload",
            formData
        );
        setVideoFile(response.data.secure_url); // Set the video URL from Cloudinary
        setMessage("Video uploaded successfully!");
      } catch (error) {
        setMessage("Failed to upload video. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const isValid = quiz.every((question) =>
        question.options.some((option) => option.isCorrect)
    );

    if (!isValid) {
      setMessage("Each question must have at least one correct option.");
      setLoading(false);
      return;
    }

    try {
      const formData = {
        sectionName,
        videoFile, // Use the uploaded video URL
        quiz,
      };

      const response = await axios.post(
          "http://localhost:4000/api/v1/sections/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <div className="container mx-auto">
            {/* Header with Back Button */}
            <div className="flex items-center mb-6">
              <button
                  onClick={() => navigate(-1)}
                  className="flex items-center mr-4 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <IoArrowBack className="mr-2 text-2xl" />
                Back
              </button>
              <h1 className="text-4xl font-bold">Add New Section</h1>
            </div>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-700 to-richblue-800 text-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-2xl font-bold">
                Create Educational Content
              </h2>
              <p className="mt-2">Add a new section with video and quiz questions</p>
            </div>

            {/* Form Container */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section Name */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Section Information</h3>
                  <div className="mb-4">
                    <label htmlFor="sectionName" className="block text-gray-300 text-sm mb-2">
                      Section Name
                    </label>
                    <input
                        type="text"
                        id="sectionName"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        placeholder="Enter section name"
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                  </div>
                </div>

                {/* Video Upload */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Video Content</h3>
                  <div className="mb-4">
                    <label htmlFor="videoFile" className="block text-gray-300 text-sm mb-2">
                      Upload Video File
                    </label>
                    <input
                        type="file"
                        id="videoFile"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                        required
                    />
                    {videoFile && (
                        <p className="text-sm text-green-400 mt-2">Video uploaded successfully!</p>
                    )}
                  </div>
                </div>

                {/* Quiz Section */}
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Quiz Questions</h3>

                  {quiz.map((question, quizIndex) => (
                      <div key={quizIndex} className="mb-6 bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-lg font-semibold">Question {quizIndex + 1}</h4>
                          {quiz.length > 1 && (
                              <button
                                  type="button"
                                  onClick={() => removeQuestion(quizIndex)}
                                  className="text-red-400 hover:text-red-300 text-sm transition-colors"
                              >
                                Remove Question
                              </button>
                          )}
                        </div>

                        <input
                            type="text"
                            value={question.questionText}
                            onChange={(e) => handleQuizChange(quizIndex, "questionText", e.target.value)}
                            placeholder="Enter question text"
                            className="w-full bg-gray-600 border border-gray-500 rounded-lg p-3 mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <div className="space-y-3 mb-4">
                          <h5 className="text-sm font-medium text-gray-300">Options</h5>
                          {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={option.optionText}
                                    onChange={(e) =>
                                        handleOptionChange(quizIndex, optionIndex, "optionText", e.target.value)
                                    }
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="flex-1 bg-gray-600 border border-gray-500 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                      type="checkbox"
                                      checked={option.isCorrect}
                                      onChange={() => handleCorrectOptionChange(quizIndex, optionIndex)}
                                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-gray-300 text-sm">Correct</span>
                                </label>
                                {question.options.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(quizIndex, optionIndex)}
                                        className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                    >
                                      Remove
                                    </button>
                                )}
                              </div>
                          ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => addOption(quizIndex)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                        >
                          Add Option
                        </button>
                      </div>
                  ))}

                  <button
                      type="button"
                      onClick={addQuestion}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
                  >
                    Add New Question
                  </button>
                </div>

                {/* Message Display */}
                {message && (
                    <div className="bg-gray-700 p-4 rounded-lg text-center">
                      <p className={`text-${message.includes("success") ? "green" : "yellow"}-400`}>{message}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !videoFile}
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg shadow transition-colors ${
                        loading || !videoFile
                            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    }`}
                >
                  {loading ? "Adding Section..." : "Add Section"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TAddNewSection;
