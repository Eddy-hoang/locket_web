import { create } from "zustand";
import { Message } from "@/types";

interface ChatState {
  conversations: Map<number, Message[]>; // otherUserId -> messages
  activeUserId: number | null;
  unreadCount: number;

  setActiveUser: (userId: number) => void;
  addMessage: (userId: number, message: Message) => void;
  setMessages: (userId: number, messages: Message[]) => void;
  clearActiveUser: () => void;
  incrementUnread: () => void;
  resetUnread: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: new Map(),
  activeUserId: null,
  unreadCount: 0,

  setActiveUser: (userId) => set({ activeUserId: userId }),

  addMessage: (userId, message) =>
    set((state) => {
      const newConversations = new Map(state.conversations);
      const messages = newConversations.get(userId) || [];

      newConversations.set(userId, [...messages, message]);

      return { conversations: newConversations };
    }),

  setMessages: (userId, messages) =>
    set((state) => {
      const newConversations = new Map(state.conversations);
      newConversations.set(userId, messages);
      return { conversations: newConversations };
    }),

  clearActiveUser: () => set({ activeUserId: null }),

  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),

  resetUnread: () => set({ unreadCount: 0 }),
}));
