"use client";

import { use, useState,useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { Camera, Save } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

import { useProfile } from "@/hooks/useProfile";
import { useSaveProfile } from "@/hooks/useSaveProfile"; // <-- added

export default function ProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { showToast } = useToast();
  const email = typeof window !== 'undefined' && localStorage.getItem('userEmail') || 'email';
  const user = typeof window !== 'undefined' && localStorage.getItem('userName') || 'User';
  const userId = typeof window !== 'undefined' && localStorage.getItem('userId') || ''; // <-- adjust if needed

  const { bio, location, avatar, website } = useProfile();
  const { saveProfile, isLoading, error } = useSaveProfile(); // <-- added

  const data = { bio, location, avatar, website };

  const [formData, setFormData] = useState({
    name: user,
    email: email,
    bio: data.bio,
    location: data.location,
    website: data.website,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      bio: bio,
      location: location,
      website: website,
    }));
  }, [bio, location, avatar, website, user, email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // call the API via the hook
    const result = await saveProfile({
      userId,                         // <-- required by your API
      bio: formData.bio,
      location: formData.location,
      avatar,                         // keep current avatar from useProfile
      website: formData.website,
    });

    if (result?.success) {
      showToast("success", "Profile updated successfully!");
    } else if (error) {
      showToast("error", error);
    } else {
      showToast("error", "Failed to update profile");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#060913]">
      <Sidebar onCollapse={setSidebarCollapsed} />

      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col"
      >
        <Topbar />

        <div className="flex-1 overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
              <p className="text-gray-400">
                Manage your personal information and preferences
              </p>
            </div>

            {/* Profile Card */}
            <div
              className="rounded-2xl border backdrop-blur-xl p-8 mb-6"
              style={{
                background: "rgba(17, 24, 39, 0.7)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    JD
                  </div>
                  <motion.button
                    className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </motion.button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">{formData.name}</h2>
                  <p className="text-gray-400 mb-3">{formData.email}</p>
                  <motion.button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-blue-500/30 hover:bg-blue-500/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Change Avatar
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                      style={{
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(59, 130, 246, 0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                      style={{
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(59, 130, 246, 0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all resize-none"
                    style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(59, 130, 246, 0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                      style={{
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(59, 130, 246, 0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                      style={{
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(59, 130, 246, 0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                  <motion.button
                    type="button"
                    className="px-6 py-3 rounded-lg font-medium text-gray-300 hover:bg-white/5 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-6 py-3 rounded-lg font-medium text-white flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading} // optional: disable while saving
                  >
                    <Save className="h-5 w-5" />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}