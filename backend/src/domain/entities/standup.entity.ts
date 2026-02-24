export type StandupMood=
  | "HAPPY"
  | "GOOD"
  | "NEUTRAL"
  | "STRESSED"
  | "BLOCKED";

  export class Standup{
    constructor(
        public readonly id :string,
        public readonly projectId:string,
        public readonly companyId:string,
        public readonly sprintId:string,
        
        public readonly userId:string,

        public readonly standupDate:Date,

        public yesterday :string,
        public today:string,
        public blockers:string|null,

        public mood:StandupMood,
        public readonly createdAt:Date,
        public updatedAt:Date
    ){}
  }