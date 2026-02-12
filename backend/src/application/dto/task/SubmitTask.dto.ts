export interface SubmitTaskDTO{
    summary:string;
    workDone:string;
    blockers?:string|null
}