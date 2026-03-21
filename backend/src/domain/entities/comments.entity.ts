export class Comment{
    constructor(
        public id:string,
        public taskId:string,
        public userId:string,
        public message:string,
        public readonly createdAt:Date,
        public readonly updatedAt:Date
    ){}
}