/**
 * Seed script for Sessions and Attendance data
 * Run from backend folder: bun scripts/seed-sessions-attendance.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Import existing models from the backend
import { Timetable, Student, Session, Attendance, ATTENDANCE_STATUSES, VERIFICATION_METHODS } from '../src/models';
import type { AttendanceStatus, VerificationMethod } from '../src/models';

dotenv.config({ path: path.join(__dirname, '../.env') });

if (!process.env.MONGODB_URI) {
  dotenv.config();
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ez_admin';

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQRSecret(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateLocation() {
  return {
    lat: 28.6139 + (Math.random() - 0.5) * 0.01, 
    lng: 77.2090 + (Math.random() - 0.5) * 0.01,
    altitude: 200 + Math.random() * 20,
  };
}


async function seed() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const timetables = await Timetable.find().lean();
  const students = await Student.find().lean();

  if (timetables.length === 0) {
    console.error('No timetables found. Please import timetable data first.');
    await mongoose.disconnect();
    process.exit(1);
  }

  if (students.length === 0) {
    console.error('No students found. Please import student data first.');
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`📊 Found ${timetables.length} timetables and ${students.length} students`);

  const today = new Date();
  const dates: Date[] = [];
  for (let i = 60; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d);
  }

  console.log('Creating sessions...');
  
  const sessionsToCreate: Array<{
    timetable_id: mongoose.Types.ObjectId;
    date: Date;
    is_active: boolean;
    start_time_actual?: Date;
    teacher_location_data?: { lat: number; lng: number; altitude: number };
    qr_code_secret?: string;
  }> = [];

  const dayMap: Record<string, number> = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
    'Thursday': 4, 'Friday': 5, 'Saturday': 6
  };

  // For each timetable, create sessions on matching days
  for (const timetable of timetables) {
    const timetableDayNum = dayMap[timetable.day_of_week as string];
    
    for (const date of dates) {
      if (date.getDay() === timetableDayNum) {
        // Create a session for this timetable on this date
        const isActive = date < today; // Past sessions are no longer active
        const hasActualStart = Math.random() > 0.1; // 90% have actual start times
        
        const session: typeof sessionsToCreate[0] = {
          timetable_id: timetable._id as mongoose.Types.ObjectId,
          date: date,
          is_active: !isActive, // Recent ones are active
        };

        if (hasActualStart) {
          const [hours, minutes] = (timetable.start_time as string).split(':').map(Number);
          const actualStart = new Date(date);
          actualStart.setHours(hours, minutes + randomInt(-5, 10), 0, 0);
          session.start_time_actual = actualStart;
        }

        // 80% have location data
        if (Math.random() > 0.2) {
          session.teacher_location_data = generateLocation();
        }

        // 70% have QR secrets
        if (Math.random() > 0.3) {
          session.qr_code_secret = generateQRSecret();
        }

        sessionsToCreate.push(session);
      }
    }

    // Limit to ~500 sessions
    if (sessionsToCreate.length >= 500) break;
  }

  // If we don't have enough, duplicate with different dates
  while (sessionsToCreate.length < 500 && timetables.length > 0) {
    const timetable = randomElement(timetables);
    const date = randomElement(dates);
    
    sessionsToCreate.push({
      timetable_id: timetable._id as mongoose.Types.ObjectId,
      date: date,
      is_active: Math.random() > 0.7,
      start_time_actual: new Date(date.getTime() + randomInt(8, 16) * 3600000),
      teacher_location_data: Math.random() > 0.2 ? generateLocation() : undefined,
      qr_code_secret: Math.random() > 0.3 ? generateQRSecret() : undefined,
    });
  }

  // Clear existing sessions and insert new ones
  await Session.deleteMany({});
  const insertedSessions = await Session.insertMany(sessionsToCreate.slice(0, 500));
  console.log(`✅ Created ${insertedSessions.length} sessions`);

  // ─── Create Attendance Records ────────────────────────────────────────────
  console.log('📝 Creating attendance records...');

  const STATUS_WEIGHTS = [0.75, 0.15, 0.10]; // 75% present, 15% late, 10% absent

  function weightedStatus(): AttendanceStatus {
    const r = Math.random();
    if (r < STATUS_WEIGHTS[0]) return 'Present';
    if (r < STATUS_WEIGHTS[0] + STATUS_WEIGHTS[1]) return 'Late';
    return 'Absent';
  }

  const attendanceToCreate: Array<{
    session_id: mongoose.Types.ObjectId;
    student_id: mongoose.Types.ObjectId;
    timestamp: Date;
    status: AttendanceStatus;
    verification_method: VerificationMethod;
    confidence_score?: number;
    location_verified?: boolean;
  }> = [];

  const usedPairs = new Set<string>(); // Track session+student pairs to avoid duplicates

  // For each session, create attendance for random students
  for (const session of insertedSessions) {
    const numStudents = randomInt(3, Math.min(15, students.length));
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numStudents && attendanceToCreate.length < 500; i++) {
      const student = shuffledStudents[i];
      const pairKey = `${session._id}-${student._id}`;
      
      if (usedPairs.has(pairKey)) continue;
      usedPairs.add(pairKey);

      const status = weightedStatus();
      const method = Math.random() > 0.2 ? 'Face' : 'QR_Fallback'; // 80% Face, 20% QR
      
      // Generate timestamp based on session date
      const sessionDate = new Date(session.date);
      const timestamp = new Date(sessionDate);
      timestamp.setHours(randomInt(8, 17), randomInt(0, 59), randomInt(0, 59));

      const attendance: typeof attendanceToCreate[0] = {
        session_id: session._id as mongoose.Types.ObjectId,
        student_id: student._id as mongoose.Types.ObjectId,
        timestamp: timestamp,
        status: status,
        verification_method: method,
      };

      // Add confidence score for Face verification (0.7 - 1.0)
      if (method === 'Face') {
        attendance.confidence_score = 0.7 + Math.random() * 0.3;
      }

      // 85% have location verified
      attendance.location_verified = Math.random() > 0.15;

      attendanceToCreate.push(attendance);
    }

    if (attendanceToCreate.length >= 500) break;
  }

  // Clear existing attendance and insert new ones
  await Attendance.deleteMany({});
  const insertedAttendance = await Attendance.insertMany(attendanceToCreate.slice(0, 500));
  console.log(`✅ Created ${insertedAttendance.length} attendance records`);

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log('\n📈 Summary:');
  console.log(`   Sessions: ${insertedSessions.length}`);
  console.log(`   Attendance: ${insertedAttendance.length}`);
  
  const presentCount = attendanceToCreate.filter(a => a.status === 'Present').length;
  const lateCount = attendanceToCreate.filter(a => a.status === 'Late').length;
  const absentCount = attendanceToCreate.filter(a => a.status === 'Absent').length;
  console.log(`   Present: ${presentCount}, Late: ${lateCount}, Absent: ${absentCount}`);

  await mongoose.disconnect();
  console.log('\n✅ Seeding complete!');
}

seed().catch((err) => {
  console.error(' Seeding failed:', err);
  process.exit(1);
});
