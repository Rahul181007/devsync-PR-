import express from 'express';
import cors from 'cors';
import helmet  from 'helmet';
import compression from 'compression';
import router from './router'
import { env } from './config/env';
import { connectDB } from './infrastructure/db/mongo';

const app=express()

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

app.use('/api',router);




connectDB().then(()=>{
  app.listen(env.PORT,()=>{
    console.log(`Server running on port ${env.PORT}`)
  })
})

