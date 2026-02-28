
export class ChatMessage{
    constructor(
        public readonly id:string,
        public readonly projectId:string,
        public readonly senderId:string,
        public message:string,
        public replyToMessageId:string|null,
        public readonly createdAt:Date,
        public readonly updatedAt:Date
    ){}
}