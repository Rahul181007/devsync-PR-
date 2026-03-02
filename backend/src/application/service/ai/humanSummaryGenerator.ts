import { ProjectAIMetrics } from "../../../domain/service/project-ai.service";

export interface IHumanSummaryGenerator{
     generate(metrics: ProjectAIMetrics): string 
}
export class HumanSummaryGenerator implements IHumanSummaryGenerator{
generate(metrics: ProjectAIMetrics): string {
    const {
      health,
      overdueTasks,
      upcomingTasks,
      velocity,
      completedTasks,
      totalTasks,
    } = metrics;

    const completionRate =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    let intro = "";
    let risk = "";
    let performance = "";

    switch (health) {
      case "DELAYED":
        intro =
          "The project is currently behind schedule and requires immediate attention.";
        break;
      case "AT_RISK":
        intro =
          "The project shows early warning signs and should be closely monitored.";
        break;
      default:
        intro =
          "The project is progressing steadily with a stable execution pace.";
    }

    if (overdueTasks > 0) {
      risk = `There are ${overdueTasks} overdue task(s) that need prioritization.`;
    } else if (upcomingTasks > 0) {
      risk = `${upcomingTasks} task(s) are approaching their deadlines.`;
    } else {
      risk = "There are no immediate deadline risks.";
    }

    performance = `Approximately ${completionRate}% of tasks are completed with an average velocity of ${velocity.toFixed(
      2
    )} tasks per day.`;

    return `${intro} ${risk} ${performance}`;
  }
}
