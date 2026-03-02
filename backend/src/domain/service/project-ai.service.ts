import { Task } from "../entities/task.entity";

export type ProjectHealth =
  | "ON_TRACK"
  | "AT_RISK"
  | "DELAYED";

export interface ProjectAIMetrics {
  health: ProjectHealth;

  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;

  overdueTasks: number;
  upcomingTasks: number;

  velocity: number;
}

export interface IProjectAIService {
  generateSummary(params: {
    tasks: Task[];
    currentDate: Date;
  }): ProjectAIMetrics;
}

export class ProjectAIService implements IProjectAIService {
  generateSummary(params: {
    tasks: Task[];
    currentDate: Date;
  }): ProjectAIMetrics {
    const { tasks, currentDate } = params;

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;

    const pendingTasks = totalTasks - completedTasks;

    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;

      return (
        task.status !== "COMPLETED" &&
        task.dueDate.getTime() < currentDate.getTime()
      );
    }).length;

    const threeDaysLater = new Date(currentDate);
    threeDaysLater.setDate(currentDate.getDate() + 3);

    const upcomingTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;

      return (
        task.status !== "COMPLETED" &&
        task.dueDate.getTime() >= currentDate.getTime() &&
        task.dueDate.getTime() <= threeDaysLater.getTime()
      );
    }).length;

    // Velocity (completed in last 7 days)
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const completedLast7Days = tasks.filter((task) => {
      return (
        task.status === "COMPLETED" &&
        task.updatedAt.getTime() >= sevenDaysAgo.getTime()
      );
    }).length;

    const velocity = Number(
      (completedLast7Days / 7).toFixed(2)
    );

    const health = this.calculateHealth({
      overdueTasks,
      pendingTasks,
      totalTasks,
    });

    return {
      health,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      upcomingTasks,
      velocity,
    };
  }

  private calculateHealth(params: {
    overdueTasks: number;
    pendingTasks: number;
    totalTasks: number;
  }): ProjectHealth {
    const { overdueTasks, totalTasks } = params;

    if (overdueTasks > 3) return "DELAYED";
    if (overdueTasks > 0) return "AT_RISK";

    if (totalTasks === 0) return "ON_TRACK";

    return "ON_TRACK";
  }
}