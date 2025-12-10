import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet  from 'helmet';
import compression from 'compression';
import router from './router.js'

dotenv.config();

const app=express()

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

app.use('/api',router);

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

