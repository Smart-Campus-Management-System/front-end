import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";

export default function TProfile() {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/api/v1/tprofile/tutor", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfileData(response.data);
      const [firstName, lastName] = response.data.name?.split(" ") || ["", ""];
      setFormData({
        firstName,
        lastName,
        email: response.data.email,
        bio: response.data.additionalDetails?.bio || "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  // Update profile data
  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
          "http://localhost:4000/api/v1/profile/update",
          formData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
      );
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.put(
          "http://localhost:4000/api/v1/profile/update-password",
          passwordData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
      );
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      setError("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "edulink_uploads");
    formData.append("cloud_name", "dhgyagjqw");
    formData.append("folder", "profile_pictures_tutor");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dhgyagjqw/image/upload", {
        method: "POST",
        body: formData,
      });

      const uploadedImage = await res.json();
      const uploadedImageURL = uploadedImage.url;

      const backendRes = await fetch("http://localhost:4000/api/v1/profile/update-image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ image: uploadedImageURL }),
      });

      if (backendRes.ok) {
        fetchProfile();
      } else {
        setError("Failed to update profile picture.");
      }
    } catch (err) {
      setError("Error uploading profile picture.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
          <Sidebar />
        </div>

        {/* Profile Content */}
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-6">Tutor Profile</h1>

          {/* Welcome Banner */}
          {profileData && (
              <div className="bg-gradient-to-r from-blue-700 to-richblue-800 text-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold">
                  Welcome, {profileData.name || "Tutor"}!
                </h2>
                <p className="mt-2">"Your personal information center - Keep your profile up to date!"</p>
              </div>
          )}

          {loading && <div className="text-center text-white">Loading...</div>}
          {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-6">{error}</div>}

          {profileData && !loading && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Picture Card */}
                <div className="bg-gray-800 p-6 rounded-lg shadow text-center">
                  <h3 className="text-xl font-bold mb-4">Profile Picture</h3>
                  <div className="flex flex-col items-center">
                    <img
                        src={profileData.image || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-2 border-blue-500 mb-4"
                    />
                    <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                      Upload New Picture
                      <input type="file" accept="image/*" onChange={uploadProfilePicture} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Profile Info Card */}
                <div className="bg-gray-800 p-6 rounded-lg shadow lg:col-span-2">
                  <h3 className="text-xl font-bold mb-4">Personal Information</h3>
                  <form onSubmit={updateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          First Name
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            value={formData.firstName}
                            onChange={(e) =>
                                setFormData({ ...formData, firstName: e.target.value })
                            }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            value={formData.lastName}
                            onChange={(e) =>
                                setFormData({ ...formData, lastName: e.target.value })
                            }
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Bio
                      </label>
                      <textarea
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                          value={formData.bio}
                          onChange={(e) =>
                              setFormData({ ...formData, bio: e.target.value })
                          }
                          rows="4"
                      ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>

                {/* Password Change Card */}
                <div className="bg-gray-800 p-6 rounded-lg shadow lg:col-span-3">
                  <h3 className="text-xl font-bold mb-4">Security Settings</h3>
                  <form>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Current Password
                        </label>
                        <input
                            type="password"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          New Password
                        </label>
                        <input
                            type="password"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Confirm New Password
                        </label>
                        <input
                            type="password"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                        />
                      </div>
                    </div>
                    <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        onClick={updatePassword}
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
