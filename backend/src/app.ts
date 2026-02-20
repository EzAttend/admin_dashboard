import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ENV, IS_DEV, connectDatabase } from '@/config';
import { errorHandler } from '@/middleware';
import {
  classRoutes,
  subjectRoutes,
  roomRoutes,
  studentRoutes,
  teacherRoutes,
  timetableRoutes,
  jobRoutes,
} from '@/routes';
import { uploadRoutes } from '@/routes/upload.routes';
import { authRouter } from '@/routes/auth.route';
import { registerEntityConfig, startWorker } from '@/jobs/worker';
import { connectQueue } from '@/config/queue';
import {
  classEntityConfig,
  subjectEntityConfig,
  roomEntityConfig,
  studentEntityConfig,
  teacherEntityConfig,
  timetableEntityConfig,
} from '@/ingestion/entity-configs';
import type { EntityConfig } from '@/ingestion/types';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(morgan(IS_DEV ? 'dev' : 'combined'));
app.use('/api/auth', authRouter);
app.use(express.json({ limit: '10mb' }));
app.use(express.text({ type: 'text/csv', limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/upload', uploadRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

app.use(errorHandler);

async function bootstrap(): Promise<void> {
  await connectDatabase();

  // Register entity configs for CSV ingestion worker
  registerEntityConfig('CLASS_IMPORT', classEntityConfig as unknown as EntityConfig<Record<string, unknown>>);
  registerEntityConfig('SUBJECT_IMPORT', subjectEntityConfig as unknown as EntityConfig<Record<string, unknown>>);
  registerEntityConfig('ROOM_IMPORT', roomEntityConfig as unknown as EntityConfig<Record<string, unknown>>);
  registerEntityConfig('STUDENT_IMPORT', studentEntityConfig as unknown as EntityConfig<Record<string, unknown>>);
  registerEntityConfig('TEACHER_IMPORT', teacherEntityConfig as unknown as EntityConfig<Record<string, unknown>>);
  registerEntityConfig('TIMETABLE_IMPORT', timetableEntityConfig as unknown as EntityConfig<Record<string, unknown>>);

  try {
    await connectQueue();
    await startWorker();
    console.log('[Server] RabbitMQ workers started');
  } catch (err) {
    console.warn('[Server] RabbitMQ unavailable — CSV import workers disabled:', (err as Error).message);
  }

  app.listen(ENV.PORT, () => {
    console.log(`[Server] Running on http://localhost:${ENV.PORT} (${ENV.NODE_ENV})`);
  });
}

bootstrap().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});

export default app;
