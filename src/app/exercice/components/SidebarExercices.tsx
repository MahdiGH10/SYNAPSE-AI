"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  PlusCircle,
  FileText,
  Loader2,
  AlertCircle,
  Trash2,
  Star,
} from "lucide-react";
import { useExercice } from "@/hooks/ExerciceHook";

export interface SidebarExercicesHandle {
  reloadExercices: () => void;
  addExerciceAtTop: (exercice: any) => void;
}

interface SidebarExercicesProps {
  userId: string;
  isDarkMode: boolean;
  onNewExercice: () => void;
  onSelectExercice?: (exercice: any) => void;
  onDeleteExercice?: (deletedId: string) => void;
  activeExerciceId?: string | null;
}

type FavorReaction = {
  _id: string;
  Exercice: string;
  userID: string;
  type: "like" | "dislike";
};

const SidebarExercices = forwardRef<SidebarExercicesHandle, SidebarExercicesProps>(
  ({ userId, isDarkMode, onNewExercice, onSelectExercice, onDeleteExercice, activeExerciceId }, ref) => {
    const { fetchExercicesByUser } = useExercice();
    const [exercices, setExercices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // map exerciceId -> my reaction type
    const [favByExId, setFavByExId] = useState<Record<string, "like" | "dislike" | null>>({});
    const [loadingFav, setLoadingFav] = useState(false);
    const [savingFavId, setSavingFavId] = useState<string | null>(null);

    const FAVOR_API = "/api/favor";

    const load = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetchExercicesByUser(userId);
        const list = Array.isArray(res?.data) ? res.data : res;

        const arr = Array.isArray(list) ? [...list] : [];
        arr.sort((a, b) => {
          const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });

        setExercices(arr || []);
      } catch (e: any) {
        setError(e?.message || "Error loading exercises");
      } finally {
        setLoading(false);
      }
    };

    const addExerciceAtTop = (exercice: any) => {
      if (!exercice) return;
      if (!exercice.createdAt) exercice.createdAt = new Date().toISOString();
      setExercices((prev) => {
        const filtered = prev.filter((e) => e._id !== exercice._id);
        return [exercice, ...filtered];
      });

      setTimeout(() => {
        const aside = document.querySelector("aside");
        if (aside) aside.scrollTop = 0;
      }, 50);
    };

    const handleDelete = async (id: string) => {
      if (!id) return;
      if (!userId) {
        setError("User ID missing.");
        return;
      }

      const confirmDelete = window.confirm("Delete this exercise? This action cannot be undone.");
      if (!confirmDelete) return;

      const prev = [...exercices];
      setExercices((s) => s.filter((e) => e._id !== id));
      setError(null);

      try {
        const res = await fetch(`/api/Exercice/${encodeURIComponent(userId)}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          setExercices(prev);
          const msg = json?.message || "Deletion failed";
          setError(msg);
          console.error("Delete failed:", json || res.statusText);
          return;
        }

        onDeleteExercice?.(id);
      } catch (err: any) {
        setExercices(prev);
        setError(err?.message || "Network error during deletion");
        console.error("Delete error:", err);
      }
    };

    // Load favorites (1 request per exercise; matches your current API)
    useEffect(() => {
      let mounted = true;

      const ids = exercices.map((e) => String(e._id)).filter(Boolean);
      if (!userId || ids.length === 0) {
        setFavByExId({});
        return;
      }

      const loadFav = async () => {
        setLoadingFav(true);
        try {
          const entries = await Promise.all(
            ids.map(async (id) => {
              try {
                const res = await fetch(`${FAVOR_API}?Exercice=${encodeURIComponent(id)}`, {
                  method: "GET",
                  headers: { Accept: "application/json" },
                  cache: "no-store",
                });
                if (!res.ok) return [id, null] as const;

                const json = await res.json().catch(() => ({ data: [] }));
                const data: FavorReaction[] = Array.isArray(json?.data) ? json.data : [];
                // Compare as strings since API returns string IDs
                const mine = data.find((r) => String(r.userID) === String(userId));
                return [id, (mine?.type ?? null)] as const;
              } catch {
                return [id, null] as const;
              }
            })
          );

          if (!mounted) return;

          const next: Record<string, "like" | "dislike" | null> = {};
          for (const [id, t] of entries) next[id] = t;
          setFavByExId(next);
        } finally {
          if (mounted) setLoadingFav(false);
        }
      };

      loadFav();

      return () => {
        mounted = false;
      };
    }, [exercices, userId]);

    const toggleFavorite = async (exerciceId: string) => {
      if (!userId) return alert("You must be logged in.");
      if (!exerciceId) return;

      const current = favByExId[exerciceId] ?? null;
      const nextType: "like" | "dislike" = current === "like" ? "dislike" : "like";

      // optimistic
      setFavByExId((prev) => ({ ...prev, [exerciceId]: nextType }));

      try {
        setSavingFavId(exerciceId);

        console.log('Toggling favorite:', { exerciceId, userId, nextType });

        const res = await fetch(FAVOR_API, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            Exercice: exerciceId,
            userID: userId,
            type: nextType,
          }),
        });

        console.log('Favor API response status:', res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error('Favor API error response:', errorText);
          let err;
          try {
            err = JSON.parse(errorText);
          } catch {
            err = { message: errorText || "Failed" };
          }
          console.error('Favor API error:', err);
          throw new Error(err?.message || err?.error || "Failed to save favorite");
        }

        const result = await res.json();
        console.log('Favor saved successfully:', result);
      } catch (e) {
        console.error('Toggle favorite error:', e);
        // rollback
        setFavByExId((prev) => ({ ...prev, [exerciceId]: current }));
        alert('Failed to save favorite. Please try again.');
      } finally {
        setSavingFavId(null);
      }
    };

    useImperativeHandle(ref, () => ({
      reloadExercices: load,
      addExerciceAtTop,
    }));

    useEffect(() => {
      load();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return (
      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col w-80 border-r backdrop-blur-2xl z-40 ${
          isDarkMode
            ? "bg-[#050811]/95 border-white/10"
            : "bg-[#f7fafc]/95 border-blue-100 shadow-blue-200/40"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2
              className={`text-sm font-semibold tracking-wide uppercase ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              My Exercises
            </h2>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              History of your generated exercises.
            </p>
          </div>
        </div>

        {/* New exercice button */}
        <div className="px-4 pt-4 pb-3 border-b border-white/10">
          <button
            onClick={onNewExercice}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 hover:from-blue-600 hover:via-cyan-500 hover:to-blue-600 text-white text-xs font-medium shadow-md hover:shadow-cyan-400/40 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            New Exercise
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {loading && (
            <div className="flex items-center justify-center py-6 text-xs text-gray-400">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading exercises...
            </div>
          )}

          {error && (
            <div
              className={`flex items-start gap-2 p-3 rounded-xl text-xs ${
                isDarkMode
                  ? "bg-red-500/10 border border-red-500/30 text-red-300"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && exercices.length === 0 && (
            <p className={`text-xs px-1 py-3 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              No saved exercises yet.
            </p>
          )}

          {!loading &&
            exercices.map((ex: any) => {
              const isActive = activeExerciceId === ex._id;
              const exId = String(ex._id);

              const myFavType = favByExId[exId] ?? null;
              const isFav = myFavType === "like";

              return (
                <div key={ex._id} className="relative">
                  <button
                    type="button"
                    onClick={() => onSelectExercice?.(ex)}
                    className={`w-full flex flex-col items-start gap-1 text-left px-3 py-2 rounded-xl border transition-all ${
                      isDarkMode
                        ? isActive
                          ? "bg-cyan-500/20 border-cyan-400/70 shadow-sm"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                        : isActive
                        ? "bg-blue-100 border-blue-300 shadow-sm"
                        : "bg-white border-blue-100 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <FileText className={`w-4 h-4 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"}`} />
                      <span className={`text-sm font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {ex.title || "Sans titre"}
                      </span>
                    </div>

                    {/* 🔧 date moved down (= "decalate the date") */}
                    <div className="flex flex-col gap-0.5 w-full">
                      <span
                        className={`text-[11px] uppercase tracking-wide ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {ex.type || "type inconnu"}
                      </span>

                      {ex.createdAt && (
                        <span className={`text-[10px] ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                          {new Date(ex.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* actions: trash on top-right, star UNDER trash */}
                  <div className="absolute top-1 right-1 flex flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(exId);
                      }}
                      title="Supprimer l'exercice"
                      className="p-1 rounded-md hover:bg-red-500/10 transition"
                    >
                      <Trash2 className={`w-4 h-4 ${isDarkMode ? "text-red-300" : "text-red-600"}`} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(exId);
                      }}
                      title={isFav ? "Unfavorite" : "Favorite"}
                      disabled={savingFavId === exId || loadingFav}
                      className="p-1 rounded-md hover:bg-yellow-500/10 transition disabled:opacity-60"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isFav ? "text-yellow-400" : isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                        fill={isFav ? "currentColor" : "transparent"}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer note */}
        <div className="px-4 py-3 border-t border-white/10 text-[10px]">
          <span className={isDarkMode ? "text-gray-500" : "text-gray-600"}>
            Synapse AI &copy; 2025
          </span>
        </div>
      </aside>
    );
  }
);

SidebarExercices.displayName = "SidebarExercices";
export default SidebarExercices;