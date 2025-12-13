"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Sidebar from "@/components/dashboard/Sidebar";

import { tokenManager } from "@/lib/api";
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  Bot,
} from "lucide-react";
import { getUserFromSession } from "@/lib/usesession";

const stats = [
  { name: "Total Conversations", value: "127", change: "+12%", trend: "up", icon: MessageSquare },
  { name: "Messages Today", value: "43", change: "+8%", trend: "up", icon: Zap }, // replaced dynamically
  { name: "Avg. Response Time", value: "1.2s", change: "-15%", trend: "down", icon: Clock }, // replaced dynamically
  { name: "Active Workspaces", value: "5", change: "+2", trend: "up", icon: TrendingUp },
];

type ExerciceType = {
  _id: string;
  title?: string;
  type?: string;
  createdAt?: string;
};

type FavorReaction = {
  _id: string;
  Exercice: string;
  userID: string;
  type: "like" | "dislike";
  createdAt?: string;
  updatedAt?: string;
};

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  getUserFromSession();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  
  const [userProfile, setUserProfile] = useState({ name: "", email: "", profilePicture: "" });
  const [favoriteExercices, setFavoriteExercices] = useState<ExerciceType[]>([]);
  const [loadingFav, setLoadingFav] = useState(false);

  const [totalExercices, setTotalExercices] = useState<number>(0);

  // ✅ NEW: post count for this user (from /api/Post/[id])
  const [myPostsCount, setMyPostsCount] = useState<number>(0);
  const [loadingPostsCount, setLoadingPostsCount] = useState(false);
  
  const [totalChats, setTotalChats] = useState<number>(0);
  const [loadingChats, setLoadingChats] = useState(false);

  // Fetch user profile from database
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/profile?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUserProfile({
            name: data.data.name || "",
            email: data.data.email || "",
            profilePicture: data.data.profilePicture || "",
          });
        }
      })
      .catch(err => console.error('Failed to fetch user profile:', err));
  }, [userId]);

  // Fetch total chats count
  useEffect(() => {
    if (!userId) return;
    
    setLoadingChats(true);
    fetch(`/api/chats?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTotalChats(data.count || 0);
        }
      })
      .catch(err => console.error('Failed to fetch chats:', err))
      .finally(() => setLoadingChats(false));
  }, [userId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
    }
  }, [router]);

  // Handle token from Google OAuth callback
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      tokenManager.set(token);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  // Load favorite exercises + total exercises count
  useEffect(() => {
    let mounted = true;

    const loadFavorites = async () => {
      if (!userId) return;

      setLoadingFav(true);
      try {
        const exRes = await fetch(`/api/Exercice/${encodeURIComponent(userId)}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!exRes.ok) throw new Error("Failed to load exercises");
        const exJson = await exRes.json().catch(() => ({}));
        const exercices: ExerciceType[] = Array.isArray(exJson?.data) ? exJson.data : [];

        if (mounted) setTotalExercices(exercices.length);

        const checks = await Promise.all(
          exercices.map(async (ex) => {
            try {
              const favRes = await fetch(
                `/api/favor?Exercice=${encodeURIComponent(String(ex._id))}`,
                { method: "GET", headers: { Accept: "application/json" }, cache: "no-store" }
              );

              if (!favRes.ok) return { ex, isFav: false };

              const favJson = await favRes.json().catch(() => ({ data: [] }));
              const reactions: FavorReaction[] = Array.isArray(favJson?.data) ? favJson.data : [];
              
              // Compare as strings since API now returns string IDs
              const mine = reactions.find((r) => String(r.userID) === String(userId));

              return { ex, isFav: mine?.type === "like" };
            } catch (err) {
              console.error('Error checking favorite for exercise:', ex._id, err);
              return { ex, isFav: false };
            }
          })
        );

        const favs = checks.filter((c) => c.isFav).map((c) => c.ex);

        favs.sort((a, b) => {
          const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });

        if (mounted) setFavoriteExercices(favs);
      } catch (e) {
        console.error("Failed to load favorite exercices", e);
        if (mounted) {
          setFavoriteExercices([]);
          setTotalExercices(0);
        }
      } finally {
        if (mounted) setLoadingFav(false);
      }
    };

    loadFavorites();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // ✅ Load posts count from your NEW route: /api/Post/[id]
  useEffect(() => {
    let mounted = true;

    const loadPostsCount = async () => {
      if (!userId) return;

      setLoadingPostsCount(true);
      try {
        const res = await fetch(`/api/Post/${encodeURIComponent(userId)}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load post count");
        const json = await res.json().catch(() => ({}));

        const count = typeof json?.count === "number" ? json.count : 0;
        if (mounted) setMyPostsCount(count);
      } catch (e) {
        console.error("Failed to load post count", e);
        if (mounted) setMyPostsCount(0);
      } finally {
        if (mounted) setLoadingPostsCount(false);
      }
    };

    loadPostsCount();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Real stats from database
  const statsWithRealData = [
    {
      name: "Total Conversations",
      value: loadingChats ? "..." : String(totalChats),
      change: totalChats > 0 ? `+${totalChats}` : "",
      trend: "up" as const,
      icon: MessageSquare,
    },
    {
      name: "Total Exercises",
      value: loadingFav ? "..." : String(totalExercices),
      change: totalExercices > 0 ? `${totalExercices} saved` : "",
      trend: "up" as const,
      icon: Zap,
    },
    {
      name: "My Posts",
      value: loadingPostsCount ? "..." : String(myPostsCount),
      change: myPostsCount > 0 ? `${myPostsCount} shared` : "",
      trend: "up" as const,
      icon: Clock,
    },
    {
      name: "Favorites",
      value: loadingFav ? "..." : String(favoriteExercices.length),
      change: favoriteExercices.length > 0 ? `${favoriteExercices.length} liked` : "",
      trend: "up" as const,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#060913]">
      <Sidebar onCollapse={setSidebarCollapsed} />

      <motion.main
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col"
      >

        <div className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-4">
              {userProfile.profilePicture && (
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-blue-500/30">
                  <img src={userProfile.profilePicture} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {userProfile.name || 'User'}! 👋</h1>
                <p className="text-gray-400">Here's what's happening with your account today.</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsWithRealData.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl border backdrop-blur-xl p-6 hover:scale-[1.02] hover:border-blue-500/40 transition-all cursor-pointer group"
                style={{
                  background: "rgba(17, 24, 39, 0.7)",
                  borderColor: "rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
                    }}
                  >
                    <stat.icon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>

                  {stat.change ? (
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.trend === "up" ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"
                      }`}
                    >
                      {stat.change}
                    </span>
                  ) : (
                    <span className="text-sm font-medium px-2 py-1 rounded-full text-transparent select-none">
                      .
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.name}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Favorite Exercice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 rounded-2xl border backdrop-blur-xl p-6"
              style={{
                background: "rgba(17, 24, 39, 0.7)",
                borderColor: "rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Favorite Exercises</h2>
                <button 
                  onClick={() => router.push('/exercice')}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {loadingFav ? (
                <div className="text-sm text-gray-400">Loading favorites...</div>
              ) : favoriteExercices.length === 0 ? (
                <div className="text-sm text-gray-400">No favorite exercises yet.</div>
              ) : (
                <div className="space-y-4">
                  {favoriteExercices.map((ex, index) => (
                    <motion.div
                      key={ex._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/exercice/${encodeURIComponent(ex._id)}`)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-blue-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{ex.title || "Sans titre"}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {ex.createdAt ? new Date(ex.createdAt).toLocaleString() : "—"}
                          <span className="opacity-60">•</span>
                          <span className="uppercase text-xs">{ex.type || "type inconnu"}</span>
                        </p>
                      </div>

                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}