"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { classrooms as initialClassrooms, faculty as initialFaculty, subjects as initialSubjects, studentBatches as initialStudentBatches, fixedSlots as initialFixedSlots } from '@/lib/data';
import type { Classroom, Faculty, Subject, StudentBatch, FixedSlot } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export interface AppData {
  classrooms: Classroom[];
  faculty: Faculty[];
  subjects: Subject[];
  studentBatches: StudentBatch[];
  fixedSlots: FixedSlot[];
}

interface AppDataContextProps {
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  addClassroom: (classroom: Omit<Classroom, 'id'>) => void;
  deleteClassroom: (id: string) => void;
  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  deleteFaculty: (id: string) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  deleteSubject: (id: string) => void;
  addStudentBatch: (batch: Omit<StudentBatch, 'id'>) => void;
  deleteStudentBatch: (id: string) => void;
  addFixedSlot: (slot: Omit<FixedSlot, 'id'>) => void;
  deleteFixedSlot: (id: string) => void;
  saveChanges: () => void;
  hasChanges: boolean;
  resetChanges: () => void;
}

const AppDataContext = createContext<AppDataContextProps | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'timewise_app_data';

const initialData: AppData = {
    classrooms: initialClassrooms,
    faculty: initialFaculty,
    subjects: initialSubjects,
    studentBatches: initialStudentBatches,
    fixedSlots: initialFixedSlots,
};

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useState<AppData>(initialData);
  const [initialDataState, setInitialDataState] = useState<AppData>(initialData);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setAppData(parsedData);
        setInitialDataState(parsedData);
      }
    } catch (error) {
      console.error("Failed to load data from local storage", error);
      setAppData(initialData);
      setInitialDataState(initialData);
    }
  }, []);

  useEffect(() => {
    const changes = JSON.stringify(appData) !== JSON.stringify(initialDataState);
    setHasChanges(changes);
  }, [appData, initialDataState]);

  const saveChanges = useCallback(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
      setInitialDataState(appData); // Set the new baseline
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save data to local storage", error);
      toast({
        title: "Error",
        description: "Could not save changes.",
        variant: "destructive",
      });
    }
  }, [appData, toast]);
  
  const resetChanges = useCallback(() => {
    setAppData(initialDataState);
  }, [initialDataState]);

  const addClassroom = (classroom: Omit<Classroom, 'id'>) => {
    setAppData(prev => ({
      ...prev,
      classrooms: [...prev.classrooms, { ...classroom, id: `CR${(prev.classrooms.length + 1).toString().padStart(3, '0')}` }]
    }));
  };

  const deleteClassroom = (id: string) => {
    setAppData(prev => ({
      ...prev,
      classrooms: prev.classrooms.filter(c => c.id !== id)
    }));
  };

  const addFaculty = (faculty: Omit<Faculty, 'id'>) => {
    setAppData(prev => ({
      ...prev,
      faculty: [...prev.faculty, { ...faculty, id: `F${(prev.faculty.length + 1).toString().padStart(3, '0')}` }]
    }));
  };

  const deleteFaculty = (id: string) => {
    setAppData(prev => ({
      ...prev,
      faculty: prev.faculty.filter(f => f.id !== id)
    }));
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    setAppData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { ...subject, id: `S${(prev.subjects.length + 1).toString().padStart(3, '0')}` }]
    }));
  };

  const deleteSubject = (id: string) => {
    setAppData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id)
    }));
  };
  
  const addStudentBatch = (batch: Omit<StudentBatch, 'id'>) => {
    setAppData(prev => ({
      ...prev,
      studentBatches: [...prev.studentBatches, { ...batch, id: `B${(prev.studentBatches.length + 1).toString().padStart(3, '0')}` }]
    }));
  };

  const deleteStudentBatch = (id: string) => {
    setAppData(prev => ({
      ...prev,
      studentBatches: prev.studentBatches.filter(b => b.id !== id)
    }));
  };

  const addFixedSlot = (slot: Omit<FixedSlot, 'id'>) => {
    setAppData(prev => ({
      ...prev,
      fixedSlots: [...prev.fixedSlots, { ...slot, id: `FS${(prev.fixedSlots.length + 1).toString().padStart(3, '0')}` }]
    }));
  };

  const deleteFixedSlot = (id: string) => {
    setAppData(prev => ({
      ...prev,
      fixedSlots: prev.fixedSlots.filter(fs => fs.id !== id)
    }));
  };

  const value = useMemo(() => ({
    appData,
    setAppData,
    addClassroom,
    deleteClassroom,
    addFaculty,
    deleteFaculty,
    addSubject,
    deleteSubject,
    addStudentBatch,
    deleteStudentBatch,
    addFixedSlot,
    deleteFixedSlot,
    saveChanges,
    hasChanges,
    resetChanges,
  }), [appData, setAppData, saveChanges, hasChanges, resetChanges]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
