'use client';

import {useState} from 'react';
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
import {generateTimetableOptions} from '@/app/actions';
import {useAppData} from '@/context/AppDataContext';
import {useToast} from '@/hooks/use-toast';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Label} from '@/components/ui/label';

export default function TimetablesPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<TimetableOption[]>(
    []
  );
  const [selectedTimetable, setSelectedTimetable] = useState<string | null>(
    null
  );
  const {appData} = useAppData();
  const {toast} = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedOptions([]);
    setSelectedTimetable(null);
    try {
      const result = await generateTimetableOptions(appData);
      if (result.success && result.timetableOptions) {
        setGeneratedOptions(result.timetableOptions);
      } else {
        toast({
          title: 'Error Generating Timetable',
          description:
            result.error || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate timetable.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinalize = () => {
    toast({
      title: 'Timetable Finalized',
      description: `You have selected timetable option ${selectedTimetable}.`,
    });
  };

  return (
    <>
      <PageHeader
        title="Timetable Generation"
        description="Generate, view, and compare optimized timetables."
        actions={
          <div className="flex items-center gap-4">
            {generatedOptions.length > 0 && (
              <Button
                onClick={handleFinalize}
                disabled={!selectedTimetable}
                size="lg"
                variant="outline"
              >
                <CheckCircle className="mr-2" />
                Finalize Timetable
              </Button>
            )}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : (
                <Bot className="mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Timetable'}
            </Button>
          </div>
        }
      />
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center gap-4 text-center rounded-lg border-2 border-dashed shadow-sm p-8 min-h-[500px] bg-card">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold tracking-tight">
            Optimizing Timetables
          </h2>
          <p className="text-muted-foreground max-w-md">
            The AI is working its magic, analyzing constraints for faculty,
            classrooms, and batches. Please wait a moment...
          </p>
        </div>
      ) : (
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
                      <span>Timetable Option {option.id}</span>
                    </div>
                    <span className="text-sm font-medium text-primary">
                      Score:{' '}
                      {((option.scores.utilization + option.scores.balance) /
                        2
                      ).toFixed(0)}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    An optimized timetable option. Review scores and schedule
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
      )}
    </>
  );
}
