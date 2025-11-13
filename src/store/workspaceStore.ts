import { create } from 'zustand';

export type WorkspaceView = 'chat' | 'mindmap';
export type PersonaMode = 'navigator' | 'visionary' | 'architect';
export type MoodTone = 'neutral' | 'focused' | 'energized' | 'calm';

interface ComparisonPanelState {
  messageId: string;
  headline: string;
  altResponse: string;
}

interface WorkspaceState {
  view: WorkspaceView;
  splitView: boolean;
  noteDockOpen: boolean;
  personaDockOpen: boolean;
  analyticsOpen: boolean;
  voiceEnabled: boolean;
  suggestions: string[];
  activePersona: PersonaMode;
  mood: MoodTone;
  comparisonPanel: ComparisonPanelState | null;
  toggleView: () => void;
  setView: (view: WorkspaceView) => void;
  toggleSplitView: () => void;
  toggleNoteDock: () => void;
  togglePersonaDock: () => void;
  toggleAnalytics: () => void;
  toggleVoice: () => void;
  setPersona: (persona: PersonaMode) => void;
  updateMoodFromText: (text: string) => void;
  setSuggestions: (next: string[]) => void;
  openComparison: (payload: ComparisonPanelState) => void;
  closeComparison: () => void;
}

const MOOD_KEYWORDS: Record<MoodTone, string[]> = {
  neutral: [],
  focused: ['plan', 'task', 'ship', 'deadline', 'deliverable', 'checkpoint'],
  energized: ['excited', 'amazing', 'incredible', 'wow', 'love', 'breakthrough'],
  calm: ['reflect', 'steady', 'balance', 'breath', 'calm', 'recharge'],
};

const PERSONA_SUGGESTIONS: Record<PersonaMode, string[]> = {
  navigator: [
    'Draft a mission outline',
    'Summarise the last session',
    'Highlight blockers and risks',
  ],
  visionary: [
    'Ideate three bold variations',
    'Explore adjacent opportunities',
    'Create a narrative hook',
  ],
  architect: [
    'Design a modular architecture',
    'Map data flow and dependencies',
    'List validation checkpoints',
  ],
};

const detectMood = (text: string): MoodTone => {
  const lower = text.toLowerCase();
  const matched = (Object.keys(MOOD_KEYWORDS) as MoodTone[]).find((mood) =>
    MOOD_KEYWORDS[mood].some((keyword) => lower.includes(keyword)),
  );
  return matched ?? 'neutral';
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  view: 'chat',
  splitView: false,
  noteDockOpen: true,
  personaDockOpen: true,
  analyticsOpen: false,
  voiceEnabled: false,
  suggestions: PERSONA_SUGGESTIONS.navigator,
  activePersona: 'navigator',
  mood: 'neutral',
  comparisonPanel: null,

  toggleView: () =>
    set((state) => ({ view: state.view === 'chat' ? 'mindmap' : 'chat' })),

  setView: (view) => set({ view }),

  toggleSplitView: () =>
    set((state) => ({ splitView: !state.splitView, comparisonPanel: state.splitView ? null : state.comparisonPanel })),

  toggleNoteDock: () => set((state) => ({ noteDockOpen: !state.noteDockOpen })),

  togglePersonaDock: () => set((state) => ({ personaDockOpen: !state.personaDockOpen })),

  toggleAnalytics: () => set((state) => ({ analyticsOpen: !state.analyticsOpen })),

  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),

  setPersona: (persona) =>
    set({
      activePersona: persona,
      suggestions: PERSONA_SUGGESTIONS[persona],
    }),

  updateMoodFromText: (text: string) =>
    set({ mood: detectMood(text) }),

  setSuggestions: (next) => set({ suggestions: next }),

  openComparison: (payload) =>
    set({
      splitView: true,
      comparisonPanel: payload,
    }),

  closeComparison: () =>
    set({
      splitView: false,
      comparisonPanel: null,
    }),
}));
