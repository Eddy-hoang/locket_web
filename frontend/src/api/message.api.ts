import api from "./axios.config";

export const messageApi = {
  getConversation: (userId: number) =>
    api.get(`/message/conversation/${userId}`),

  getMessagesWithUser: (userId: number) =>
    api.get(`/message/conversation/${userId}?page=0&size=50`),

  markRead: (messageId: number) =>
    api.post(`/message/read/${messageId}`),

  sendMessage: (data: {
    receiverId: number;
    content: string;
    messageType: string;
    refPhotoId?: number | null;
  }) =>
    api.post(`/message/send`, data),
};
