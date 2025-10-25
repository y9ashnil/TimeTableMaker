'use client';

import {useState, useEffect, useCallback} from 'react';
import {PageHeader} from '@/components/page-header';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {TimetableOption, TimetableEntry} from '@/lib/types';
import {
  Activity,
  BarChart,
  Download,
  Bot,
  Loader2,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import {useAppData} from '@/context/AppDataContext';
import {useToast} from '@/hooks/use-toast';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import { generateTimetable } from '@/lib/timetable-generator';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


const FINALIZED_TIMETABLE_KEY = 'timewise_finalized_timetable';

export default function TimetablesPage() {
  const [generatedOption, setGeneratedOption] = useState<TimetableOption | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { appData, setFinalizedTimetable, finalizedTimetable } = useAppData();
  const { toast } = useToast();

  const isFinalized = finalizedTimetable !== null;

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["9-10 AM", "10-11 AM", "11-12 PM", "12-1 PM", "2-3 PM", "3-4 PM", "4-5 PM"];


  useEffect(() => {
    // On mount, check if a timetable has been finalized previously
    const savedFinalized = localStorage.getItem(FINALIZED_TIMETABLE_KEY);
    if (savedFinalized) {
      try {
        const finalTimetable: TimetableOption = JSON.parse(savedFinalized);
        setGeneratedOption(finalTimetable);
        setIsSelected(true);
        if (setFinalizedTimetable) {
          setFinalizedTimetable(finalTimetable.timetable);
        }
      } catch (e) {
        console.error("Could not parse finalized timetable from localStorage", e);
        localStorage.removeItem(FINALIZED_TIMETABLE_KEY);
      }
    }
  }, [setFinalizedTimetable]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setIsSelected(false);
    setFinalizedTimetable(null);
    setGeneratedOption(null);
    localStorage.removeItem(FINALIZED_TIMETABLE_KEY);

    setTimeout(() => {
      const option = generateTimetable(1, appData);
      setGeneratedOption(option);
      setIsGenerating(false);
      toast({
        title: 'Timetable Generated',
        description: 'A new sample timetable has been created.',
      });
    }, 1000); // Simulate network latency/processing time
  };

  const handleFinalize = () => {
    if (generatedOption) {
      setFinalizedTimetable(generatedOption.timetable);
      localStorage.setItem(FINALIZED_TIMETABLE_KEY, JSON.stringify(generatedOption));
      toast({
        title: 'Timetable Finalized',
        description: `You have selected and saved the timetable.`,
      });
      setIsSelected(true); // Ensure selection state is correct
    }
  };

  const handleExportPDF = () => {
    if (!finalizedTimetable) return;

    const doc = new jsPDF();
    doc.text("Finalized Timetable", 14, 16);

    const head = [['Time', ...daysOfWeek]];
    const body = timeSlots.map(slot => {
        const row: string[] = [slot];
        daysOfWeek.forEach(day => {
            const entries = finalizedTimetable.filter(e => e.day === day && e.time === slot);
            const cellText = entries.map(e => `${e.subject}\n${e.faculty}\n${e.batch} @ ${e.room}`).join('\n\n');
            row.push(cellText);
        });
        return row;
    });

    (doc as any).autoTable({
        head: head,
        body: body,
        startY: 20,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    });

    doc.save('timetable.pdf');
  };

  const handleExportExcel = () => {
    if (!finalizedTimetable) return;

    const worksheetData = [
        ['Time', ...daysOfWeek],
        ...timeSlots.map(slot => [
            slot,
            ...daysOfWeek.map(day => {
                const entries = finalizedTimetable.filter(e => e.day === day && e.time === slot);
                return entries.map(e => `${e.subject} (${e.faculty}) - ${e.batch} @ ${e.room}`).join('\n');
            })
        ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Timetable');
    XLSX.writeFile(workbook, 'timetable.xlsx');
  };

  return (
    <>
      <PageHeader
        title="Timetable Generator & Viewer"
        description="Generate, review, and finalize timetables for your institution."
        actions={
          <div className="flex items-center gap-4">
            <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
              {isGenerating ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <Bot className="mr-2" />
              )}
              {isFinalized ? 'Generate New Timetable' : 'Generate Timetable'}
            </Button>
            {!isFinalized && generatedOption && (
              <Button
                onClick={handleFinalize}
                disabled={!isSelected}
                size="lg"
              >
                <CheckCircle className="mr-2" />
                Finalize Timetable
              </Button>
            )}
          </div>
        }
      />
      
      {isGenerating && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mr-4" />
          <span>Generating timetable...</span>
        </div>
      )}

      {!isGenerating && !generatedOption && (
         <Card className="text-center">
            <CardHeader>
                <CardTitle>No Timetable Generated</CardTitle>
                <CardDescription>
                Click the &quot;Generate Timetable&quot; button to create a new schedule.
                </CardDescription>
            </CardHeader>
        </Card>
      )}

      {generatedOption && (
         <Label
            htmlFor={`timetable-option-${generatedOption.id}`}
            className={`block ${isFinalized ? '' : 'cursor-pointer'}`}
         >
          <Card
            className={`transition-all ${isSelected && !isFinalized ? 'border-primary ring-2 ring-primary' : ''} ${isFinalized ? 'border-green-500 bg-green-50/20' : ''}`}
            onClick={() => !isFinalized && setIsSelected(true)}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {!isFinalized && (
                      <RadioGroup value={isSelected ? 'selected' : ''}>
                        <RadioGroupItem value="selected" id={`timetable-option-${generatedOption.id}`} />
                      </RadioGroup>
                    )}
                  <span>{isFinalized ? 'Finalized Timetable' : 'Sample Timetable Option'}</span>
                </div>
                {isFinalized ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 gap-2">
                      <FileCheck className="size-4" />
                      Finalized
                    </Badge>
                ) : (
                  <span className="text-sm font-medium text-primary">
                    Score:{' '}
                    {((generatedOption.scores.utilization + generatedOption.scores.balance) /
                      2
                    ).toFixed(0)}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {isFinalized ? 'This is the official timetable for the institution.' : 'Review the scores and schedule below. Click to select, then finalize.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isFinalized && (
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                      <BarChart className="size-5 text-muted-foreground" />
                      <div>
                      <div className="font-semibold">
                          {generatedOption.scores.utilization}%
                      </div>
                      <div className="text-muted-foreground">
                          Classroom Utilization
                      </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <Activity className="size-5 text-muted-foreground" />
                      <div>
                      <div className="font-semibold">
                          {generatedOption.scores.balance}%
                      </div>
                      <div className="text-muted-foreground">
                          Faculty Load Balance
                      </div>
                      </div>
                  </div>
                  </div>
              )}
              <div className="rounded-lg border shadow-sm max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Time</TableHead>
                      {daysOfWeek.map(day => <TableHead key={day}>{day}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {timeSlots.map(slot => (
                        <TableRow key={slot}>
                            <TableCell className="font-medium">{slot}</TableCell>
                            {daysOfWeek.map(day => {
                                const entries = generatedOption.timetable.filter(e => e.day === day && e.time === slot);
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
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={!isFinalized}>
                <Download className="mr-2" /> Export to PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={!isFinalized}>
                <Download className="mr-2" /> Export to Excel
              </Button>
            </CardFooter>
          </Card>
        </Label>
      )}
    </>
  );
}
