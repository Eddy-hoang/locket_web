import { Buffer } from "buffer";
(window as any).global = window;
(window as any).Buffer = Buffer;

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_URL } from "./constants";

let client: Client | null = null;
let currentUserId: number | null = null;
let messageCallback: ((msg: any) => void) | null = null;

export const connectSocket = (
  token: string,
  userId: number,
  onMessage: (msg: any) => void
) => {
  if (client && client.connected && currentUserId === userId) {
    messageCallback = onMessage;
    return;
  }

  if (client) {
    client.deactivate();
    client = null;
  }

  currentUserId = userId;
  messageCallback = onMessage;

  client = new Client({
    webSocketFactory: () =>
      new SockJS(`${WS_URL}?token=${token}`), 
    onConnect: () => {
      console.log("WebSocket connected!");

      client?.subscribe("/user/queue/messages", (payload) => {
        try {
          const message = JSON.parse(payload.body);
          messageCallback?.(message);
        } catch (err) {
          console.error("Parse WS message error:", err);
        }
      });
    },
    onDisconnect: () => {
      console.log("WebSocket disconnected");
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame);
    },
    reconnectDelay: 5000,
  });

  client.activate();
};

export const sendWsMessage = (data: any) => {
  if (!client || !client.connected) {
    console.error("WebSocket not connected");
    return;
  }

  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(data),
  });
};

export const disconnectSocket = () => {
  if (client) {
    client.deactivate();
    client = null;
  }
};
