"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";

import { Camera, Save } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

import { useProfile } from "@/hooks/useProfile";
import { useSaveProfile } from "@/hooks/useSaveProfile";

/**
 * NOTE:
 * - Change AVATAR_UPLOAD_ENDPOINT if your server route is different.
 *   Your Postman screenshot used "/api/ProfileAatar" (with that exact spelling),
 *   if your server uses "/api/avatar" instead, set the constant accordingly.
 */
const AVATAR_UPLOAD_ENDPOINT = "/api/ProfileAatar";
const AVATAR_GET_ENDPOINT_BASE = "/api/ProfileAatar"; // GET: /api/ProfileAatar/:userId

export default function ProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { showToast } = useToast();

  // Get userId from localStorage
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

  const { saveProfile, isLoading, error } = useSaveProfile();

  // local form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
  });

  // local avatar state so we can update immediately after upload
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRef = useRef<string | null>(null); // track preview URL to revoke

  // Fetch user profile from database
  useEffect(() => {
    if (!userId) return;

    setIsLoadingProfile(true);
    fetch(`/api/profile?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setFormData({
            name: data.data.name || "",
            email: data.data.email || "",
            bio: data.data.bio || "",
            location: data.data.location || "",
            website: data.data.website || "",
          });
          setAvatarUrl(data.data.profilePicture || null);
        }
      })
      .catch(err => console.error('Failed to fetch profile:', err))
      .finally(() => setIsLoadingProfile(false));
  }, [userId]);

  // open file picker
  const onOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  // handle file selection and upload
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Ensure we have a userId
    if (!userId) {
      showToast("error", "Missing userId — please sign in again.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Optional client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const MAX_BYTES = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      showToast("error", "Unsupported file type. Use JPG, PNG, WEBP or GIF.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      showToast("error", "File too large. Max 5MB allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Show immediate preview while uploading
    const previewUrl = URL.createObjectURL(file);
    previewRef.current = previewUrl;
    setAvatarUrl(previewUrl);

    // Build form data and POST to your avatar upload route (multipart/form-data)
    const formDataBody = new FormData();
    formDataBody.append("userId", userId);
    formDataBody.append("file", file);

    try {
      setIsUploading(true);

      console.log("Uploading avatar to", AVATAR_UPLOAD_ENDPOINT, { userId, fileType: file.type, fileSize: file.size });

      const res = await fetch(AVATAR_UPLOAD_ENDPOINT, {
        method: "POST",
        body: formDataBody,
        // DO NOT set Content-Type header — the browser will set the boundary automatically
      });

      console.log("Upload response status:", res.status, res.statusText);
      console.log("Upload response headers:", [...res.headers.entries()]);

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      // If the response is JSON, parse it safely
      if (contentType.includes("application/json")) {
        let json: any;
        try {
          json = await res.json();
        } catch (parseErr) {
          const text = await res.text();
          throw new Error(`Failed to parse JSON response. Raw response: ${text.slice(0, 300)}`);
        }

        if (!res.ok) {
          // server returned a JSON error (e.g. 400/500)
          console.error("Server JSON error response:", json);
          const serverMsg = json?.message || JSON.stringify(json);
          throw new Error(serverMsg);
        }

        // Success path
        if (json?.success) {
          const savedUrl = json.data?.imageUrl;
          if (savedUrl) {
            setAvatarUrl(savedUrl);

            // Persist avatar into profile record immediately
            await saveProfile({ 
              userId, 
              bio: formData.bio, 
              location: formData.location, 
              avatar: savedUrl, 
              website: formData.website 
            });

            showToast("success", "Avatar uploaded and saved successfully");
          } else {
            showToast("success", "Avatar uploaded, but server didn't return image URL");
            console.warn("Upload response missing imageUrl:", json);
          }
        } else {
          console.error("Upload returned success:false", json);
          throw new Error(json?.message || "Upload failed");
        }
      } else {
        // Not JSON — likely HTML error page (404/500), or redirect to login
        const text = await res.text();
        console.error("Non-JSON server response:", text.slice(0, 1000));
        // Show the first part in the toast to help debugging
        throw new Error(`Unexpected server response (status ${res.status}): ${text.slice(0, 300)}`);
      }
    } catch (err: any) {
      console.error("Upload exception", err);
      showToast("error", err?.message || "An error occurred while uploading avatar");
      // revert preview if upload failed - keep current avatarUrl
    } finally {
      setIsUploading(false);
      // reset the input value so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";

      // revoke preview object URL if we created one earlier
      if (previewRef.current) {
        try {
          URL.revokeObjectURL(previewRef.current);
        } catch (e) {
          // ignore
        }
        previewRef.current = null;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If you want to also persist avatar as part of the profile record, include avatarUrl
    const result = await saveProfile({
      userId,
      bio: formData.bio,
      location: formData.location,
      avatar: avatarUrl || "",
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

  // Helper to render initials if no avatar image
  const renderInitials = () => {
    const initials = (formData.name || "U")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return <div className="text-3xl font-bold">{initials}</div>;
  };

  return (
    <div className="flex min-h-screen bg-[#060913]">
      <Sidebar onCollapse={setSidebarCollapsed} />

      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col"
      >
        

        <div className="flex-1 overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
              <p className="text-gray-400">Manage your personal information and preferences</p>
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
                  <div
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white overflow-hidden cursor-pointer"
                    style={{ minWidth: 96, minHeight: 96 }}
                    onClick={onOpenFilePicker}
                  >
                    {avatarUrl ? (
                      // use width/height to cover area
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      renderInitials()
                    )}

                    {/* invisible file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onFileChange}
                      aria-label="Upload avatar"
                    />
                  </div>

                  <motion.button
                    onClick={onOpenFilePicker}
                    className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Change avatar"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </motion.button>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">{formData.name}</h2>
                  <p className="text-gray-400 mb-3">{formData.email}</p>
                  <motion.button
                    onClick={onOpenFilePicker}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white border border-blue-500/30 hover:bg-blue-500/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isUploading ? "Uploading..." : "Change Avatar"}
                  </motion.button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
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
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
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
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
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
                      e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
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
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none transition-all"
                      style={{
                        background: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
                        e.currentTarget.style.boxShadow = "none";
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
                    disabled={isLoading}
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