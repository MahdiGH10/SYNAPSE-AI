"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { PlusCircle, FileText, Loader2, AlertCircle, Trash2 } from "lucide-react";
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
  onDeleteExercice?: (deletedId: string) => void; // callback to parent when an item is deleted
  activeExerciceId?: string | null;
}

const SidebarExercices = forwardRef<SidebarExercicesHandle, SidebarExercicesProps>(
  ({ userId, isDarkMode, onNewExercice, onSelectExercice, onDeleteExercice, activeExerciceId }, ref) => {
    const { fetchExercicesByUser } = useExercice();
    const [exercices, setExercices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetchExercicesByUser(userId);
        const list = Array.isArray(res?.data) ? res.data : res;

        // sort newest first if createdAt available
        const arr = Array.isArray(list) ? [...list] : [];
        arr.sort((a, b) => {
          const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });

        setExercices(arr || []);
      } catch (e: any) {
        setError(e?.message || "Erreur lors du chargement des exercices");
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

    // DELETE handler in the sidebar (optimistic update + rollback)
    const handleDelete = async (id: string) => {
      if (!id) return;
      if (!userId) {
        setError("Identifiant utilisateur manquant.");
        return;
      }

      const confirmDelete = window.confirm("Supprimer cet exercice ? Cette action est irréversible.");
      if (!confirmDelete) return;

      // keep snapshot for rollback
      const prev = [...exercices];
      // optimistic UI: remove immediately
      setExercices((s) => s.filter((e) => e._id !== id));
      setError(null);

      try {
        const res = await fetch(`/api/Exercice/${encodeURIComponent(userId)}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          // rollback on failure
          setExercices(prev);
          const msg = json?.message || "Échec de la suppression";
          setError(msg);
          console.error("Delete failed:", json || res.statusText);
          return;
        }

        // success: notify parent
        onDeleteExercice?.(id);
      } catch (err: any) {
        // rollback on error
        setExercices(prev);
        setError(err?.message || "Erreur réseau pendant la suppression");
        console.error("Delete error:", err);
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
        className={`sticky top-6 self-start flex flex-col max-h-[calc(100vh-3rem)] w-80 border-r backdrop-blur-2xl ${
          isDarkMode
            ? "bg-[#050811]/70 border-white/10"
            : "bg-[#f7fafc]/90 border-blue-100 shadow-blue-200/40"
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
              Mes exercices
            </h2>
            <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              Historique de vos exercices générés.
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
            Nouveau exercice
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {loading && (
            <div className="flex items-center justify-center py-6 text-xs text-gray-400">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Chargement des exercices...
            </div>
          )}

          {error && (
            <div
              className={`flex items-start gap-2 p-3 rounded-xl text-xs ${
                isDarkMode ? "bg-red-500/10 border border-red-500/30 text-red-300" : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && exercices.length === 0 && (
            <p className={`text-xs px-1 py-3 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              Aucun exercice sauvegardé pour le moment.
            </p>
          )}

          {!loading &&
            exercices.map((ex: any) => {
              const isActive = activeExerciceId === ex._id;

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
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[11px] uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {ex.type || "type inconnu"}
                      </span>
                      {ex.createdAt && (
                        <span className={`text-[10px] ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                          {new Date(ex.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* delete button (absolute positioned top-right of the item) */}
                  <button
                    onClick={() => handleDelete(ex._id)}
                    title="Supprimer l'exercice"
                    className="absolute top-1 right-1 p-1 rounded-md hover:bg-red-500/10 transition"
                  >
                    <Trash2 className={`w-4 h-4 ${isDarkMode ? "text-red-300" : "text-red-600"}`} />
                  </button>
                </div>
              );
            })}
        </div>

        {/* Footer note */}
        <div className="px-4 py-3 border-t border-white/10 text-[10px]">
          <span className={isDarkMode ? "text-gray-500" : "text-gray-600"}>
            Historique stocké côté serveur. Sélectionnez un exercice pour le rouvrir.
          </span>
        </div>
      </aside>
    );
  }
);

SidebarExercices.displayName = "SidebarExercices";

export default SidebarExercices;