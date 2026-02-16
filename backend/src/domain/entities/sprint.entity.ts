export type SprintStatus =
  | "PLANNED"
  | "ACTIVE"
  | "COMPLETED";

export class Sprint {
  constructor(
    public readonly id: string,

    public readonly projectId: string,
    public readonly companyId: string,

    public name: string,
    public goal: string | null,

    public startDate: Date,
    public endDate: Date,

    public status: SprintStatus,

    public readonly createdBy: string,

    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}
}
