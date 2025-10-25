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

      <div className="mt-8 grid gap-8 lg:grid-cols-1">
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
             <CardContent className="max-h-[600px] overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Time</TableHead>
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
                                    const entries = finalizedTimetable.filter(e => e.day === day && e.time === slot);
                                    return (
                                        <TableCell key={day} className="align-top">
                                            {entries.length > 0 ? entries.map((entry, index) => (
                                                <div key={index} className="mb-2 last:mb-0 p-2 rounded-md bg-muted/50 text-xs">
                                                    <div className="font-semibold">{entry.subject}</div>
                                                    <div>{entry.faculty}</div>
                                                    <div className="text-muted-foreground">{entry.batch} @ {entry.room}</div>
                                                </div>
                                            )) : '-'}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          )}
        </Card>
        
         {finalizedTimetable && faculty.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <UserCheck />
                  Faculty Schedules
              </CardTitle>
              <CardDescription>
                Individual timetables for each faculty member.
              </CardDescription>
            </CardHeader>
            <CardContent>
                  <Tabs defaultValue={faculty[0].id}>
                      <TabsList>
                          {faculty.map(f => (
                              <TabsTrigger key={f.id} value={f.id}>{f.name}</TabsTrigger>
                          ))}
                      </TabsList>
                      {faculty.map(f => (
                          <TabsContent key={f.id} value={f.id} className="max-h-[500px] overflow-auto">
                              <Table>
                                  <TableHeader>
                                      <TableRow>
                                          <TableHead className="w-[120px]">Time</TableHead>
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
                                                              <div className="text-xs">
                                                                  <div className="font-semibold">{entry.subject}</div>
                                                                  <div className="text-muted-foreground">{entry.batch} @ {entry.room}</div>
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
          </Card>
        )}
      </div>
    </>
  );
}
