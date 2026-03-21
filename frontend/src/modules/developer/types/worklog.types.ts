export interface WorklogItem {
  id: string;

  userId: string;

  timeSpent: number; // minutes (important)
  description?: string;

  date: string;
  createdAt: string;
}


export interface UpdateWorklogPayload {
  projectId: string;
  worklogId: string;
  taskId:string
  data: {
    timeSpent?: number;
    description?: string;
    date?: string;
  };
}

