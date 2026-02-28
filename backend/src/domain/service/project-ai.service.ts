import { Task } from "../entities/task.entity";

export type ProjectHealth =
    | "ON_TRACK"
    | "AT_RISK"
    | "DELAYED";

export interface ProjectAISummary {
    health: ProjectHealth;

    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;

    overdueTasks: number;
    upcomingTasks: number;

    velocity: number;
    summary: string;
}

export interface IProjectAIService {
    generateSummary(params: {
        tasks: Task[];
        currentDate: Date
    }): ProjectAISummary
}


export class ProjectAIService implements IProjectAIService {
    generateSummary(params: { tasks: Task[]; currentDate: Date; }): ProjectAISummary {
        const { tasks, currentDate } = params;
        const totalTasks = tasks.length;

        const completedTasks = tasks.filter((task) => task.status === "COMPLETED").length;

        const pendingTasks = totalTasks - completedTasks;

        const overdueTasks = tasks.filter((task) => {
            if (!task.dueDate) return false;
            return (
                task.status !== "COMPLETED" && task.dueDate.getTime() < currentDate.getTime()
            )
        }).length

        const threeDaysLater = new Date(currentDate);
        threeDaysLater.setDate(currentDate.getDate() + 3)

        const upcomingTasks = tasks.filter((task) => {
            if (!task.dueDate) return false;
            return (
                task.status !== "COMPLETED" &&
                task.dueDate.getTime() >= currentDate.getTime() &&
                task.dueDate.getTime() <= threeDaysLater.getTime()
            )
        }).length;

        //velocity(completed in last 7 days)

        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 7);

        const completedLast7Days = tasks.filter((task) => {
            return (
                task.status === "COMPLETED" &&
                task.updatedAt.getTime() >= sevenDaysAgo.getTime()
            )
        }).length

        const velocity = Number((completedLast7Days / 7).toFixed(2));

        const health = this.calculateHealth({
            overdueTasks,
            pendingTasks,
            totalTasks
        })

        const summary = this.generateSummaryMessage({
            health,
            overdueTasks,
            upcomingTasks,
            velocity
        })

        return {
            health,
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            upcomingTasks,
            velocity,
            summary
        }
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

      private generateSummaryMessage(params: {
    health: ProjectHealth;
    overdueTasks: number;
    upcomingTasks: number;
    velocity: number;
  }): string {
    const { health, overdueTasks, upcomingTasks, velocity } = params;

    if (health === "DELAYED") {
      return `Project is delayed. ${overdueTasks} tasks are overdue. Immediate attention is required.`;
    }

    if (health === "AT_RISK") {
      return `Project is at risk. ${overdueTasks} tasks are overdue and ${upcomingTasks} tasks are due soon.`;
    }

    return `Project is on track. ${upcomingTasks} tasks are due soon. Current velocity is ${velocity} tasks/day.`;
  }
}