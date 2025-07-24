// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import connectDB from './config/database';
import authRoutes from './routes/auth.route';
import fileUploadRoutes from './routes/file-upload.route';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import './config/passport';
import swaggerUi from 'swagger-ui-express';
import cors from "cors";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
}))
app.use(passport.initialize());
connectDB();

const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, '../swagger.yaml'), 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRoutes);
app.use('/api/file', fileUploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));