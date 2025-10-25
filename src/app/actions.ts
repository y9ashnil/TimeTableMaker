"use server";

import { resolveTimetableConflicts } from "@/ai/flows/resolve-timetable-conflicts";
import { classrooms, faculty, subjects, studentBatches, fixedSlots } from "@/lib/data";

export async function getConflictResolutionSuggestions(conflicts: string[]) {
  try {
    const result = await resolveTimetableConflicts({
      conflicts,
      classrooms: classrooms.map(({id, ...rest}) => ({...rest, type: rest.type as 'Lecture' | 'Lab'})),
      faculty: faculty.map(({id, ...rest}) => ({
          ...rest,
          avgLeavesPerMonth: rest.avgLeavesPerMonth || 0,
      })),
      subjects: subjects.map(({id, ...rest}) => ({...rest, type: rest.type as 'Lecture' | 'Lab'})),
      studentBatches: studentBatches.map(({id, ...rest}) => ({
          ...rest,
          electiveCombinations: rest.electiveCombinations || [],
      })),
      fixedSlots: fixedSlots.map(({id, ...rest}) => rest),
    });
    return { success: true, suggestions: result.suggestions };
  } catch (error) {
    console.error("Error resolving timetable conflicts:", error);
    return { success: false, error: "Failed to get suggestions from AI." };
  }
}
