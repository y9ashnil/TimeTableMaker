'use server';

/**
 * @fileOverview An AI-powered tool to suggest potential rearrangements to resolve timetable conflicts.
 *
 * - resolveTimetableConflicts - A function that handles the conflict resolution process.
 * - ResolveTimetableConflictsInput - The input type for the resolveTimetableConflicts function.
 * - ResolveTimetableConflictsOutput - The return type for the resolveTimetableConflicts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResolveTimetableConflictsInputSchema = z.object({
  conflicts: z
    .array(z.string())
    .describe('A list of timetable conflicts that need to be resolved.'),
  classrooms: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        capacity: z.number(),
        type: z.enum(['Lecture', 'Lab']),
      })
    )
    .describe('A list of available classrooms and their details.'),
  faculty: z
    .array(
      z.object({
        name: z.string(),
        department: z.string(),
        subjects: z.array(z.string()),
        maxClassesPerWeek: z.number(),
        maxClassesPerDay: z.number(),
        avgLeavesPerMonth: z.number(),
      })
    )
    .describe('A list of faculty members and their details.'),
  subjects: z
    .array(
      z.object({
        subjectCode: z.string(),
        name: z.string(),
        type: z.enum(['Lecture', 'Lab']),
        classesRequiredPerWeek: z.number(),
      })
    )
    .describe('A list of subjects and their details.'),
  studentBatches:
    z.array(
      z.object({
        program: z.string(),
        year: z.number(),
        department: z.string(),
        batchCode: z.string(),
        strength: z.number(),
        electiveCombinations: z.array(z.string()).optional(),
      })
    )
    .describe('A list of student batches and their details.'),
  fixedSlots:
    z.array(
      z.object({
        day: z.string(),
        time: z.string(),
        eventName: z.string(),
      })
    )
    .describe('A list of fixed time slots and their details.'),
});

export type ResolveTimetableConflictsInput = z.infer<
  typeof ResolveTimetableConflictsInputSchema
>;

const ResolveTimetableConflictsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of suggestions to resolve the timetable conflicts, such as moving classes to different slots or rooms.'
    ),
});

export type ResolveTimetableConflictsOutput = z.infer<
  typeof ResolveTimetableConflictsOutputSchema
>;

export async function resolveTimetableConflicts(
  input: ResolveTimetableConflictsInput
): Promise<ResolveTimetableConflictsOutput> {
  return resolveTimetableConflictsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resolveTimetableConflictsPrompt',
  input: {schema: ResolveTimetableConflictsInputSchema},
  output: {schema: ResolveTimetableConflictsOutputSchema},
  prompt: `You are an AI assistant specialized in resolving timetable conflicts for universities.\n\n  Given the following timetable conflicts, available classrooms, faculty, subjects, student batches, and fixed slots, suggest potential rearrangements to resolve the conflicts.  Consider moving classes to different time slots or rooms. Provide specific and actionable suggestions. Do not provide suggestions which violate any existing constraints.\n\n  Conflicts:\n  {{#each conflicts}}- {{{this}}}{{\each}}\n\n  Classrooms:\n  {{#each classrooms}}- ID: {{id}}, Name: {{name}}, Capacity: {{capacity}}, Type: {{type}}{{\each}}\n\n  Faculty:\n  {{#each faculty}}- Name: {{name}}, Department: {{department}}, Subjects: {{subjects}}, Max Classes Per Week: {{maxClassesPerWeek}}, Max Classes Per Day: {{maxClassesPerDay}}, Avg Leaves Per Month: {{avgLeavesPerMonth}}{{\each}}\n\n  Subjects:\n  {{#each subjects}}- Subject Code: {{subjectCode}}, Name: {{name}}, Type: {{type}}, Classes Required Per Week: {{classesRequiredPerWeek}}{{\each}}\n\n  Student Batches:\n  {{#each studentBatches}}- Program: {{program}}, Year: {{year}}, Department: {{department}}, Batch Code: {{batchCode}}, Strength: {{strength}}, Elective Combinations: {{electiveCombinations}}{{\each}}\n\n  Fixed Slots:\n  {{#each fixedSlots}}- Day: {{day}}, Time: {{time}}, Event Name: {{eventName}}{{\each}}\n  `,
});

const resolveTimetableConflictsFlow = ai.defineFlow(
  {
    name: 'resolveTimetableConflictsFlow',
    inputSchema: ResolveTimetableConflictsInputSchema,
    outputSchema: ResolveTimetableConflictsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
