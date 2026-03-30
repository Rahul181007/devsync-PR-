export interface ChatMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  message: string;

  attachmentUrl?: string | null;
  attachmentType?: "image" | "file" | null;
  fileName?: string | null;
  replyToMessageId: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface ChatMessagesResponse {
  success: boolean;
  data: ChatMessage[];
}