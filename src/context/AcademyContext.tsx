/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AcademyState, User, Student, ProgressLog, Batch, Invoice, Program } from '../types';
import { MOCK_USERS, MOCK_STUDENTS, PROGRAMS, MOCK_BATCHES, MOCK_LOGS, MOCK_INVOICES } from '../data';

interface AcademyContextType extends AcademyState {
  login: (email: string) => void;
  logout: () => void;
  updateLog: (log: ProgressLog) => void;
  payInvoice: (invoiceId: string) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
}

const AcademyContext = createContext<AcademyContextType | undefined>(undefined);

export const AcademyProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [logs, setLogs] = useState<ProgressLog[]>(MOCK_LOGS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [batches, setBatches] = useState<Batch[]>(MOCK_BATCHES);

  const login = (email: string) => {
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    }
  };

  const logout = () => setUser(null);

  const updateLog = (newLog: ProgressLog) => {
    setLogs(prev => [newLog, ...prev.filter(l => l.id !== newLog.id)]);
  };

  const payInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } 
        : inv
    ));
  };

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const updateStudent = (student: Student) => {
    setStudents(prev => prev.map(s => s.id === student.id ? student : s));
  };

  return (
    <AcademyContext.Provider value={{
      currentUser: user,
      users: MOCK_USERS,
      students,
      programs: PROGRAMS,
      batches,
      logs,
      invoices,
      login,
      logout,
      updateLog,
      payInvoice,
      addStudent,
      updateStudent
    }}>
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) throw new Error('useAcademy must be used within AcademyProvider');
  return context;
};
