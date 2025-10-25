'use server';
import {config} from 'dotenv';
config();

import {resolveTimetableConflicts} from '@/ai/flows/resolve-timetable-conflicts';
import {generateTimetable} from '@/ai/flows/generate-timetable';
import type {AppData} from '@/context/AppDataContext';

export async function getConflictResolutionSuggestions(
  conflicts: string[],
  appData: AppData
) {
  const {classrooms, faculty, subjects, studentBatches, fixedSlots} = appData;
  try {
    const result = await resolveTimetableConflicts({
      conflicts,
      classrooms: classrooms.map(({id, ...rest}) => rest),
      faculty: faculty.map(({id, ...rest}) => ({
        ...rest,
        avgLeavesPerMonth: rest.avgLeavesPerMonth ?? 0,
      })),
      subjects: subjects.map(({id, ...rest}) => rest),
      studentBatches: studentBatches.map(({id, ...rest}) => ({
        ...rest,
        electiveCombinations: rest.electiveCombinations ?? [],
      })),
      fixedSlots: fixedSlots.map(({id, ...rest}) => rest),
    });
    return {success: true, suggestions: result.suggestions};
  } catch (error) {
    console.error('Error resolving timetable conflicts:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {success: false, error: `Failed to get suggestions from AI. ${errorMessage}`};
  }
}

export async function generateTimetableOptions(appData: AppData) {
  const {classrooms, faculty, subjects, studentBatches, fixedSlots} = appData;
  try {
    const result = await generateTimetable({
      classrooms: classrooms.map(({id, ...rest}) => rest),
      faculty: faculty.map(({id, ...rest}) => ({
        ...rest,
        avgLeavesPerMonth: rest.avgLeavesPerMonth ?? 0,
      })),
      subjects: subjects.map(({id, ...rest}) => rest),
      studentBatches: studentBatches.map(({id, ...rest}) => ({
        ...rest,
        electiveCombinations: rest.electiveCombinations ?? [],
      })),
      fixedSlots: fixedSlots.map(({id, ...rest}) => rest),
    });
    return {success: true, timetableOptions: result.timetableOptions};
  } catch (error) {
    console.error('Error generating timetable:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {success: false, error: `Failed to generate timetable from AI. ${errorMessage}`};
  }
}
