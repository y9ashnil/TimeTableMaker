'use server';
import {config} from 'dotenv';
config();

import '@/ai/flows/resolve-timetable-conflicts.ts';
import '@/ai/flows/generate-timetable.ts';
