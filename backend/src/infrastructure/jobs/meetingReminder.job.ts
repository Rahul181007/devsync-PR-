import cron from "node-cron";

import { MeetingModel } from "../db/models/meeting.model"; // adjust path if needed
import { NotificationModel } from "../db/models/notification.model";
import { getSocketInstance } from "../websocket/socket.instance";
import { UserModel } from "../db/models/User.model";
import { ProjectMemberModel } from "../db/models/ProjectMember.model";

export const startMeetingReminderJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Meeting reminder job running...");

    const now = new Date();
    const next10Min = new Date(now.getTime() + 10 * 60 * 1000);

    const meetings = await MeetingModel.find({
      type: "STANDUP",
      status: "SCHEDULED",
      scheduledAt: {
        $gte: now,
        $lte: next10Min,
      },
      isReminderSent: false,
    });

    for (const meeting of meetings) {
  // 1. Get project members
  const members = await ProjectMemberModel.find({
    projectId: meeting.projectId
  });

  const memberIds = members.map(m => m.userId);

  // 2. Get users
  const users = await UserModel.find({
    _id: { $in: memberIds }
  });

  // 3. Filter developers
  const developers = users.filter(u => u.role === "DEVELOPER");

  const io = getSocketInstance();

  // 4. Send notification
  for (const dev of developers) {
    const notification = await NotificationModel.create({
      userId: dev._id,
      type: "MEETING_REMINDER",
      title: "Standup Reminder",
      message: `Standup starts at ${meeting.scheduledAt.toLocaleTimeString()}`,
      metadata: {
        meetingId: meeting._id,
        projectId: meeting.projectId
      }
    });

    io.to(`user:${dev._id}`).emit("new_notification", {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      metadata: notification.metadata,
      isRead: false,
      createdAt: notification.createdAt,
    });
  }

  // 5. Mark as sent
  meeting.isReminderSent = true;
  await meeting.save();
}

    console.log("📌 Upcoming standups:", meetings.length);
  });
};