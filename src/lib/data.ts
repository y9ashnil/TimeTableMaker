import type { Classroom, Faculty, Subject, StudentBatch, TimetableOption, FixedSlot } from './types';

export const classrooms: Classroom[] = [
  { id: 'CR001', name: 'A101', capacity: 60, type: 'Lecture' },
  { id: 'CR002', name: 'A102', capacity: 60, type: 'Lecture' },
  { id: 'CR003', name: 'B201-Lab', capacity: 40, type: 'Lab' },
  { id: 'CR004', name: 'C301', capacity: 70, type: 'Lecture' },
];

export const faculty: Faculty[] = [
  { id: 'F001', name: 'Dr. Sharma', department: 'CSE', subjects: ['CSE101', 'CSE202'], maxClassesPerWeek: 10, maxClassesPerDay: 3, avgLeavesPerMonth: 1 },
  { id: 'F002', name: 'Prof. Rao', department: 'MAT', subjects: ['MAT102'], maxClassesPerWeek: 8, maxClassesPerDay: 2, avgLeavesPerMonth: 0 },
  { id: 'F003', name: 'Dr. Singh', department: 'CSE', subjects: ['CSE101', 'CSL101'], maxClassesPerWeek: 12, maxClassesPerDay: 4, avgLeavesPerMonth: 2 },
];

export const subjects: Subject[] = [
  { id: 'S001', subjectCode: 'CSE101', name: 'Intro to Programming', type: 'Lecture', classesRequiredPerWeek: 3 },
  { id: 'S002', subjectCode: 'MAT102', name: 'Calculus II', type: 'Lecture', classesRequiredPerWeek: 4 },
  { id: 'S003', subjectCode: 'CSL101', name: 'Programming Lab', type: 'Lab', classesRequiredPerWeek: 2 },
];

export const studentBatches: StudentBatch[] = [
  { id: 'B001', program: 'B.Tech', year: 2, department: 'CSE', batchCode: 'CSE-2A', strength: 55, electiveCombinations: ['CS-E1'] },
  { id: 'B002', program: 'B.Tech', year: 2, department: 'CSE', batchCode: 'CSE-2B', strength: 58 },
  { id: 'B003', program: 'M.Tech', year: 1, department: 'CSE', batchCode: 'CSE-M1', strength: 25, electiveCombinations: ['CS-ML-E1', 'CS-SEC-E2'] },
];

export const fixedSlots: FixedSlot[] = [
  { id: 'FS001', day: 'Tuesday', time: '11-1 PM', eventName: 'Lab Slot for CSE-2A' },
  { id: 'FS002', day: 'Friday', time: '4-5 PM', eventName: 'Seminar' },
];

export const timetableOptions: TimetableOption[] = [
  {
    id: 1,
    scores: { utilization: 85, balance: 92, conflicts: 0 },
    timetable: [
      { day: 'Monday', time: '9-10 AM', subject: 'CSE101', faculty: 'Dr. Sharma', room: 'A101', batch: 'CSE-2A' },
      { day: 'Monday', time: '10-11 AM', subject: 'MAT102', faculty: 'Prof. Rao', room: 'A102', batch: 'CSE-2A' },
      { day: 'Tuesday', time: '11-1 PM', subject: 'CSL101', faculty: 'Dr. Singh', room: 'B201-Lab', batch: 'CSE-2A' },
      { day: 'Wednesday', time: '9-10 AM', subject: 'CSE101', faculty: 'Dr. Sharma', room: 'A101', batch: 'CSE-2A' },
      { day: 'Thursday', time: '10-11 AM', subject: 'MAT102', faculty: 'Prof. Rao', room: 'A102', batch: 'CSE-2A' },
      { day: 'Friday', time: '2-3 PM', subject: 'CSE101', faculty: 'Dr. Singh', room: 'A101', batch: 'CSE-2A' },
    ]
  },
  {
    id: 2,
    scores: { utilization: 82, balance: 95, conflicts: 0 },
    timetable: [
      { day: 'Monday', time: '10-11 AM', subject: 'CSE101', faculty: 'Dr. Sharma', room: 'A101', batch: 'CSE-2A' },
      { day: 'Monday', time: '11-12 PM', subject: 'MAT102', faculty: 'Prof. Rao', room: 'A102', batch: 'CSE-2A' },
      { day: 'Tuesday', time: '2-4 PM', subject: 'CSL101', faculty: 'Dr. Singh', room: 'B201-Lab', batch: 'CSE-2A' },
      { day: 'Wednesday', time: '10-11 AM', subject: 'CSE101', faculty: 'Dr. Sharma', room: 'A101', batch: 'CSE-2A' },
      { day: 'Thursday', time: '11-12 PM', subject: 'MAT102', faculty: 'Prof. Rao', room: 'A102', batch: 'CSE-2A' },
      { day: 'Friday', time: '3-4 PM', subject: 'CSE101', faculty: 'Dr. Singh', room: 'A101', batch: 'CSE-2A' },
    ]
  }
];
