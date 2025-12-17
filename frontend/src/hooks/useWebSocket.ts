import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { Message } from '@/types';

export const useWebSocket = () => {
  const clientRef = useRef<Client | null>(null);
  const { user } = useAuthStore();
  const { addMessage } = useChatStore();

  const connect = useCallback(() => {
    if (!user || clientRef.current?.connected) return;

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('WebSocket Connected');

  
      client.subscribe(`/user/${user.userId}/queue/messages`, (message) => {
        const newMessage: Message = JSON.parse(message.body);
        addMessage(newMessage.senderId, newMessage);
      });


      client.subscribe(`/user/${user.userId}/queue/typing`, (message) => {
        const notification = JSON.parse(message.body);
        console.log('Typing notification:', notification);
    
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    client.activate();
    clientRef.current = client;
  }, [user, addMessage]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: Message) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(message),
      });
    }
  }, []);

  const sendTypingNotification = useCallback((receiverId: number, isTyping: boolean) => {
    if (clientRef.current?.connected && user) {
      clientRef.current.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({
          senderId: user.userId,
          receiverId,
          isTyping,
        }),
      });
    }
  }, [user]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected: clientRef.current?.connected || false,
    sendMessage,
    sendTypingNotification,
  };
};