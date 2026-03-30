export interface SendMessageRequestDTO {
    message: string;
    replyToMessageId?: string | null;

    file?: Buffer;
    fileName?: string;
    mimeType?: string;
}