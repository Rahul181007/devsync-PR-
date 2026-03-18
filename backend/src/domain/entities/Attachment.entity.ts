export class TaskAttachment {
    constructor(
        public id: string,
        public taskId: string,
        public projectId: string,
        public companyId: string,
        public uploadedBy: string,
        public fileName: string,
        public fileUrl: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}