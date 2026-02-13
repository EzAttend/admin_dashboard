// Common
export { objectIdSchema, timeSchema, idParamSchema } from './common.schema';

// Entity schemas
export { createStudentSchema, updateStudentSchema } from './student.schema';
export type { CreateStudentInput, UpdateStudentInput } from './student.schema';

export { createTeacherSchema, updateTeacherSchema } from './teacher.schema';
export type { CreateTeacherInput, UpdateTeacherInput } from './teacher.schema';

export { createClassSchema, updateClassSchema } from './class.schema';
export type { CreateClassInput, UpdateClassInput } from './class.schema';

export { createSubjectSchema, updateSubjectSchema } from './subject.schema';
export type { CreateSubjectInput, UpdateSubjectInput } from './subject.schema';

export { createRoomSchema, updateRoomSchema } from './room.schema';
export type { CreateRoomInput, UpdateRoomInput } from './room.schema';

export { createTimetableSchema, updateTimetableSchema } from './timetable.schema';
export type { CreateTimetableInput, UpdateTimetableInput } from './timetable.schema';
