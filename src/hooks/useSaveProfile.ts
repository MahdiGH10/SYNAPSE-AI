import { useState, useCallback } from "react";

interface ProfilePayload {
  userId: string;
  bio?: string;
  location?: string;
  avatar?: string;
  website?: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data?: any; // ideally use your Iprofile type here
}

export function useSaveProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProfile = useCallback(
    async (payload: ProfilePayload): Promise<ProfileResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data: ProfileResponse = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to save profile");
        }

        return data;
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { saveProfile, isLoading, error };
}