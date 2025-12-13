import { useState, useEffect } from "react";

export function useProfile() {
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const response = await fetch(`/api/profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // IMPORTANT: no body for GET
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch profile:", data);
        // Profile might not exist yet, that's okay - use empty defaults
        if (response.status === 404) {
          console.log("Profile not found, using empty defaults");
          return;
        }
        throw new Error(data.message || "Failed to fetch profile");
      }

      console.log("Fetched profile data:", data);

      setBio(data.data.bio || "");
      setLocation(data.data.location || "");
      setAvatar(data.data.avatar || "");
      setWebsite(data.data.website || "");
    } catch (error) {
      console.error("Fetch profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    bio,
    setBio,
    location,
    setLocation,
    avatar,
    setAvatar,
    website,
    setWebsite,
    loading,
    fetchProfile,
  };
}