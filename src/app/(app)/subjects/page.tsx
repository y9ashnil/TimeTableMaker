"use client";

import { useState } from "react";
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
import type { Subject } from "@/lib/types";
import { PlusCircle, Save, Trash2, Undo } from "lucide-react";
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
import { useAppData } from "@/context/AppDataContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  subjectCode: z.string().min(1, "Subject code is required"),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["Lecture", "Lab"]),
  classesRequiredPerWeek: z.coerce.number().min(1, "Classes required must be at least 1"),
});

export default function SubjectsPage() {
  const { appData, addSubject, deleteSubject, saveChanges, hasChanges, resetChanges } = useAppData();
  const [open, setOpen] = useState(false);

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
    addSubject(values);
    form.reset();
    setOpen(false);
  }
  
  function handleDelete(id: string) {
    deleteSubject(id);
  }

  return (
    <>
      <PageHeader
        title="Subjects"
        description="Manage all subjects and courses offered."
        actions={
           <div className="flex gap-2">
             {hasChanges && (
               <>
                <Button onClick={saveChanges} variant="outline">
                  <Save className="mr-2" />
                  Save Changes
                </Button>
                 <Button onClick={resetChanges} variant="destructive">
                  <Undo className="mr-2" />
                  Cancel
                </Button>
               </>
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appData.subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="font-medium">{subject.subjectCode}</TableCell>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.type}</TableCell>
                <TableCell>{subject.classesRequiredPerWeek}</TableCell>
                <TableCell className="text-right">
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the subject. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(subject.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
