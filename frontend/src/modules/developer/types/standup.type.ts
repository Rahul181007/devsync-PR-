export type StandupMood =
    | "HAPPY"
    | "GOOD"
    | "NEUTRAL"
    | "STRESSED"
    | "BLOCKED";

export interface DeveloperStandup {
    id: string;
    projectId: string;
    companyId: string;
    sprintId: string;
    userId: string;
    standupDate: string;

    yesterday: string;
    today: string;
    blockers: string | null;
    mood: StandupMood;
    createdAt: string;
    updatedAt: string;
}

export interface DeveloperStandupResponse{
    sprintId:string;
    sprintStatus:string;
    todayStandup:DeveloperStandup|null;
    history:DeveloperStandup[]
}