export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: 'Lecture' | 'Lab';
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  subjects: string[];
  maxClassesPerWeek: number;
  maxClassesPerDay: number;
  avgLeavesPerMonth?: number;
}

export interface Subject {
  id: string;
  subjectCode: string;
  name: string;
  type: 'Lecture' | 'Lab';
  classesRequiredPerWeek: number;
}

export interface StudentBatch {
  id: string;
  program: string;
  year: number;
  department: string;
  batchCode: string;
  strength: number;
  electiveCombinations?: string[];
}

export interface FixedSlot {
  id: string;
  day: string;
  time: string;
  eventName: string;
}

export interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  batch: string;
}

export interface TimetableOption {
  id: number;
  timetable: TimetableEntry[];
  scores: {
    utilization: number;
    balance: number;
    conflicts: number;
  };
}
