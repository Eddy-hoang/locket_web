// Polyfills for SockJS in Vite
import { Buffer } from "buffer";
(window as any).global = window;
(window as any).Buffer = Buffer;

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_URL } from "./constants";

let client: Client | null = null;
let currentUserId: number | null = null;
let messageCallback: ((msg: any) => void) | null = null;

export const connectSocket = (token: string, userId: number, onMessage: any) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:12',message:'connectSocket called',data:{userId,currentUserId,hasClient:!!client,isConnected:client?.connected},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H5'})}).catch(()=>{});
  // #endregion
  
  // Nếu đã connected với cùng userId, chỉ cập nhật callback
  if (client && client.connected && currentUserId === userId) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:17',message:'WebSocket already connected, updating callback only',data:{userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
    messageCallback = onMessage;
    return;
  }
  
  // Disconnect existing connection if any
  if (client) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:24',message:'Disconnecting existing WebSocket',data:{currentUserId,newUserId:userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
    client.deactivate();
    client = null;
  }
  
  currentUserId = userId;
  messageCallback = onMessage;

  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      console.log("WebSocket connected!");
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:24',message:'WebSocket connected',data:{userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion

      // Subscribe to per-user queue; Spring resolves /user based on Principal
      client?.subscribe(`/user/queue/messages`, (payload) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:30',message:'WebSocket message received in subscription',data:{userId,payloadBody:payload.body,hasCallback:!!messageCallback},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        
        try {
          const message = JSON.parse(payload.body);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:34',message:'Calling onMessage callback',data:{message,userId,hasCallback:!!messageCallback},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H2'})}).catch(()=>{});
          // #endregion
          if (messageCallback) {
            messageCallback(message);
          }
        } catch (error) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:40',message:'Error parsing WebSocket message',data:{error:String(error),payloadBody:payload.body},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H2'})}).catch(()=>{});
          // #endregion
          console.error("Error parsing message:", error);
        }
      });
    },
    onDisconnect: () => {
      console.log("WebSocket disconnected");
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:36',message:'WebSocket disconnected',data:{userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
    },
    onStompError: (frame) => {
      console.error("STOMP error:", frame);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  client.activate();
};

export const sendWsMessage = (data: any) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:50',message:'sendWsMessage called',data:{hasClient:!!client,isConnected:client?.connected,data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
  
  if (!client || !client.connected) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:53',message:'WebSocket not connected - early return',data:{hasClient:!!client,isConnected:client?.connected},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    console.error("WebSocket not connected");
    return;
  }

  try { 
    console.log("SEND WS:", data);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:60',message:'Publishing message via WebSocket',data:{destination:'/app/chat.send',data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    
    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(data),
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:67',message:'Message published successfully',data:{destination:'/app/chat.send'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a3a9f3c1-fe35-4e36-b706-fed17edad5c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'socket.ts:70',message:'Error publishing message',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    console.error("Error sending message:", error);
  }
};

export const disconnectSocket = () => {
  if (client) {
    client.deactivate();
    client = null;
  }
};
