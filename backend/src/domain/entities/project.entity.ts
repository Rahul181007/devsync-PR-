export type ProjectStatus='ACTIVE'|'ARCHIVED'

export class Project {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public name: string,
    public slug: string,
    public description: string | null,
    public status: ProjectStatus,
    public startDate: Date | null,
    public endDate: Date | null,
    public currentSprintId: string | null,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}