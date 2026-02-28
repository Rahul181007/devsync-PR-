export interface ChatMessageResponseDTO {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  message: string;
  replyToMessageId: string | null;
  createdAt: Date;
}