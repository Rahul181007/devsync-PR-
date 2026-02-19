import { Standup } from "../entities/standup.entity";

export interface CreateStandupInput{
    projectId:string;
    companyId:string;
    sprintId:string;
    userId:string;

    standupDate:Date;

    yesterday:string;
    today:string;
    blockers:string|null;
    mood:string
}

export interface IStandupRepository{
    create(data:CreateStandupInput):Promise<Standup>

    findByUserSprintAndDate(userId:string,sprintId:string,standupDate:Date):Promise<Standup|null>;

    findBySprint(sprintId:string):Promise<Standup[]>;

     findByUserWithFilters(
  userId: string,
  filters?: {
    sprintId?: string;
    startDate?: Date;
    endDate?: Date;
  }
): Promise<Standup[]>

    update(standup:Standup):Promise<Standup>
}