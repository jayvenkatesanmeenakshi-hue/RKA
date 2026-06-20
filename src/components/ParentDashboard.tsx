/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, BookOpen, Clock, FileText, 
  CreditCard, ChevronRight, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const ParentDashboard = () => {
  const { currentUser, students, logs, invoices, programs, payInvoice } = useAcademy();
  const parentStudents = students.filter(s => s.parentId === currentUser?.id);
  const [selectedStudentId, setSelectedStudentId] = useState(parentStudents[0]?.id);
  const [isPaying, setIsPaying] = useState<string | null>(null);

  const selectedStudent = parentStudents.find(s => s.id === selectedStudentId);
  const studentLogs = logs.filter(l => l.studentId === selectedStudentId);
  const studentInvoices = invoices.filter(i => i.studentId === selectedStudentId);

  const handlePayment = (id: string) => {
    setIsPaying(id);
    setTimeout(() => {
      payInvoice(id);
      setIsPaying(null);
    }, 1500);
  };

  if (!selectedStudent) return <div className="p-12 text-center text-slate-500 font-medium">No student records discovered for this account.</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Student Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 tracking-tight">Parent Portal</h2>
            <p className="text-slate-500 text-sm font-medium">Welcome back, {currentUser?.name}. Viewing student lifecycle.</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200">
            {parentStudents.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedStudentId === student.id 
                    ? 'bg-white text-navy-900 shadow-sm border border-slate-200' 
                    : 'text-navy-400 hover:text-navy-900'
                }`}
              >
                {student.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 overflow-hidden">
          {/* Main Content Areas */}
          <div className="flex-1 space-y-8">
            
            {/* Career/Program Progress Matrix */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-widest flex items-center gap-3">
                  <BookOpen className="text-yellow-500" size={20} />
                  Skill Track Matrix
                </h3>
              </div>
              
              <div className="space-y-10">
                {selectedStudent.enrolledPrograms.map(progId => {
                  const program = programs.find(p => p.id === progId);
                  const lastLog = studentLogs.find(l => l.programId === progId);
                  const currentLevelIdx = program?.levels.indexOf(lastLog?.currentLevel || '') ?? -1;
                  const progressPct = Math.round(((currentLevelIdx + 1) / (program?.levels.length || 1)) * 100);
                  
                  return (
                    <div key={progId} className="space-y-5">
                      <div className="flex justify-between items-end">
                        <div className="leading-tight">
                          <h4 className="font-bold text-slate-800 text-sm">{program?.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">Current Level: <span className="text-navy-700">{lastLog?.currentLevel || 'Initial'}</span></p>
                        </div>
                        <p className="text-[10px] font-black text-navy-900">{progressPct}%</p>
                      </div>

                      {/* Horizontal Stepper */}
                      <div className="relative h-1 w-full bg-slate-100 rounded-full">
                        <div 
                          className="absolute h-1 bg-yellow-400 rounded-full transition-all duration-1000"
                          style={{ width: `${progressPct}%` }}
                        ></div>
                        <div className="absolute inset-0 flex justify-between items-center px-0.5">
                          {program?.levels.map((level, i) => (
                            <div key={level} className={`w-2 h-2 rounded-full border transition-all ${
                              i <= currentLevelIdx ? 'bg-navy-900 border-yellow-400' : 'bg-white border-slate-200'
                            }`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lesson Review Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-widest flex items-center gap-3">
                  <FileText className="text-yellow-500" size={20} />
                  Lesson Chronicles
                </h3>
              </div>
              <div className="divide-y divide-slate-50">
                {studentLogs.length > 0 ? studentLogs.map(log => (
                  <div key={log.id} className="p-8 hover:bg-slate-50/30 transition-colors">
                    <div className="flex gap-6 items-start">
                      <div className="bg-slate-100 text-slate-600 w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-center shrink-0 border border-slate-200">
                        <span className="text-sm">{new Date(log.date).getDate()}</span>
                        <span className="text-[9px] uppercase tracking-tighter">{new Date(log.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-black text-white bg-navy-900 px-2 py-0.5 rounded uppercase tracking-widest mb-1 inline-block">
                              {log.programId}
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm">Session: {log.currentBook}</h4>
                          </div>
                          <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${log.attendance ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {log.attendance ? 'Present' : 'Absent'}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed font-medium italic">
                          "{log.notes}"
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-slate-400 flex flex-col items-center space-y-4">
                    <AlertCircle size={40} className="opacity-20" />
                    <p className="text-xs font-medium uppercase tracking-widest">No lesson data recorded this cycle.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Billing & Profile */}
          <div className="w-80 space-y-8 shrink-0">
            {/* Student Info Card - Light Theme */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-navy-900 border-4 border-white shadow-xl rounded-full flex items-center justify-center text-yellow-400 font-black text-xl uppercase">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="leading-tight">
                    <h4 className="font-bold text-lg text-navy-900">{selectedStudent.name}</h4>
                    <p className="text-navy-400 text-[10px] uppercase font-bold tracking-widest mt-1">Mambakkam Center Member</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-navy-300 text-[9px] uppercase font-black tracking-widest">Active Tracks</p>
                    <p className="text-xl font-bold text-navy-900">{selectedStudent.enrolledPrograms.length}</p>
                  </div>
                  <div>
                    <p className="text-navy-300 text-[9px] uppercase font-black tracking-widest">Enrollment</p>
                    <p className="text-xl font-bold text-yellow-600">Active</p>
                  </div>
                </div>
               </div>
               <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full"></div>
            </div>

            {/* Invoices/Billing Ledger */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-widest flex items-center gap-3">
                  <CreditCard className="text-yellow-500" size={20} />
                  Billing Ledger
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                {studentInvoices.map(invoice => (
                  <div key={invoice.id} className={`p-4 rounded-xl border transition-all ${
                    invoice.status === 'Paid' ? 'bg-slate-50 border-slate-100' : 'bg-yellow-50/30 border-yellow-100 shadow-sm'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{invoice.description}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Due: {invoice.dueDate}</p>
                      </div>
                      <p className="font-bold text-navy-900 text-sm">₹{invoice.amount}</p>
                    </div>

                    {invoice.status === 'Paid' ? (
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-600 font-black text-[9px] bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-widest">Settled</span>
                      </div>
                    ) : (
                      <button 
                        disabled={isPaying === invoice.id}
                        onClick={() => handlePayment(invoice.id)}
                        className="w-full mt-2 bg-navy-900 text-yellow-400 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        {isPaying === invoice.id ? (
                          <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                        ) : (
                          <>Settle Tuition <ChevronRight size={14} /></>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
