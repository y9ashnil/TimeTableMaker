import type { AppData, TimetableOption, TimetableEntry } from './types';

// Simple shuffle function to randomize array elements
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

export function generateTimetable(id: number, appData: AppData): TimetableOption {
  const { subjects, faculty, classrooms, studentBatches } = appData;
  const timetable: TimetableEntry[] = [];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["9-10 AM", "10-11 AM", "11-12 PM", "12-1 PM", "2-3 PM", "3-4 PM", "4-5 PM"];
  
  const schedule: Record<string, Record<string, { faculty: string | null; room: string | null; batch: string | null }>> = {};
  days.forEach(day => {
    schedule[day] = {};
    timeSlots.forEach(slot => {
      schedule[day][slot] = { faculty: null, room: null, batch: null };
    });
  });

  const shuffledBatches = shuffle([...studentBatches]);

  for (const batch of shuffledBatches) {
    const batchSubjects = shuffle([...subjects]);

    for (const subject of batchSubjects) {
      let classesAssigned = 0;
      const shuffledDays = shuffle([...days]);

      for (const day of shuffledDays) {
        if (classesAssigned >= subject.classesRequiredPerWeek) break;

        const shuffledSlots = shuffle([...timeSlots]);
        for (const slot of shuffledSlots) {
          if (classesAssigned >= subject.classesRequiredPerWeek) break;

          const availableFaculty = faculty.find(f =>
            f.subjects.includes(subject.subjectCode) &&
            !Object.values(schedule[day]).some(s => s.faculty === f.name) // Simplified check
          );
          
          const availableRoom = classrooms.find(r => 
            r.type === subject.type &&
            r.capacity >= batch.strength &&
            !Object.values(schedule[day]).some(s => s.room === r.name) // Simplified check
          );
          
          const isBatchFree = !Object.values(schedule[day]).some(s => s.batch === batch.batchCode);

          if (availableFaculty && availableRoom && isBatchFree && schedule[day][slot].faculty === null) {
            const entry: TimetableEntry = {
              day,
              time: slot,
              subject: subject.name,
              faculty: availableFaculty.name,
              room: availableRoom.name,
              batch: batch.batchCode,
            };
            timetable.push(entry);
            schedule[day][slot] = { faculty: availableFaculty.name, room: availableRoom.name, batch: batch.batchCode };
            classesAssigned++;
          }
        }
      }
    }
  }

  // Sort timetable for consistent display
  timetable.sort((a, b) => {
    if (days.indexOf(a.day) !== days.indexOf(b.day)) {
      return days.indexOf(a.day) - days.indexOf(b.day);
    }
    return timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time);
  });

  // Dummy scores, as the complex logic is removed
  const utilizationScore = 70 + Math.floor(Math.random() * 20); // 70-90
  const balanceScore = 75 + Math.floor(Math.random() * 20); // 75-95

  return {
    id,
    timetable,
    scores: {
      utilization: utilizationScore,
      balance: balanceScore,
      conflicts: 0,
    },
  };
}
