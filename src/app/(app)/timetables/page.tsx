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
  FileCheck,
} from 'lucide-react';
import {useAppData} from '@/context/AppDataContext';
import {useToast} from '@/hooks/use-toast';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';
import { generateTimetable } from '@/lib/timetable-generator';
import { Badge } from '@/components/ui/badge';

const FINALIZED_TIMETABLE_KEY = 'timewise_finalized_timetable';

export default function TimetablesPage() {
  const [generatedOptions, setGeneratedOptions] = useState<TimetableOption[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { appData, setFinalizedTimetable, finalizedTimetable } = useAppData();
  const { toast } = useToast();

  const isFinalized = finalizedTimetable !== null && generatedOptions.length === 1;

  useEffect(() => {
    // On mount, check if a timetable has been finalized previously
    const savedFinalized = localStorage.getItem(FINALIZED_TIMETABLE_KEY);
    if (savedFinalized) {
      try {
        const finalTimetable: TimetableOption = JSON.parse(savedFinalized);
        setGeneratedOptions([finalTimetable]);
        setSelectedTimetable(String(finalTimetable.id));
        setFinalizedTimetable(finalTimetable.timetable);
      } catch (e) {
        console.error("Could not parse finalized timetable from localStorage", e);
        localStorage.removeItem(FINALIZED_TIMETABLE_KEY);
      }
    }
  }, [setFinalizedTimetable]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setSelectedTimetable(null);
    setFinalizedTimetable(null);
    localStorage.removeItem(FINALIZED_TIMETABLE_KEY);

    setTimeout(() => {
      const options = [
        generateTimetable(1, appData),
        generateTimetable(2, appData),
      ];
      setGeneratedOptions(options);
      setIsGenerating(false);
      toast({
        title: 'Timetables Generated',
        description: 'Two new sample options have been created.',
      });
    }, 1000); // Simulate network latency/processing time
  };

  const handleFinalize = () => {
    const finalTimetable = generatedOptions.find(opt => String(opt.id) === selectedTimetable);
    if (finalTimetable) {
      setGeneratedOptions([finalTimetable]);
      setFinalizedTimetable(finalTimetable.timetable);
      localStorage.setItem(FINALIZED_TIMETABLE_KEY, JSON.stringify(finalTimetable));
      toast({
        title: 'Timetable Finalized',
        description: `You have selected and saved timetable option ${selectedTimetable}.`,
      });
    }
  };

  return (
    <>
      <PageHeader
        title="Timetable Generator & Viewer"
        description="Generate, compare, and finalize timetables for your institution."
        actions={
          <div className="flex items-center gap-4">
            <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
              {isGenerating ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <Bot className="mr-2" />
              )}
              {isFinalized ? 'Generate New Timetables' : 'Generate Timetables'}
            </Button>
            {!isFinalized && generatedOptions.length > 0 && (
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
      
      {isGenerating && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="size-8 animate-spin mr-4" />
          <span>Generating timetable options...</span>
        </div>
      )}

      {!isGenerating && generatedOptions.length === 0 && (
         <Card className="text-center">
            <CardHeader>
                <CardTitle>No Timetables Generated</CardTitle>
                <CardDescription>
                Click the &quot;Generate Timetables&quot; button to create new schedule options.
                </CardDescription>
            </CardHeader>
        </Card>
      )}

      <RadioGroup
        value={selectedTimetable || undefined}
        onValueChange={setSelectedTimetable}
        className="grid gap-6 lg:grid-cols-1 xl:grid-cols-2"
        disabled={isFinalized}
      >
        {generatedOptions.map(option => (
          <Label
            key={option.id}
            htmlFor={`timetable-option-${option.id}`}
            className={`block ${isFinalized ? '' : 'cursor-pointer'}`}
          >
            <Card
              className={`transition-all ${selectedTimetable === String(option.id) && !isFinalized ? 'border-primary ring-2 ring-primary' : ''} ${isFinalized ? 'border-green-500 bg-green-50/20' : ''}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     {!isFinalized && (
                       <RadioGroupItem
                        value={String(option.id)}
                        id={`timetable-option-${option.id}`}
                      />
                     )}
                    <span>Sample Timetable Option {option.id}</span>
                  </div>
                  {isFinalized ? (
                     <Badge variant="outline" className="text-green-600 border-green-600 gap-2">
                        <FileCheck className="size-4" />
                        Finalized
                      </Badge>
                  ) : (
                    <span className="text-sm font-medium text-primary">
                      Score:{' '}
                      {((option.scores.utilization + option.scores.balance) /
                        2
                      ).toFixed(0)}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {isFinalized ? 'This is the official timetable for the institution.' : 'A sample timetable option. Review scores and schedule below.'}
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
