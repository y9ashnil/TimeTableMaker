"use client";

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppData } from "@/context/AppDataContext";
import { School, Users, Book, CalendarCheck, UserCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TimetableEntry } from "@/lib/types";

export default function DashboardPage() {
  const { appData, finalizedTimetable } = useAppData();
  const { classrooms, faculty, subjects, studentBatches } = appData;

  const getFacultySchedule = (facultyName: string) => {
    return finalizedTimetable?.filter(entry => entry.faculty === facultyName) || [];
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["9-10 AM", "10-11 AM", "11-12 PM", "12-1 PM", "2-3 PM", "3-4 PM", "4-5 PM"];


  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Admin! Here's an overview of your institution's data."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Classrooms
            </CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classrooms.length}</div>
            <p className="text-xs text-muted-foreground">
              Managed classrooms and labs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faculty.length}</div>
            <p className="text-xs text-muted-foreground">
              Faculty members in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Courses offered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Student Batches
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentBatches.length}</div>
            <p className="text-xs text-muted-foreground">
              Student groups across programs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck />
              Finalized Timetable
            </CardTitle>
             <CardDescription>
              {finalizedTimetable ? 'The currently active timetable across the institution.' : 'No timetable has been finalized yet.'}
            </CardDescription>
          </CardHeader>
          {finalizedTimetable && (
             <CardContent className="max-h-[400px] overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Faculty</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Batch</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {finalizedTimetable.map((entry, index) => (
                        <TableRow key={index}>
                            <TableCell>{entry.day}</TableCell>
                            <TableCell>{entry.time}</TableCell>
                            <TableCell className="font-medium">
                            {entry.subject}
                            </TableCell>
                            <TableCell>{entry.faculty}</TableCell>
                            <TableCell>{entry.room}</TableCell>
                            <TableCell>{entry.batch}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          )}
        </Card>
        
        <Card>
           <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <UserCheck />
                Faculty Schedules
            </CardTitle>
            <CardDescription>
              {finalizedTimetable ? 'Individual timetables for each faculty member.' : 'Schedules will be available after a timetable is finalized.'}
            </CardDescription>
          </CardHeader>
          {finalizedTimetable && faculty.length > 0 && (
            <CardContent>
                <Tabs defaultValue={faculty[0].id}>
                    <TabsList>
                        {faculty.map(f => (
                            <TabsTrigger key={f.id} value={f.id}>{f.name}</TabsTrigger>
                        ))}
                    </TabsList>
                    {faculty.map(f => (
                        <TabsContent key={f.id} value={f.id} className="max-h-[340px] overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time</TableHead>
                                        {daysOfWeek.map(day => (
                                            <TableHead key={day}>{day}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {timeSlots.map(slot => (
                                        <TableRow key={slot}>
                                            <TableCell className="font-medium">{slot}</TableCell>
                                            {daysOfWeek.map(day => {
                                                const entry = finalizedTimetable.find(e => e.faculty === f.name && e.day === day && e.time === slot);
                                                return (
                                                    <TableCell key={day}>
                                                        {entry ? (
                                                            <div>
                                                                <div className="font-semibold">{entry.subject}</div>
                                                                <div className="text-xs text-muted-foreground">{entry.batch} @ {entry.room}</div>
                                                            </div>
                                                        ) : '-'}
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}
