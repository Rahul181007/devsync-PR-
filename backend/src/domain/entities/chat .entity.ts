export class ChatMessage {
    constructor(
        public readonly id: string,
        public readonly projectId: string,
        public readonly senderId: string,

        public readonly senderName: string,
        public message: string,
        public attachmentUrl: string | null,
        public attachmentType: "image" | "file" | null,
        public fileName: string | null,
        public replyToMessageId: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}