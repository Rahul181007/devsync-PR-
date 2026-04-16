import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet  from 'helmet';
import compression from 'compression';
import router from './router'
import { env } from './config/env';
import { connectDB } from './infrastructure/db/mongo';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { initSocketServer } from './infrastructure/websocket/socket.server';
import { AppError } from './shared/errors/AppError';
import { startMeetingReminderJob } from './infrastructure/jobs/meetingReminder.job';

const app=express()

app.use(express.json());
app.use(cors({
  origin:env.FRONTEND_URL,
  credentials:true
  
}));

app.use(cookieParser());
app.use(helmet());
app.use(compression());

app.use('/api',router);

const errorHandler: ErrorRequestHandler = (err, req, res,_next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.message,
      message: err.message,
    });
  }

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};

app.use(errorHandler);
// ✅ END


const httpServer = createServer(app);


const io=initSocketServer(httpServer);
app.set("io",io)
connectDB().then(() => {
  httpServer.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
    startMeetingReminderJob();
  });
});

