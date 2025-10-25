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
  studentBatches: z
    .array(
      z.object({
        program: z.string(),
        year: z.number(),
        department: z.string(),
        batchCode: z.string(),
        strength: z.number(),
        electiveCombinations: z.array(z.string()),
      })
    )
    .describe('A list of student batches and their details.'),
  fixedSlots: z
    .array(
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
  prompt: `You are an AI assistant specialized in resolving timetable conflicts for universities.

  Given the following timetable conflicts and university data, suggest potential rearrangements to resolve the conflicts.  
  Consider moving classes to different time slots or rooms. Provide specific and actionable suggestions. Do not provide suggestions which violate any existing constraints.

  Conflicts: {{{json conflicts}}}
  
  Available Data:
  - Classrooms: {{{json classrooms}}}
  - Faculty: {{{json faculty}}}
  - Subjects: {{{json subjects}}}
  - Student Batches: {{{json studentBatches}}}
  - Fixed Slots: {{{json fixedSlots}}}
  `,
});

const resolveTimetableConflictsFlow = ai.defineFlow(
  {
    name: 'resolveTimetableConflictsFlow',
    inputSchema: ResolveTimetableConflictsInputSchema,
    outputSchema: ResolveTimetableConflictsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get suggestions: AI returned no output.');
    }
    return output;
  }
);
