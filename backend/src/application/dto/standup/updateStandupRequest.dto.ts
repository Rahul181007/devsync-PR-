export interface updateStandupRequestDTO{
    yesterday:string;
    today:string;
    blockers?:string|null;
    mood:"HAPPY" | "GOOD" | "NEUTRAL" | "STRESSED" | "BLOCKED";
}