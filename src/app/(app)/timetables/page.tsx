'use client';

import {useState, useEffect} from 'react';
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
import type {TimetableOption} from '@/lib/types';
import {
  Activity,
  BarChart,
  Download,
  Bot,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import {useAppData} from '@/context/AppDataContext';
import {useToast} from '@/hooks/use-toast';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import { timetableOptions } from '@/lib/data';

export default function TimetablesPage() {
  const [generatedOptions, setGeneratedOptions] = useState<TimetableOption[]>(
    []
  );
  const [selectedTimetable, setSelectedTimetable] = useState<string | null>(
    null
  );
  const {toast} = useToast();

  useEffect(() => {
    // Load sample timetables
    setGeneratedOptions(timetableOptions);
  }, []);


  const handleFinalize = () => {
    toast({
      title: 'Timetable Finalized',
      description: `You have selected timetable option ${selectedTimetable}.`,
    });
  };

  return (
    <>
      <PageHeader
        title="Timetable Viewer"
        description="View and compare sample timetables."
        actions={
          <div className="flex items-center gap-4">
            {generatedOptions.length > 0 && (
              <Button
                onClick={handleFinalize}
                disabled={!selectedTimetable}
                size="lg"
              >
                <CheckCircle className="mr-2" />
                Finalize Timetable
              </Button>
            )}
          </div>
        }
      />
      
      <RadioGroup
        value={selectedTimetable || undefined}
        onValueChange={setSelectedTimetable}
        className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2"
      >
        {generatedOptions.map(option => (
          <Label
            key={option.id}
            htmlFor={`timetable-option-${option.id}`}
            className="block cursor-pointer"
          >
            <Card
              className={`transition-all ${selectedTimetable === String(option.id) ? 'border-primary ring-2 ring-primary' : ''}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <RadioGroupItem
                      value={String(option.id)}
                      id={`timetable-option-${option.id}`}
                    />
                    <span>Sample Timetable Option {option.id}</span>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    Score:{' '}
                    {((option.scores.utilization + option.scores.balance) /
                      2
                    ).toFixed(0)}
                  </span>
                </CardTitle>
                <CardDescription>
                  A sample timetable option. Review scores and schedule
                  below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <BarChart className="size-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">
                        {option.scores.utilization}%
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
                        {option.scores.balance}%
                      </div>
                      <div className="text-muted-foreground">
                        Faculty Load Balance
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border shadow-sm max-h-80 overflow-auto">
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
                      {option.timetable.map((entry, index) => (
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
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2" /> Export to PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2" /> Export to Excel
                </Button>
              </CardFooter>
            </Card>
          </Label>
        ))}
      </RadioGroup>
    </>
  );
}
