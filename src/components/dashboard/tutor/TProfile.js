import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";

const TProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", bio: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/api/v1/profile/tutor", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data) {
        const { name, email, additionalDetails } = response.data;
        const [firstName, lastName] = name?.split(" ") || ["", ""];
        setProfileData(response.data);
        setFormData({ firstName, lastName, email, bio: additionalDetails?.bio || "" });
      }
    } catch (err) {
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
      const response = await axios.put("http://localhost:4000/api/v1/profile/update", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data) {
        alert("Profile updated successfully!");
        fetchProfile();
      }
    } catch (err) {
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
      await axios.put("http://localhost:4000/api/v1/profile/update-password", passwordData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  return (
      <div className="bg-gray-100 flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 w-64 h-screen bg-richblue-800 border-r border-richblack-700">
          <Sidebar />
        </div>

        {/* Profile Content */}
        <div className="flex-1 ml-64 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Tutor Profile</h1>
          {loading && <div className="text-center text-white">Loading...</div>}
          {error && <div className="text-red-500 text-center">{error}</div>}
          {profileData && !loading && (
              <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md text-black">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Hi, {profileData.name}</h1>

                <div className="flex flex-col items-center mb-6">
                  <img
                      src={profileData.image || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-2 border-richblue-800"
                  />
                  <label className="mt-3 text-white bg-slate-500 p-2 border border-black rounded shadow-lg hover:shadow-2xl cursor-pointer">
                    Upload Profile Picture
                    <input type="file" accept="image/*" onChange={uploadProfilePicture} className="hidden" />
                  </label>
                </div>

                {/* Profile Form */}
                <form onSubmit={updateProfile}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows="4"
                    ></textarea>
                  </div>

                  <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">Save</button>
                </form>
              </div>
          )}
        </div>
      </div>
  );
};

export default TProfile;
