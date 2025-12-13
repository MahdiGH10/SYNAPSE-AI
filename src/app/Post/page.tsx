"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";

import { Plus, Send, Upload, Sun, Moon } from "lucide-react";
import PostCard from "@/components/PostCard";
import { useRouter } from "next/navigation";


type PostType = {
  _id?: string;
  userID?: string;
  userName?: string;
  userImage?: string;
  content?: string;
  file?: string | null;
  timestamp?: string | number | Date;
  createdAt?: string | number | Date;
};

export default function PostsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const router = useRouter();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // User profile state fetched from database
  const [userProfile, setUserProfile] = useState({ userId: "", userName: "", userImage: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
    }
  }, [router]);

  // Fetch user profile from database
  useEffect(() => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : "";
    if (!userId) return;

    fetch(`/api/profile?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUserProfile({
            userId: data.data.userId,
            userName: data.data.name || "",
            userImage: data.data.profilePicture || "",
          });
        }
      })
      .catch(err => console.error('Failed to fetch user profile:', err));
  }, []);

  useEffect(() => {
    // fetch posts
    const load = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch("/api/Post");
        if (!res.ok) throw new Error("Failed to load posts");
        const json = await res.json();
        
        setPosts((Array.isArray(json?.data) ? json.data : []).reverse());
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoadingPosts(false);
      }
    };
    load();
  }, []);

  // autosize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(160, ta.scrollHeight) + "px";
  }, [content]);

  const resetForm = () => {
    setContent("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() && !file) return;

    try {
      setIsPosting(true);

      const form = new FormData();
      form.append("userID", userProfile.userId || "anonymous");
      form.append("content", content);
      if (file) form.append("file", file, file.name);

      // optimistic UI
      const tempPost: PostType = {
        _id: "temp-" + Date.now(),
        userID: userProfile.userId || "You",
        userName: userProfile.userName || "You",
        userImage: userProfile.userImage || "/default-avatar.png",
        content,
        file: file ? URL.createObjectURL(file) : null,
        timestamp: new Date().toISOString(),
      };
      setPosts((p) => [tempPost, ...p]);
      resetForm();

      const res = await fetch("/api/Post", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(err?.message || "Failed to create post");
      }

      const json = await res.json();
      if (json?.data) {
        setPosts((prev) => {
          const withoutTemp = prev.filter((p) => !String(p._id).startsWith("temp-"));
          return [json.data, ...withoutTemp];
        });
      } else {
        // fallback reload
        const reload = await fetch("/api/Post");
        const rj = await reload.json();
        setPosts(Array.isArray(rj?.data) ? rj.data : []);
      }
    } catch (err) {
      console.error("Post error:", err);
      setPosts((prev) => prev.filter((p) => !String(p._id).startsWith("temp-")));
      alert(String((err as Error).message || "Failed to post"));
    } finally {
      setIsPosting(false);
    }
  };

  // Page uses the same layout pattern as your Profile page:
  // Sidebar on the left, Topbar across the top, and a motion.main that animates margin
  return (
    <div className="flex min-h-screen bg-[#060913]">
      <Sidebar onCollapse={setSidebarCollapsed} />

      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.25 }}
        className="flex-1 flex flex-col"
      >
        

        <div className="flex-1 overflow-y-auto p-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-1">Community</h1>
              <p className="text-gray-400">Share posts with your community</p>
            </div>

            {/* Create post card (profile-like styling) */}
            <form onSubmit={handlePost} className="relative rounded-2xl border backdrop-blur-xl p-6 mb-6" style={{ background: "rgba(17,24,39,0.7)", borderColor: "rgba(59,130,246,0.08)" }}>
              <div className="flex items-start gap-4">
                <img
                  src={userProfile.userImage || "/default-avatar.png"}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover ring-1 ring-white/10"
                />
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share something with the community..."
                    className="w-full bg-transparent resize-none focus:outline-none text-sm md:text-base placeholder-gray-400 text-white"
                    style={{ minHeight: 80, maxHeight: 200 }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handlePost();
                      }
                    }}
                  />
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      id="post-file"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8 text-sm"
                    >
                      <Upload size={16} className="text-cyan-300" />
                      <span className="text-sm text-gray-300">{file ? file.name : "Attach"}</span>
                    </button>

                    <div className="text-xs text-gray-400 ml-auto">{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="absolute right-6 bottom-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isPosting || (!content.trim() && !file)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105 shadow-lg disabled:opacity-50 text-white"
                >
                  <Send size={16} />
                  <span className="text-sm">{isPosting ? "Posting..." : "Post"}</span>
                </button>
              </div>
            </form>

            {/* Posts list (profile page look) */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Latest posts</h2>
              {loadingPosts ? (
                <div className="text-center py-8 text-gray-400">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No posts yet. Start the conversation!</div>
              ) : (
                <div className="space-y-4">
                  {posts.map((p) => (
                    <PostCard key={String(p._id ?? Math.random())} post={p} />
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}