export interface ChatMessage{
     id: string;
  projectId: string;
  senderId: string;
  message: string;
  replyToMessageId: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface ChatMessagesResponse {
  success: boolean;
  data: ChatMessage[];
}