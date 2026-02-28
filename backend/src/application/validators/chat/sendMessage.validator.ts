import {z} from "zod"

export const sendMessageSchema=z.object({
    meesage:z.string().min(1,"message cannnot be empty").max(2000,"Message too long"),
    replyToMessageId:z.string().nullable().optional()
})