"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MessageSquare, Copy, ThumbsUp } from "lucide-react";
import CommentModal from "./CommentModal";

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

type Reaction = {
  _id: string;
  post: string;
  userID: string;
  type: "like" | "dislike";
};

const getLocalUserId = () =>
  typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";

// quick heuristic to detect if a string looks like a Mongo ObjectId (24 hex chars)
function isLikelyObjectId(s?: string | null) {
  if (!s) return false;
  return /^[a-f0-9]{24}$/i.test(s);
}

function isImage(url?: string | null) {
  if (!url) return false;
  return /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i.test(url);
}
function isVideo(url?: string | null) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}

function formatTimestamp(ts?: string | number | Date) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function PostCard({ post }: { post: PostType }) {
  // current user (viewer)
  const viewerId = getLocalUserId() || "";

  // local state for author display name + avatar (use post data directly from database)
  const [authorName, setAuthorName] = useState<string | undefined>(() => {
    if (post.userName && !isLikelyObjectId(post.userName)) return post.userName;
    return undefined;
  });
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(() => post.userImage || undefined);
  const userId = post.userID || "";
  const fileUrl = post.file || null;

  const [showCommentModal, setShowCommentModal] = useState(false);

  // comment count state
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);

  // likes state
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [loadingReactions, setLoadingReactions] = useState(false);
  const [savingReaction, setSavingReaction] = useState(false);

  const postId = post._id ? String(post._id) : "";
  const isPersistedPost = !!postId && !postId.startsWith("temp-");

  const likeCount = useMemo(
    () => reactions.filter((r) => r.type === "like").length,
    [reactions]
  );

  const likedByMe = useMemo(() => {
    if (!viewerId) return false;
    return reactions.some((r) => r.userID === viewerId && r.type === "like");
  }, [reactions, viewerId]);

  // If we don't have a proper authorName or avatar, try to fetch profile info from your API.
  useEffect(() => {
    let mounted = true;

    if (authorName && authorName.trim() !== "") return;
    if (!userId) return;

    const url = `/api/ProfileAatar/${encodeURIComponent(userId)}`;

    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;

        const data = json?.data || {};
        const nameFromApi =
          data.userName || data.name || data.username || data.fullName || data.displayName;
        const imageFromApi = data.imageUrl || data.image || data.imageURL || data.avatar;

        if (nameFromApi && !isLikelyObjectId(nameFromApi)) {
          setAuthorName(nameFromApi);
        }
        if (imageFromApi) {
          setAvatarUrl(imageFromApi);
        }
      } catch (err) {
        console.debug("Could not fetch profile for post author:", err);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.userID]);

  // fetch comment count for this post
  useEffect(() => {
    let mounted = true;
    const id = post._id;
    if (!id || String(id).startsWith("temp-")) {
      setCommentCount(0);
      return;
    }

    const fetchCount = async () => {
      setLoadingCount(true);
      try {
        const res = await fetch(`/api/commant?post=${encodeURIComponent(String(id))}`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          if (mounted) setCommentCount(0);
          return;
        }
        const json = await res.json().catch(() => ({ data: [] }));
        if (!mounted) return;
        const data = Array.isArray(json?.data) ? json.data : [];
        setCommentCount(data.length);
      } catch (err) {
        console.error("Failed to fetch comment count", err);
        if (mounted) setCommentCount(0);
      } finally {
        if (mounted) setLoadingCount(false);
      }
    };

    fetchCount();

    return () => {
      mounted = false;
    };
  }, [post._id]);

  // fetch likes/reactions for this post
  useEffect(() => {
    let mounted = true;

    if (!isPersistedPost) {
      setReactions([]);
      return;
    }

    const loadReactions = async () => {
      setLoadingReactions(true);
      try {
        const res = await fetch(`/api/Likes?post=${encodeURIComponent(postId)}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) {
          if (mounted) setReactions([]);
          return;
        }
        const json = await res.json().catch(() => ({ data: [] }));
        if (!mounted) return;
        setReactions(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        console.error("Failed to fetch reactions", err);
        if (mounted) setReactions([]);
      } finally {
        if (mounted) setLoadingReactions(false);
      }
    };

    loadReactions();

    return () => {
      mounted = false;
    };
  }, [postId, isPersistedPost]);

  const toggleLike = async () => {
    if (!isPersistedPost) {
      alert("This post is not saved yet. Try again when the post is uploaded.");
      return;
    }
    if (!viewerId) {
      alert("You must be logged in to like.");
      return;
    }

    // Your API supports only 'like'/'dislike' (no delete), so we toggle:
    // liked => send 'dislike', not liked => send 'like'
    const nextType: "like" | "dislike" = likedByMe ? "dislike" : "like";

    // optimistic update: keep one reaction per (post,user)
    setReactions((prev) => {
      const withoutMine = prev.filter((r) => r.userID !== viewerId);
      const optimistic: Reaction = {
        _id: "temp-" + Date.now(),
        post: postId,
        userID: viewerId,
        type: nextType,
      };
      return [...withoutMine, optimistic];
    });

    try {
      setSavingReaction(true);
      const res = await fetch("/api/Likes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ post: postId, userID: viewerId, type: nextType }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(err?.message || "Failed to save reaction");
      }

      const json = await res.json();
      const saved: Reaction | undefined = json?.data;

      // if API returns the updated doc, keep it
      if (saved?._id) {
        setReactions((prev) => {
          const withoutMine = prev.filter((r) => r.userID !== viewerId);
          return [...withoutMine, saved];
        });
      } else {
        // fallback reload
        const reload = await fetch(`/api/Likes?post=${encodeURIComponent(postId)}`, { cache: "no-store" });
        const rj = await reload.json().catch(() => ({ data: [] }));
        setReactions(Array.isArray(rj?.data) ? rj.data : []);
      }
    } catch (err) {
      console.error("Reaction save error:", err);
      // revert by reloading server state
      try {
        const reload = await fetch(`/api/Likes?post=${encodeURIComponent(postId)}`, { cache: "no-store" });
        const rj = await reload.json().catch(() => ({ data: [] }));
        setReactions(Array.isArray(rj?.data) ? rj.data : []);
      } catch {
        // ignore
      }
    } finally {
      setSavingReaction(false);
    }
  };

  // Final values used for rendering (use data from post, which comes from database)
  const displayName =
    authorName || (post.userName && !isLikelyObjectId(post.userName) ? post.userName : "Anonymous");
  const displayAvatar = avatarUrl || "/default-avatar.png";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(post.content || "");
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  const isCommentable = isPersistedPost;

  return (
    <>
      <article className="rounded-2xl p-5 border shadow-sm hover:shadow-md transition-shadow bg-white/5 border-white/5">
        <header className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-white/10 flex-shrink-0">
            <img
              src={displayAvatar}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{displayName}</div>
                <div className="text-xs text-gray-400">{formatTimestamp(post.createdAt || post.timestamp)}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="mb-3 break-words whitespace-pre-wrap text-sm">{post.content}</div>

        {fileUrl && (
          <div className="mb-3">
            {isImage(fileUrl) ? (
              <img src={fileUrl} alt="attachment" className="w-full rounded-xl object-cover" />
            ) : isVideo(fileUrl) ? (
              <video controls src={fileUrl} className="w-full rounded-xl" />
            ) : (
              <a href={fileUrl} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
                View attachment
              </a>
            )}
          </div>
        )}

        <footer className="flex items-center gap-3">
          {/* Like button */}
          <button
            onClick={toggleLike}
            disabled={!isPersistedPost || loadingReactions || savingReaction}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/6 hover:bg-white/10 disabled:opacity-60"
            title={likedByMe ? "Unlike (set to dislike)" : "Like"}
          >
            <ThumbsUp
              size={16}
              className={likedByMe ? "text-blue-500" : "text-gray-300"}
              fill={likedByMe ? "currentColor" : "transparent"}
            />
            <span className="text-sm">
              Like{" "}
              <span className="ml-2 text-xs text-gray-300">
                (
                {loadingReactions ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  likeCount
                )}
                )
              </span>
            </span>
          </button>

          {/* Comment button */}
          <button
            onClick={() => {
              if (!isCommentable) {
                alert("This post is not saved yet. Try again when the post is uploaded.");
                return;
              }
              setShowCommentModal(true);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/6 hover:bg-white/10"
          >
            <MessageSquare size={16} />
            <span className="text-sm">
              Comment
              {loadingCount ? (
                <span className="ml-2 text-xs text-gray-400 animate-pulse">...</span>
              ) : commentCount !== null ? (
                <span className="ml-2 text-xs text-gray-300">({commentCount})</span>
              ) : null}
            </span>
          </button>

          <button
            onClick={handleCopy}
            className="ml-auto flex items-center gap-2 px-2 py-1 rounded-md bg-white/6 hover:bg-white/10"
          >
            <Copy size={14} />
          </button>
        </footer>
      </article>

      {showCommentModal && (
        <CommentModal
          postId={String(post._id || "")}
          onClose={() => setShowCommentModal(false)}
          onPosted={() => {
            setCommentCount((c) => (c == null ? 1 : c + 1));
          }}
        />
      )}
    </>
  );
}