export class Meeting {
    constructor(
        public readonly id: string,
        public readonly projectId: string,
        public readonly createdBy: string,
        public readonly sprintId: string | null,
        public title: string,
        public description: string | null,

        public scheduledAt: Date,
        public durationMinutes: number | null,

        public meetingLink: string | null,
        public meetingType: "GOOGLE_MEET" | "ZOOM" | "TEAMS" | "OTHER" | null,
        public  type: "SPRINT_PLANNING" | "SPRINT_REVIEW" | "STANDUP" | "GENERAL",


        public notes: string | null,        
        public decisions: string | null,

        public status: "SCHEDULED" | "COMPLETED" | "CANCELLED",
        public isReminderSent: boolean,

        public readonly createdAt: Date,
        public readonly updatedAt: Date


    ) { }
}