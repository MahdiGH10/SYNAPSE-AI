"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, Orbit, BrainCircuit } from "lucide-react";

import { useWorkspaceStore, type PersonaMode } from "@/store/workspaceStore";

const personaMeta: Record<PersonaMode, { title: string; tagline: string; icon: ComponentType<{ className?: string }> }> = {
  navigator: {
    title: "Navigator",
    tagline: "Calm, strategic guidance for complex projects.",
    icon: Compass,
  },
  visionary: {
    title: "Visionary",
    tagline: "Expansive ideation with narrative flair.",
    icon: Orbit,
  },
  architect: {
    title: "Architect",
    tagline: "Structured design for technical execution.",
    icon: BrainCircuit,
  },
};

const PersonaDock = () => {
  const personaDockOpen = useWorkspaceStore((state) => state.personaDockOpen);
  const togglePersonaDock = useWorkspaceStore((state) => state.togglePersonaDock);
  const activePersona = useWorkspaceStore((state) => state.activePersona);
  const setPersona = useWorkspaceStore((state) => state.setPersona);

  if (!personaDockOpen) {
    return (
      <button
        onClick={togglePersonaDock}
        className="hidden flex-col items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-6 text-xs uppercase tracking-[0.4em] text-white/40 transition hover:text-white lg:flex"
      >
        Persona
        <span className="rounded-full border border-white/10 bg-gradient-aurora-soft px-3 py-1 text-[0.7rem] text-white/70">
          {personaMeta[activePersona].title}
        </span>
      </button>
    );
  }

  return (
    <aside className="hidden w-[260px] flex-shrink-0 flex-col gap-4 rounded-3xl border border-white/10 bg-[rgba(11,16,27,0.8)] p-5 shadow-panel backdrop-blur-md lg:flex">
      <header className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/40">
        <span>Persona modes</span>
        <button
          onClick={togglePersonaDock}
          className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[0.65rem] text-white/50 transition hover:text-white"
        >
          Collapse
        </button>
      </header>

      <p className="text-sm text-white/60">
        Tune SynapseAI to match your session energy. Personas adapt tone, pacing, and suggestion style.
      </p>

      <div className="space-y-3">
        {(Object.keys(personaMeta) as PersonaMode[]).map((persona) => {
          const meta = personaMeta[persona];
          const Icon = meta.icon;
          const isActive = activePersona === persona;
          return (
            <motion.button
              key={persona}
              onClick={() => setPersona(persona)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex w-full flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                isActive
                  ? "border-white/20 bg-gradient-aurora-soft text-white shadow-accent-glow"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{meta.title}</span>
                <span className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="text-xs text-white/60">{meta.tagline}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-gradient-aurora-soft p-2 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="text-xs uppercase tracking-[0.35em] text-white/40">Adaptive tone</div>
        </div>
        <p className="mt-3 text-[0.85rem]">
          Personas modify the AI typing cadence and color bloom to reflect your working mood.
        </p>
      </div>
    </aside>
  );
};

export default PersonaDock;
