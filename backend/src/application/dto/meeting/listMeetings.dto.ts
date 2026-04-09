export interface ListMeetingsDTO {
    projectId: string;
    page: number;
    limit: number;
    sprintId?: string | null;
}