export class Worklog{
    constructor(
        public readonly id:string,
        public companyId:string,
        public projectId:string,
        public taskId:string,
        public userId:string,
        public timeSpent:number,
        public date:Date,
        public readonly createdAt:Date,
        public readonly updatedAt:Date,
        public description?:string,
    ){}
}