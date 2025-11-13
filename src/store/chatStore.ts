import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import type { ChatModelOption } from '@/lib/data';
import { chatModels } from '@/lib/data';

import { useWorkspaceStore } from './workspaceStore';

export type Role = 'user' | 'assistant' | 'system';
export type MessageStatus = 'streaming' | 'complete';
export type MessageReaction = 'like' | 'dislike' | null;

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  status?: MessageStatus;
  reaction?: MessageReaction;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  lastUpdated: number;
  pinned: boolean;
  model: ChatModelOption['id'];
  messages: Message[];
}

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  sidebarOpen: boolean;
  // actions
  newConversation: (initialUserMsg?: string) => string;
  setActive: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  toggleSidebar: () => void;
  togglePin: (id: string) => void;
  setModelForConversation: (id: string, model: ChatModelOption['id']) => void;
  reactToMessage: (conversationId: string, messageId: string, reaction: MessageReaction) => void;
  regenerateResponse: (conversationId: string, messageId: string) => void;
}

function summarizeTitle(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return 'New chat';
  const firstLine = trimmed.split('\n')[0];
  return firstLine.length > 48 ? `${firstLine.slice(0, 45)}…` : firstLine;
}

const sortConversations = (list: Conversation[]) =>
  [...list].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.lastUpdated - a.lastUpdated;
  });

const buildMockReply = (prompt: string, model: ChatModelOption['id']) => {
  const headline = prompt.length > 120 ? `${prompt.slice(0, 110)}…` : prompt;
  const tone =
    model === 'synapse-precision'
      ? 'crisp, source-linked summary'
      : model === 'synapse-lite'
      ? 'rapid actionable notes'
      : 'exploratory strategy outline';

  return `### ${tone.charAt(0).toUpperCase()}${tone.slice(1)}
- Core focus: ${headline || 'Outline next steps clearly.'}
- Key insight: Surface patterns, blockers, and fast wins.
- Deliverable: Provide share-ready notes with follow-up actions.

**Next steps**
1. Highlight risks & decisions.
2. Offer 2 alternative paths.
3. Keep trackable checkpoints for the team.
`;
};

export const useChatStore = create<ChatState>((set, get) => {
  const streamAssistantResponse = (
    conversationId: string,
    messageId: string,
    response: string,
  ) => {
  const characters = Array.from(response);
    let index = 0;
    const step = 3;

    const pushChunk = () => {
      const nextIndex = Math.min(index + step, characters.length);

      set((state) => ({
        conversations: state.conversations.map((conversation) => {
          if (conversation.id !== conversationId) return conversation;
          const messages = conversation.messages.map((message) => {
            if (message.id !== messageId) return message;
            const content = characters.slice(0, nextIndex).join('');
            const status: MessageStatus = nextIndex >= characters.length ? 'complete' : 'streaming';
            return {
              ...message,
              content,
              status,
            };
          });
          return {
            ...conversation,
            messages,
            lastUpdated: Date.now(),
          };
        }),
      }));

      index = nextIndex;
      if (nextIndex < characters.length) {
        setTimeout(pushChunk, 24);
      } else {
        useWorkspaceStore.getState().updateMoodFromText(response);
      }
    };

    pushChunk();
  };

  const defaultConversation: Conversation = {
    id: nanoid(),
    title: 'Welcome to SynapseAI',
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    pinned: true,
    model: chatModels[0].id,
    messages: [
      {
        id: nanoid(),
        role: 'assistant',
        content:
          "Hey! I'm your AI copilot. Ask me anything or paste code—I'll explain, refactor, or write tests.",
        createdAt: Date.now(),
        status: 'complete',
      },
    ],
  };

  return {
    conversations: [defaultConversation],
    activeId: defaultConversation.id,
    sidebarOpen: true,

    newConversation: (initialUserMsg?: string) => {
      const id = nanoid();
      const now = Date.now();
      const messageList = initialUserMsg
        ? [
            {
              id: nanoid(),
              role: 'user' as const,
              content: initialUserMsg,
              createdAt: now,
            },
          ]
        : [];

      const conversation: Conversation = {
        id,
        title: summarizeTitle(initialUserMsg || 'New chat'),
        createdAt: now,
        lastUpdated: now,
        pinned: false,
        model: chatModels[0].id,
        messages: messageList,
      };

      set((state) => ({
        conversations: sortConversations([conversation, ...state.conversations]),
        activeId: id,
      }));

      return id;
    },

    setActive: (id: string) => set({ activeId: id }),

    sendMessage: async (rawContent: string) => {
      const content = rawContent.trim();
      if (!content) return;

      const state = get();
      let activeId = state.activeId;

      if (!activeId) {
        activeId = state.newConversation(content);
      }

  const conversation = get().conversations.find((c) => c.id === activeId);
  if (!conversation) return;

  useWorkspaceStore.getState().updateMoodFromText(content);

      const now = Date.now();
      const assistantId = nanoid();

      set((prev) => ({
        conversations: sortConversations(
          prev.conversations.map((c) => {
            if (c.id !== activeId) return c;
            const updatedTitle = c.messages.length === 0 ? summarizeTitle(content) : c.title;
            return {
              ...c,
              title: updatedTitle,
              messages: [
                ...c.messages,
                { id: nanoid(), role: 'user', content, createdAt: now },
                {
                  id: assistantId,
                  role: 'assistant',
                  content: '',
                  createdAt: now,
                  status: 'streaming',
                },
              ],
              lastUpdated: now,
            };
          }),
        ),
      }));

      const mock = buildMockReply(content, conversation.model);
      streamAssistantResponse(activeId, assistantId, mock);
    },

    renameConversation: (id: string, title: string) =>
      set((state) => ({
        conversations: sortConversations(
          state.conversations.map((conversation) =>
            conversation.id === id
              ? {
                  ...conversation,
                  title: title.trim() || conversation.title,
                  lastUpdated: Date.now(),
                }
              : conversation,
          ),
        ),
      })),

    deleteConversation: (id: string) =>
      set((state) => {
        const filtered = state.conversations.filter((conversation) => conversation.id !== id);
        const nextActive = filtered.length ? filtered[0].id : null;
        return {
          conversations: filtered,
          activeId: nextActive,
        };
      }),

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    togglePin: (id: string) =>
      set((state) => ({
        conversations: sortConversations(
          state.conversations.map((conversation) =>
            conversation.id === id
              ? {
                  ...conversation,
                  pinned: !conversation.pinned,
                  lastUpdated: Date.now(),
                }
              : conversation,
          ),
        ),
      })),

    setModelForConversation: (id: string, model: ChatModelOption['id']) =>
      set((state) => ({
        conversations: state.conversations.map((conversation) =>
          conversation.id === id
            ? {
                ...conversation,
                model,
                lastUpdated: Date.now(),
              }
            : conversation,
        ),
      })),

    reactToMessage: (conversationId: string, messageId: string, reaction: MessageReaction) =>
      set((state) => ({
        conversations: state.conversations.map((conversation) => {
          if (conversation.id !== conversationId) return conversation;
          return {
            ...conversation,
            messages: conversation.messages.map((message) =>
              message.id === messageId
                ? {
                    ...message,
                    reaction: message.reaction === reaction ? null : reaction,
                  }
                : message,
            ),
          };
        }),
      })),

    regenerateResponse: (conversationId: string, messageId: string) => {
      const conversation = get().conversations.find((c) => c.id === conversationId);
      if (!conversation) return;

      const assistantIdx = conversation.messages.findIndex((msg) => msg.id === messageId);
      if (assistantIdx === -1) return;

      const lastUser = [...conversation.messages]
        .slice(0, assistantIdx)
        .reverse()
        .find((msg) => msg.role === 'user');

      if (!lastUser) return;

      const now = Date.now();
      const assistantId = nanoid();

      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: assistantId,
                    role: 'assistant',
                    content: '',
                    createdAt: now,
                    status: 'streaming',
                  },
                ],
                lastUpdated: now,
              }
            : c,
        ),
      }));

  const refreshed = `${buildMockReply(lastUser.content, conversation.model)}
_Regenerated with updated context._`;
      streamAssistantResponse(conversationId, assistantId, refreshed);
    },
  };
});
