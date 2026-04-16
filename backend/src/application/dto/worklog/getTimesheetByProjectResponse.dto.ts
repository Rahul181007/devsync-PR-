export interface TimesheetProjectItemDTO {
  date: string;
  totalHours: number;
  userName: string

  tasks: {
    taskTitle: string;
    timeSpent: number;
  }[];

    meetings: {          
    title: string;
    duration: number;
  }[];

  unloggedHours: number;
}