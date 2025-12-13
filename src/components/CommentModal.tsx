"use client";
import React, { useEffect, useRef, useState } from "react";

type CommentType = {
  _id?: string;
  post?: string;
  userID?: string;
  content?: string;
  timestamp?: number | string;
};

type ProfileInfo = {
  name?: string;
  imageUrl?: string;
};

type Props = {
  postId: string;
  onClose: () => void;
  onPosted?: (comment: any) => void;
};

export default function CommentModal({ postId, onClose, onPosted }: Props) {
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Record<string, ProfileInfo>>({});
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Helper: fetch comments using GET with query param
  const fetchComments = async () => {
    if (!postId) return;
    setLoadingComments(true);
    setError(null);
    try {
      const res = await fetch(`/api/commant?post=${encodeURIComponent(postId)}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || `Server returned ${res.status}`);
      }

      const json = await res.json().catch(() => ({ data: [] }));
      const data: CommentType[] = Array.isArray(json?.data) ? json.data : [];
      setComments(data);

      const uniqueUserIds = Array.from(new Set(data.map((c) => c.userID).filter(Boolean) as string[]));
      await fetchProfiles(uniqueUserIds);

      setTimeout(() => {
        containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
      }, 50);
    } catch (err: any) {
      console.error("fetchComments error", err);
      setError(err?.message || "Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchProfiles = async (userIds: string[]) => {
    const toFetch = userIds.filter((id) => id && !profiles[id]);
    if (toFetch.length === 0) return;

    const newProfiles: Record<string, ProfileInfo> = {};
    await Promise.all(
      toFetch.map(async (id) => {
        try {
          const res = await fetch(`/api/ProfileAatar/${encodeURIComponent(id)}`);
          if (!res.ok) return;
          const json = await res.json().catch(() => null);
          const imageUrl = json?.data?.imageUrl || json?.data?.image || undefined;
          localStorage.setItem("userImage", imageUrl );
          const name =
            json?.data?.userName ||
            json?.data?.name ||
            json?.data?.username ||
            json?.data?.fullName ||
            json?.data?.displayName ||
            undefined;
          newProfiles[id] = { imageUrl, name };
        } catch (e) {
          console.debug("profile fetch failed for", id, e);
        }
      })
    );

    if (Object.keys(newProfiles).length > 0) {
      setProfiles((prev) => ({ ...prev, ...newProfiles }));
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim()) {
      alert("Please write a comment before posting.");
      return;
    }
    if (!postId) {
      alert("Missing post id.");
      return;
    }
    if (!userId) {
      alert("Missing user id. Please sign in.");
      return;
    }

    setPosting(true);
    try {
      const body = {
        post: postId,
        userID: userId,
        content: content.trim(),
        timestamp: Date.now(),
      };

      const res = await fetch("/api/commant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || `Server returned ${res.status}`);
      }

      if (onPosted) onPosted(json?.data);

      setContent("");
      await fetchComments();

      setTimeout(() => {
        containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
      }, 50);
    } catch (err: any) {
      console.error("Comment submit error:", err);
      alert(err?.message || "Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const renderInitials = (nameOrId?: string) => {
    const base = nameOrId || "U";
    const initials = base
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return initials || "U";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16">
      <div className="absolute inset-0 bg-black/60" onClick={() => { if (!posting) onClose(); }} />

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="bg-[#0f1724] rounded-xl p-6 shadow-2xl border border-white/6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Comments</h3>
              <p className="text-sm text-gray-400">Be kind and respectful. Comments are visible to everyone.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { if (!posting) onClose(); }} className="px-3 py-1 rounded-md text-sm text-gray-300 hover:bg-white/5 transition-colors">Close</button>
            </div>
          </div>

          <div ref={containerRef} className="max-h-[48vh] overflow-y-auto space-y-3 mb-4 p-2 rounded-md" style={{ background: "rgba(255,255,255,0.01)" }}>
            {loadingComments ? (
              <div className="text-center py-6 text-gray-400">Loading comments...</div>
            ) : error ? (
              <div className="text-center py-6 text-red-400">{error}</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6 text-gray-400">No comments yet — be the first to comment.</div>
            ) : (
              comments.map((c) => {
                const uid = c.userID || "unknown";
                const profile = profiles[uid] || {};
                const name = profile.name || (c as any).userName || undefined;
                const avatar = profile.imageUrl;
                return (
                  <div key={String(c._id ?? Math.random())} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/2 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold text-white overflow-hidden">
                      {avatar ? <img src={avatar} alt={name || uid} className="w-full h-full object-cover" /> : renderInitials(name || uid)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {name || (uid && (uid.length > 10 ? `${uid.slice(0, 6)}...` : uid))}
                          </div>
                          <div className="text-xs text-gray-400">{new Date(Number(c.timestamp || Date.now())).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-200 whitespace-pre-wrap">{c.content}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your comment..." className="w-full min-h-[120px] max-h-[220px] resize-none rounded-md p-3 bg-transparent border border-white/6 text-white placeholder-gray-500 focus:outline-none" />
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-gray-400">Posting as {userId ? `${userId.slice(0, 8)}...` : "Guest"}</div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setContent("")} className="px-3 py-2 rounded-md text-gray-300 hover:bg-white/5 transition-colors" disabled={posting}>Clear</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md disabled:opacity-50" disabled={posting}>
                  {posting ? "Posting..." : "Post comment"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}