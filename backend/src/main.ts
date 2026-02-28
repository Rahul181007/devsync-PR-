import express from 'express';
import cors from 'cors';
import helmet  from 'helmet';
import compression from 'compression';
import router from './router'
import { env } from './config/env';
import { connectDB } from './infrastructure/db/mongo';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { initSocketServer } from './infrastructure/websocket/socket.server';

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

// 🔥 Create HTTP server
const httpServer = createServer(app);

// 🔥 Initialize socket
initSocketServer(httpServer);

connectDB().then(() => {
  httpServer.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
});

