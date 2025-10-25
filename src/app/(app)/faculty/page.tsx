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
import { faculty as initialFaculty } from "@/lib/data";
import type { Faculty } from "@/lib/types";
import { PlusCircle } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  subjects: z.string().min(1, "Subjects are required (comma-separated)"),
  maxClassesPerWeek: z.coerce.number().min(1, "Max classes per week is required"),
  maxClassesPerDay: z.coerce.number().min(1, "Max classes per day is required"),
  avgLeavesPerMonth: z.coerce.number().min(0, "Cannot be negative.").optional(),
});

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>(initialFaculty);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      subjects: "",
      maxClassesPerWeek: 10,
      maxClassesPerDay: 3,
      avgLeavesPerMonth: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newFaculty: Faculty = {
      id: `F${(faculty.length + 1).toString().padStart(3, "0")}`,
      name: values.name,
      department: values.department,
      subjects: values.subjects.split(',').map(s => s.trim()),
      maxClassesPerWeek: values.maxClassesPerWeek,
      maxClassesPerDay: values.maxClassesPerDay,
      avgLeavesPerMonth: values.avgLeavesPerMonth,
    };
    setFaculty((prev) => [...prev, newFaculty]);
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Faculty"
        description="Manage faculty members and their teaching constraints."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" />
                Add Faculty
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Faculty</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4 py-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Dr. Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CSE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="subjects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subjects (comma-separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CSE101, MAT202" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="maxClassesPerWeek"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max/Week</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxClassesPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max/Day</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="avgLeavesPerMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leaves/Mth</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Add Faculty</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Max/Week</TableHead>
              <TableHead>Max/Day</TableHead>
              <TableHead>Avg Leaves</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculty.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>{member.subjects.join(", ")}</TableCell>
                <TableCell>{member.maxClassesPerWeek}</TableCell>
                <TableCell>{member.maxClassesPerDay}</TableCell>
                <TableCell>{member.avgLeavesPerMonth ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
