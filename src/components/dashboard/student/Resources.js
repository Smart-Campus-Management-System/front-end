import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { FileText, Upload, Download, Share2, MessageSquare, Users, Book, File } from "lucide-react";

// Sample communities data
const communities = [
  { id: 1, name: "C++ Community", subject: "C++", members: 243 },
  { id: 2, name: "Maths Community", subject: "Maths", members: 178 },
  { id: 3, name: "Physics Community", subject: "Physics", members: 156 },
  { id: 4, name: "JavaScript Community", subject: "JavaScript", members: 312 },
];

// Sample messages data
const sampleMessages = {
  "C++": [
    { user: "Student1", content: "Hello, any resources for C++ assignments?", timestamp: "10:30 AM" },
    { user: "Student2", content: "You can check out the C++ Primer book.", timestamp: "10:32 AM" },
    { user: "Tutor_Sarah", content: "I've shared some practice problems in the resources section.", timestamp: "10:40 AM", isVerified: true },
  ],
  "Maths": [
    { user: "Student3", content: "Does anyone understand the latest math problem?", timestamp: "Yesterday" },
    { user: "Student4", content: "I think the answer is in the tutorial notes.", timestamp: "Yesterday" },
    { user: "Tutor_Mike", content: "I'll host a review session tomorrow at 5PM. Check the events section.", timestamp: "Yesterday", isVerified: true },
  ],
  "Physics": [
    { user: "Student5", content: "How to approach the energy conservation problem?", timestamp: "2 days ago" },
    { user: "Tutor_Alex", content: "I've uploaded a step-by-step guide in the resources tab.", timestamp: "2 days ago", isVerified: true },
  ],
  "JavaScript": [
    { user: "Student6", content: "Can someone explain closures?", timestamp: "3 days ago" },
    { user: "Student7", content: "Closures are functions that retain access to their scope.", timestamp: "3 days ago" },
    { user: "Tutor_Jamie", content: "I shared a codepen with examples, check resources.", timestamp: "3 days ago", isVerified: true },
  ],
};

// Sample resources data
const sampleResources = {
  "C++": [
    { id: 1, name: "C++ Assignment Helper.pdf", size: "2.4 MB", type: "PDF", uploadedBy: "Tutor_Sarah", date: "Mar 15, 2025" },
    { id: 2, name: "Data Structures Cheat Sheet.pdf", size: "1.8 MB", type: "PDF", uploadedBy: "Student2", date: "Mar 10, 2025" },
    { id: 3, name: "STL Examples.cpp", size: "56 KB", type: "Code", uploadedBy: "Tutor_Sarah", date: "Mar 5, 2025" },
  ],
  "Maths": [
    { id: 1, name: "Calculus Formula Sheet.pdf", size: "1.2 MB", type: "PDF", uploadedBy: "Tutor_Mike", date: "Mar 18, 2025" },
    { id: 2, name: "Linear Algebra Notes.docx", size: "890 KB", type: "Document", uploadedBy: "Student3", date: "Mar 12, 2025" },
  ],
  "Physics": [
    { id: 1, name: "Energy Conservation Guide.pdf", size: "3.1 MB", type: "PDF", uploadedBy: "Tutor_Alex", date: "Mar 19, 2025" },
    { id: 2, name: "Physics Lab Report Template.docx", size: "720 KB", type: "Document", uploadedBy: "Tutor_Alex", date: "Mar 8, 2025" },
  ],
  "JavaScript": [
    { id: 1, name: "Closures Explained.js", size: "45 KB", type: "Code", uploadedBy: "Tutor_Jamie", date: "Mar 17, 2025" },
    { id: 2, name: "JavaScript Best Practices.pdf", size: "1.5 MB", type: "PDF", uploadedBy: "Student7", date: "Mar 9, 2025" },
    { id: 3, name: "ES6 Features.md", size: "320 KB", type: "Document", uploadedBy: "Tutor_Jamie", date: "Mar 3, 2025" },
  ],
};

export default function Community() {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discussions"); // discussions, resources
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState("Document");

  const handleSelectCommunity = (community) => {
    setSelectedCommunity(community);
    setMessages(sampleMessages[community.subject] || []);
    setResources(sampleResources[community.subject] || []);
    setActiveTab("discussions");
  };

  const handleSendMessage = () => {
    if (messageContent.trim() === "") return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      user: "Current Student",
      content: messageContent,
      timestamp: timeString
    };

    setMessages([...messages, newMessage]);
    setMessageContent("");
  };

  const handleUploadFile = () => {
    if (newFileName.trim() === "") return;

    // Simulate file upload
    const newFile = {
      id: resources.length + 1,
      name: newFileName,
      size: "1.2 MB", // Simulated file size
      type: newFileType,
      uploadedBy: "Current Student",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setResources([...resources, newFile]);
    setNewFileName("");
    setIsUploading(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredCommunities = communities.filter((community) =>
      community.name.toLowerCase().includes(searchQuery)
  );

  const getFileIcon = (fileType) => {
    switch(fileType) {
      case "PDF":
        return <FileText className="text-red-500" />;
      case "Document":
        return <File className="text-blue-500" />;
      case "Code":
        return <File className="text-green-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-gray-900 border-r border-cyan-500/20">
          <Sidebar />
        </div>

        {/* Community Content */}
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Learning Communities</h1>
          <p className="text-gray-300 mb-6">Connect, share resources, and learn together</p>

          {/* Search Bar */}
          <div className="mb-6">
            <input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/5 border border-cyan-500/20 rounded-lg p-3 placeholder-gray-400 text-white shadow-lg shadow-cyan-500/10 backdrop-blur-sm"
            />
          </div>

          <div className="flex gap-6 flex-col md:flex-row">
            {/* Community List */}
            <div className="md:w-1/3">
              <div className="bg-white/5 rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-sm p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Users className="text-cyan-400 mr-2" />
                  <h2 className="text-xl font-bold text-white">Communities</h2>
                </div>
                <ul className="space-y-3">
                  {filteredCommunities.map((community) => (
                      <li
                          key={community.id}
                          className={`p-3 rounded-lg cursor-pointer transition duration-200 border border-gray-700 hover:border-cyan-500/50 hover:bg-cyan-900/20 ${
                              selectedCommunity && selectedCommunity.id === community.id
                                  ? "bg-cyan-900/30 border-cyan-500/50"
                                  : "bg-gray-800/30"
                          }`}
                          onClick={() => handleSelectCommunity(community)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{community.name}</span>
                          <span className="text-xs text-cyan-300">{community.members} members</span>
                        </div>
                      </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Selected Community Content */}
            {selectedCommunity ? (
                <div className="md:w-2/3">
                  <div className="bg-white/5 rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-sm overflow-hidden">
                    {/* Community Header */}
                    <div className="p-6 border-b border-gray-700">
                      <h2 className="text-xl font-bold text-white mb-1">
                        {selectedCommunity.name}
                      </h2>
                      <p className="text-gray-300 text-sm">
                        {selectedCommunity.members} members · Share and discuss {selectedCommunity.subject} topics
                      </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-700">
                      <button
                          className={`flex items-center px-6 py-3 text-sm font-medium ${
                              activeTab === "discussions"
                                  ? "text-cyan-400 border-b-2 border-cyan-400"
                                  : "text-gray-300 hover:text-white"
                          }`}
                          onClick={() => setActiveTab("discussions")}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Discussions
                      </button>
                      <button
                          className={`flex items-center px-6 py-3 text-sm font-medium ${
                              activeTab === "resources"
                                  ? "text-cyan-400 border-b-2 border-cyan-400"
                                  : "text-gray-300 hover:text-white"
                          }`}
                          onClick={() => setActiveTab("resources")}
                      >
                        <Book className="w-4 h-4 mr-2" />
                        Resources
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {activeTab === "discussions" ? (
                          <>
                            {/* Messages */}
                            <div className="bg-gray-800/50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
                              {messages.map((message, index) => (
                                  <div key={index} className="mb-4">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center text-sm font-medium">
                                        {message.user.charAt(0)}
                                      </div>
                                      <div className="ml-3">
                                        <div className="flex items-center">
                                          <span className="font-medium text-white">{message.user}</span>
                                          {message.isVerified && (
                                              <span className="ml-1 px-1.5 py-0.5 bg-cyan-900 text-cyan-300 rounded text-xs">Tutor</span>
                                          )}
                                          <span className="ml-2 text-xs text-gray-400">{message.timestamp}</span>
                                        </div>
                                        <p className="text-gray-300 mt-1">{message.content}</p>
                                      </div>
                                    </div>
                                  </div>
                              ))}
                            </div>

                            {/* Message Input */}
                            <div className="flex items-end">
                        <textarea
                            className="flex-grow bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:border-cyan-500/50 focus:outline-none resize-none"
                            rows="3"
                            placeholder="Type your message here..."
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                        ></textarea>
                              <button
                                  onClick={handleSendMessage}
                                  className="ml-2 bg-cyan-600 text-white p-3 rounded-lg hover:bg-cyan-500 transition-colors duration-200"
                                  disabled={!messageContent.trim()}
                              >
                                <MessageSquare className="w-5 h-5" />
                              </button>
                            </div>
                          </>
                      ) : (
                          <>
                            {/* Resources */}
                            <div className="mb-4 flex justify-between items-center">
                              <h3 className="text-lg font-medium text-white">Shared Files</h3>
                              <button
                                  onClick={() => setIsUploading(!isUploading)}
                                  className="flex items-center px-3 py-2 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-500 transition-colors duration-200"
                              >
                                <Upload className="w-4 h-4 mr-1" />
                                Share Resource
                              </button>
                            </div>

                            {/* Upload Form */}
                            {isUploading && (
                                <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
                                  <h4 className="text-white font-medium mb-3">Upload New Resource</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-1">File Name</label>
                                      <input
                                          type="text"
                                          className="w-full bg-gray-700/50 border border-gray-600 rounded p-2 text-white"
                                          value={newFileName}
                                          onChange={(e) => setNewFileName(e.target.value)}
                                          placeholder="Enter file name with extension (e.g. notes.pdf)"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-1">File Type</label>
                                      <select
                                          className="w-full bg-gray-700/50 border border-gray-600 rounded p-2 text-white"
                                          value={newFileType}
                                          onChange={(e) => setNewFileType(e.target.value)}
                                      >
                                        <option value="Document">Document</option>
                                        <option value="PDF">PDF</option>
                                        <option value="Code">Code</option>
                                      </select>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <button
                                          onClick={() => setIsUploading(false)}
                                          className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200 text-sm"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                          onClick={handleUploadFile}
                                          disabled={!newFileName.trim()}
                                          className="px-3 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors duration-200 text-sm disabled:bg-cyan-900 disabled:cursor-not-allowed"
                                      >
                                        Upload
                                      </button>
                                    </div>
                                  </div>
                                </div>
                            )}

                            {/* Resources List */}
                            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                              <table className="w-full">
                                <thead>
                                <tr className="bg-gray-700/50 text-left">
                                  <th className="px-4 py-3 text-sm font-medium text-gray-300">Name</th>
                                  <th className="px-4 py-3 text-sm font-medium text-gray-300 hidden sm:table-cell">Type</th>
                                  <th className="px-4 py-3 text-sm font-medium text-gray-300 hidden sm:table-cell">Size</th>
                                  <th className="px-4 py-3 text-sm font-medium text-gray-300 hidden md:table-cell">Shared By</th>
                                  <th className="px-4 py-3 text-sm font-medium text-gray-300 hidden md:table-cell">Date</th>
                                  <th className="px-4 py-3 text-sm font-medium text-gray-300">Action</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                {resources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-gray-700/30">
                                      <td className="px-4 py-3">
                                        <div className="flex items-center">
                                          {getFileIcon(resource.type)}
                                          <span className="ml-2 text-white">{resource.name}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">{resource.type}</td>
                                      <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">{resource.size}</td>
                                      <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{resource.uploadedBy}</td>
                                      <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{resource.date}</td>
                                      <td className="px-4 py-3">
                                        <div className="flex space-x-2">
                                          <button className="p-1 text-cyan-400 hover:text-cyan-300 rounded">
                                            <Download className="w-4 h-4" />
                                          </button>
                                          <button className="p-1 text-cyan-400 hover:text-cyan-300 rounded">
                                            <Share2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                      )}
                    </div>
                  </div>
                </div>
            ) : (
                <div className="md:w-2/3 flex items-center justify-center h-64 bg-white/5 rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
                  <div className="text-center p-6">
                    <Users className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Select a Community</h3>
                    <p className="text-gray-400">Choose a community from the list to view discussions and resources</p>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
