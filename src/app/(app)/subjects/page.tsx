"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { subjects as initialSubjects } from "@/lib/data";
import type { Subject } from "@/lib/types";
import { PlusCircle, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  subjectCode: z.string().min(1, "Subject code is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["Lecture", "Lab"]),
  classesRequiredPerWeek: z.coerce.number().min(1, "Classes required must be at least 1"),
});

const LOCAL_STORAGE_KEY = 'subjects_data';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [open, setOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      setSubjects(JSON.parse(savedData));
    } else {
      setSubjects(initialSubjects);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectCode: "",
      name: "",
      type: "Lecture",
      classesRequiredPerWeek: 3,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newSubject: Subject = {
      id: `S${(subjects.length + 1).toString().padStart(3, "0")}`,
      ...values,
    };
    setSubjects((prev) => [...prev, newSubject]);
    setHasChanges(true);
    form.reset();
    setOpen(false);
  }

  function handleSaveChanges() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subjects));
    setHasChanges(false);
    toast({
      title: "Success",
      description: "Your changes have been saved successfully.",
    });
  }

  return (
    <>
      <PageHeader
        title="Subjects"
        description="Manage all subjects and courses offered."
        actions={
           <div className="flex gap-2">
             {hasChanges && (
              <Button onClick={handleSaveChanges} variant="outline">
                <Save className="mr-2" />
                Save Changes
              </Button>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2" />
                  Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Subject</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-4 py-4"
                  >
                    <FormField
                      control={form.control}
                      name="subjectCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., CSE101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Intro to Programming" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="classesRequiredPerWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classes Required/Week</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Lecture">Lecture</SelectItem>
                              <SelectItem value="Lab">Lab</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit">Add Subject</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Classes/Week</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.subjectCode}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.type}</TableCell>
                <TableCell>{subject.classesRequiredPerWeek}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
