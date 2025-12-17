import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { messageApi } from "@/api/message.api";
import { userApi } from "@/api/user.api";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { Message } from "@/types";

import { MessageItem } from "@/components/chat/MessageItem";
import { Avatar } from "@/components/ui/Avatar";
import { User } from "@/types";
import { connectSocket, sendWsMessage } from "@/utils/socket";

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.user);
  const { conversations, setMessages, addMessage } = useChatStore();

  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const photoId = (location.state as any)?.photoId; // For photo reply
  const messages = conversations.get(Number(userId)) || [];

  useEffect(() => {
    if (!currentUser) return;

    const token = useAuthStore.getState().token;
    if (!token) return;

    connectSocket(token, currentUser.userId, (msg: Message) => {
      addMessage(Number(userId), msg);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    loadUserInfo();
    loadMessages();
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadUserInfo = async () => {
    try {
      const user = await userApi.getUserById(Number(userId));
      setOtherUser(user);
    } catch (error) {
      console.error("Load user failed:", error);
    }
  };

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const res = await messageApi.getConversation(Number(userId));
      setMessages(Number(userId), res.data.data);
    } catch (error) {
      console.error("Load messages failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;

    const messageContent = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      sendWsMessage({
        receiverId: Number(userId),
        content: inputText,
        messageType: photoId ? "PHOTO_REPLY" : "NORMAL",
        refPhotoId: photoId,
      });
    } catch (error) {
      console.error("Send message failed:", error);
      setInputText(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {otherUser && (
          <>
            <Avatar src={otherUser.avatar} size="md" />
            <div>
              <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
              <p className="text-xs text-gray-500">Đang hoạt động</p>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center px-6">
            <div>
              <p className="text-gray-500 mb-2">Chưa có tin nhắn</p>
              <p className="text-sm text-gray-400">
                Gửi tin nhắn đầu tiên để bắt đầu trò chuyện
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageItem key={message.messageId} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="flex-1 resize-none border rounded-2xl px-4 py-2 max-h-32 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={1}
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isSending}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
