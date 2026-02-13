import amqplib from 'amqplib';
import type { Channel } from 'amqplib';
import { ENV } from './env';

export const QUEUES = {
  CLASS_IMPORT: 'class_import',
  SUBJECT_IMPORT: 'subject_import',
  ROOM_IMPORT: 'room_import',
  STUDENT_IMPORT: 'student_import',
  TEACHER_IMPORT: 'teacher_import',
  TIMETABLE_IMPORT: 'timetable_import',
} as const;

export type QueueName = typeof QUEUES[keyof typeof QUEUES];

export const ENTITY_TYPE_TO_QUEUE: Record<string, QueueName> = {
  CLASS_IMPORT: QUEUES.CLASS_IMPORT,
  SUBJECT_IMPORT: QUEUES.SUBJECT_IMPORT,
  ROOM_IMPORT: QUEUES.ROOM_IMPORT,
  STUDENT_IMPORT: QUEUES.STUDENT_IMPORT,
  TEACHER_IMPORT: QUEUES.TEACHER_IMPORT,
  TIMETABLE_IMPORT: QUEUES.TIMETABLE_IMPORT,
};

const DLX_EXCHANGE = 'dlx.exchange';
const MAX_RETRIES = 3;

function dlqName(queue: string): string {
  return `${queue}.dlq`;
}

let connection: Awaited<ReturnType<typeof amqplib.connect>> | null = null;
let channel: Channel | null = null;

export async function connectQueue(): Promise<Channel> {
  if (channel) return channel;

  const conn = await amqplib.connect(ENV.RABBITMQ_URI);
  connection = conn;
  const ch = await conn.createChannel();
  channel = ch;

  console.log(`[Queue] Connected to RabbitMQ: ${ENV.RABBITMQ_URI}`);

  await ch.assertExchange(DLX_EXCHANGE, 'direct', { durable: true });

  for (const queue of Object.values(QUEUES)) {
    await ch.assertQueue(dlqName(queue), { durable: true });
    await ch.bindQueue(dlqName(queue), DLX_EXCHANGE, queue);

    await ch.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': DLX_EXCHANGE,
        'x-dead-letter-routing-key': queue,
      },
    });
  }

  await ch.prefetch(1);

  console.log('[Queue] All queues declared successfully');

  conn.on('error', (err: Error) => {
    console.error('[Queue] RabbitMQ connection error:', err);
  });

  conn.on('close', () => {
    console.warn('[Queue] RabbitMQ connection closed');
    channel = null;
    connection = null;
  });

  return ch;
}

export async function getChannel(): Promise<Channel> {
  if (!channel) {
    return connectQueue();
  }
  return channel;
}

export async function disconnectQueue(): Promise<void> {
  if (channel) {
    await channel.close();
    channel = null;
  }
  if (connection) {
    await (connection as unknown as { close(): Promise<void> }).close();
    connection = null;
  }
  console.log('[Queue] RabbitMQ disconnected');
}

export { MAX_RETRIES };
