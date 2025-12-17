import { create } from 'zustand';
import { Message } from '@/types';

interface ChatState {
  conversations: Map<number, Message[]>; // userId -> messages
  activeUserId: number | null;
  unreadCount: number;
  
  setActiveUser: (userId: number) => void;
  addMessage: (userId: number, message: Message) => void;
  setMessages: (userId: number, messages: Message[]) => void;
  clearActiveUser: () => void;
  incrementUnread: () => void;
  resetUnread: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: new Map(),
  activeUserId: null,
  unreadCount: 0,

  setActiveUser: (userId) => set({ activeUserId: userId }),
  
  addMessage: (userId, message) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chatStore.ts:24',message:'addMessage called',data:{userId,messageId:message.messageId,content:message.content,senderId:message.senderId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    
    return set((state) => {
      const newConversations = new Map(state.conversations);
      const messages = newConversations.get(userId) || [];
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chatStore.ts:29',message:'Before duplicate check',data:{userId,currentMessagesCount:messages.length,newMessageId:message.messageId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      
      // Kiểm tra duplicate dựa trên messageId hoặc nội dung + thời gian
      const isDuplicate = messages.some(m => {
        // Nếu có cùng messageId (từ server)
        if (m.messageId === message.messageId && message.messageId < 1000000000000) {
          return true;
        }
        // Nếu là optimistic message và có message thật từ server với cùng nội dung
        if (typeof m.messageId === 'number' && m.messageId > 1000000000000 && 
            message.senderId === m.senderId && 
            message.receiverId === m.receiverId &&
            message.content === m.content) {
          return false; // Cho phép thay thế optimistic message
        }
        return false;
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chatStore.ts:44',message:'Duplicate check result',data:{isDuplicate},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      
      if (!isDuplicate) {
        newConversations.set(userId, [...messages, message]);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'chatStore.ts:47',message:'Message added to store',data:{userId,newMessagesCount:newConversations.get(userId)?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
      }
      
      return { conversations: newConversations };
    });
  },
  
  setMessages: (userId, messages) => set((state) => {
    const newConversations = new Map(state.conversations);
    newConversations.set(userId, messages);
    return { conversations: newConversations };
  }),

  clearActiveUser: () => set({ activeUserId: null }),

  incrementUnread: () => set((state) => ({ 
    unreadCount: state.unreadCount + 1 
  })),

  resetUnread: () => set({ unreadCount: 0 }),
}));