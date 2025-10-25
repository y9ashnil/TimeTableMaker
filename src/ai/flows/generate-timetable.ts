'use server';

/**
 * @fileOverview An AI-powered tool to generate timetable options.
 *
 * - generateTimetable - A function that handles the timetable generation process.
 * - GenerateTimetableInput - The input type for the generateTimetable function.
 * - GenerateTimetableOutput - The return type for the generateTimetable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTimetableInputSchema = z.object({
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

export type GenerateTimetableInput = z.infer<
  typeof GenerateTimetableInputSchema
>;

const TimetableEntrySchema = z.object({
  day: z.string(),
  time: z.string(),
  subject: z.string(),
  faculty: z.string(),
  room: z.string(),
  batch: z.string(),
});

const TimetableOptionSchema = z.object({
  id: z.number(),
  scores: z.object({
    utilization: z.number(),
    balance: z.number(),
    conflicts: z.number(),
  }),
  timetable: z.array(TimetableEntrySchema),
});

const GenerateTimetableOutputSchema = z.object({
  timetableOptions: z
    .array(TimetableOptionSchema)
    .describe('A list of generated timetable options.'),
});

export type GenerateTimetableOutput = z.infer<
  typeof GenerateTimetableOutputSchema
>;

export async function generateTimetable(
  input: GenerateTimetableInput
): Promise<GenerateTimetableOutput> {
  return generateTimetableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTimetablePrompt',
  input: {schema: GenerateTimetableInputSchema},
  output: {schema: GenerateTimetableOutputSchema},
  prompt: `You are an AI assistant specialized in generating university timetables.
  
  Generate 2 timetable options based on the provided data.
  
  Constraints & Data:
  - Classrooms: {{{json classrooms}}}
  - Faculty: {{{json faculty}}}
  - Subjects: {{{json subjects}}}
  - Student Batches: {{{json studentBatches}}}
  - Fixed Slots: {{{json fixedSlots}}}

  Instructions:
  1. Create two distinct timetable options.
  2. For each option, generate a schedule as an array of timetable entries.
  3. For each option, provide scores for classroom utilization (percentage), faculty load balance (percentage), and number of conflicts (should be 0).
  4. Ensure that the generated timetables do not have any conflicts.
  5. Adhere to all constraints like classroom capacity, faculty availability, and subject requirements.
  `,
});

const generateTimetableFlow = ai.defineFlow(
  {
    name: 'generateTimetableFlow',
    inputSchema: GenerateTimetableInputSchema,
    outputSchema: GenerateTimetableOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate timetable: AI returned no output.');
    }
    return output;
  }
);
