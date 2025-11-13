"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import type { Message } from "@/store/chatStore";

interface MindmapCanvasProps {
  messages: Message[];
}

interface NodePosition {
  x: number;
  y: number;
}

const polarToCartesian = (radius: number, angle: number): NodePosition => ({
  x: radius * Math.cos(angle),
  y: radius * Math.sin(angle),
});

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const MindmapCanvas = ({ messages }: MindmapCanvasProps) => {
  const filteredMessages = messages.filter((message) => message.role !== "system");

  const initialPositions = useMemo(() => {
    if (filteredMessages.length === 0) return {} as Record<string, NodePosition>;
    const center: Record<string, NodePosition> = {};
    const radiusStep = 110;
    filteredMessages.forEach((message, index) => {
      const layer = Math.floor(index / 6);
      const radius = 80 + layer * radiusStep;
      const angle = ((index % 6) / 6) * Math.PI * 2;
      center[message.id] = polarToCartesian(radius, angle);
    });
    return center;
  }, [filteredMessages]);

  const [positions, setPositions] = useState<Record<string, NodePosition>>(initialPositions);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const handlePointerDown = (id: string, startEvent: React.PointerEvent<HTMLDivElement>) => {
    startEvent.preventDefault();
    startEvent.currentTarget.setPointerCapture(startEvent.pointerId);

    const origin = positions[id] ?? { x: 0, y: 0 };
    const startX = startEvent.clientX;
    const startY = startEvent.clientY;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      setPositions((prev) => ({
        ...prev,
        [id]: {
          x: origin.x + (moveEvent.clientX - startX) / zoom,
          y: origin.y + (moveEvent.clientY - startY) / zoom,
        },
      }));
    };

  const handlePointerUp = () => {
      startEvent.currentTarget.releasePointerCapture(startEvent.pointerId);
      setActiveNode(id);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div className="relative flex h-full flex-1 flex-col rounded-3xl border border-white/5 bg-[rgba(13,17,27,0.78)] p-6 shadow-panel-soft">
      <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/40">
        <span>Visual thinking mode</span>
        <div className="flex items-center gap-2 text-white/60">
          <label className="flex items-center gap-2 text-[0.7rem]">
            <span>Zoom</span>
            <input
              type="range"
              min={60}
              max={130}
              value={zoom * 100}
              onChange={(event) => setZoom(parseInt(event.target.value, 10) / 100)}
              className="accent-[#6A5ACD]"
            />
          </label>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/5 bg-[rgba(7,10,18,0.6)]">
        <motion.div
          className="absolute left-1/2 top-1/2 min-h-full min-w-full"
          style={{ transformOrigin: "center center" }}
          animate={{ scale: zoom }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(106,90,205,0.1)_0%,transparent_65%)]" />
          {filteredMessages.map((message) => {
            const position = positions[message.id] ?? initialPositions[message.id] ?? { x: 0, y: 0 };
            const isAssistant = message.role === "assistant";
            const trimmed = message.content.trim();
            const preview = trimmed.length > 120 ? `${trimmed.slice(0, 120)}…` : trimmed;

            const importance = clamp(trimmed.length / 220, 0.6, 1.15);

            return (
              <motion.div
                key={message.id}
                onPointerDown={(event) => handlePointerDown(message.id, event)}
                className="group absolute flex w-64 cursor-grab flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm text-white/80 backdrop-blur-md"
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                whileHover={{ scale: 1.025 }}
              >
                <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
                  <span>{isAssistant ? "Synapse" : "You"}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/50">
                    {importance > 1 ? "Core" : "Trace"}
                  </span>
                </div>
                <p className="text-[0.85rem] leading-relaxed text-white/80">{preview || "…"}</p>
                {activeNode === message.id && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-gradient-aurora-soft px-3 py-2 text-[0.7rem] text-white/70 shadow-accent-glow"
                  >
                    Hold ⌘ to link nodes · Drag to reorganise
                  </motion.div>
                )}
              </motion.div>
            );
          })}
          {filteredMessages.length === 0 && (
            <div className="absolute left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-white/50">
              Add messages to populate the mindmap view.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MindmapCanvas;
