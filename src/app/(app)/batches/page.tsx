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
import { studentBatches as initialBatches } from "@/lib/data";
import type { StudentBatch } from "@/lib/types";
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
  program: z.string().min(1, "Program is required"),
  year: z.coerce.number().min(1, "Year is required"),
  department: z.string().min(1, "Department is required"),
  batchCode: z.string().min(1, "Batch code is required"),
  strength: z.coerce.number().min(1, "Strength is required"),
  electiveCombinations: z.string().optional(),
});

export default function BatchesPage() {
  const [batches, setBatches] = useState<StudentBatch[]>(initialBatches);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      program: "B.Tech",
      year: 1,
      department: "",
      batchCode: "",
      strength: 60,
      electiveCombinations: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newBatch: StudentBatch = {
      id: `B${(batches.length + 1).toString().padStart(3, "0")}`,
      program: values.program,
      year: values.year,
      department: values.department,
      batchCode: values.batchCode,
      strength: values.strength,
      electiveCombinations: values.electiveCombinations?.split(',').map(s => s.trim()).filter(Boolean),
    };
    setBatches((prev) => [...prev, newBatch]);
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Student Batches"
        description="Manage student groups, programs, and their strengths."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" />
                Add Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Student Batch</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4 py-4"
                >
                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., B.Tech" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="batchCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CSE-2A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="strength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strength</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                    name="electiveCombinations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Electives (comma-separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CS-E1,CS-ML-E1" {...field} value={field.value || ''} />
                        </FormControl>
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
                    <Button type="submit">Add Batch</Button>
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
              <TableHead>Batch Code</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Strength</TableHead>
              <TableHead>Electives</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="font-medium">{batch.batchCode}</TableCell>
                <TableCell>{batch.program}</TableCell>
                <TableCell>{batch.year}</TableCell>
                <TableCell>{batch.department}</TableCell>
                <TableCell>{batch.strength}</TableCell>
                <TableCell>{batch.electiveCombinations?.join(", ") || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
