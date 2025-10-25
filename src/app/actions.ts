'use server';

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
      classrooms: classrooms.map(({id, ...rest}) => ({
        ...rest,
        type: rest.type as 'Lecture' | 'Lab',
      })),
      faculty: faculty.map(({id, ...rest}) => ({
        ...rest,
        avgLeavesPerMonth: rest.avgLeavesPerMonth || 0,
      })),
      subjects: subjects.map(({id, ...rest}) => ({
        ...rest,
        type: rest.type as 'Lecture' | 'Lab',
      })),
      studentBatches: studentBatches.map(({id, ...rest}) => ({
        ...rest,
        electiveCombinations: rest.electiveCombinations || [],
      })),
      fixedSlots: fixedSlots.map(({id, ...rest}) => rest),
    });
    return {success: true, suggestions: result.suggestions};
  } catch (error) {
    console.error('Error resolving timetable conflicts:', error);
    return {success: false, error: 'Failed to get suggestions from AI. Please ensure your Gemini API key is configured correctly in Settings.'};
  }
}

export async function generateTimetableOptions(appData: AppData) {
  const {classrooms, faculty, subjects, studentBatches, fixedSlots} = appData;
  try {
    const result = await generateTimetable({
      classrooms: classrooms.map(({id, ...rest}) => ({
        ...rest,
        type: rest.type as 'Lecture' | 'Lab',
      })),
      faculty: faculty.map(({id, ...rest}) => ({
        ...rest,
        avgLeavesPerMonth: rest.avgLeavesPerMonth || 0,
      })),
      subjects: subjects.map(({id, ...rest}) => ({
        ...rest,
        type: rest.type as 'Lecture' | 'Lab',
      })),
      studentBatches: studentBatches.map(({id, ...rest}) => ({
        ...rest,
        electiveCombinations: rest.electiveCombinations || [],
      })),
      fixedSlots: fixedSlots.map(({id, ...rest}) => rest),
    });
    return {success: true, timetableOptions: result.timetableOptions};
  } catch (error) {
    console.error('Error generating timetable:', error);
    return {success: false, error: 'Failed to generate timetable from AI. Please ensure your Gemini API key is configured correctly in Settings.'};
  }
}

export async function saveApiKey(apiKey: string) {
    if (!apiKey) {
        return { success: false, error: "API key is required." };
    }
    // In a real application, this would securely save the API key.
    // For this environment, we'll log it to show it's received.
    console.log("API Key received. In a real app, this would be saved securely.");
    return { success: true };
}
