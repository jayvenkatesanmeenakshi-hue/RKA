/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, BookOpen, Clock, CheckCircle2, 
  XCircle, Save, ChevronRight, Hash, MessageSquare, Plus 
} from 'lucide-react';
import { Batch, ProgressLog, Student } from '../types';

export const StaffDashboard = () => {
  const { currentUser, batches, students, updateLog } = useAcademy();
  const myBatches = batches.filter(b => b.instructorId === currentUser?.id);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  
  const activeBatch = myBatches.find(b => b.id === activeBatchId);
  const batchStudents = students.filter(s => activeBatch?.studentIds.includes(s.id));

  // Current session stats
  const [sessionNotes, setSessionNotes] = useState<Record<string, { present: boolean, book: string, notes: string, level: string }>>({});

  const handleToggleAttendance = (studentId: string) => {
    setSessionNotes(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        present: !prev[studentId]?.present
      }
    }));
  };

  const handleUpdateField = (studentId: string, field: string, value: any) => {
    setSessionNotes(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveSession = (studentId: string) => {
    const note = sessionNotes[studentId];
    if (!note || !activeBatch) return;

    const newLog: ProgressLog = {
      id: `l-${Date.now()}-${studentId}`,
      studentId,
      programId: activeBatch.programId,
      date: new Date().toISOString().split('T')[0],
      attendance: note.present ?? true,
      currentBook: note.book || 'N/A',
      currentLevel: note.level || 'Continuing',
      notes: note.notes || 'No specific notes recorded.',
      instructorId: currentUser!.id
    };

    updateLog(newLog);
    alert(`Progress logged for ${students.find(s => s.id === studentId)?.name}`);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 tracking-tight">Staff Hub</h2>
            <p className="text-slate-500 text-sm font-medium">Instructor: {currentUser?.name} • Ponmar Main Road Center</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
             <Calendar className="text-navy-400" size={16} />
             <span className="text-xs font-bold text-navy-900">{new Date().toDateString()}</span>
          </div>
        </div>

        {/* Batch Selection Rail */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBatches.map(batch => (
            <button 
              key={batch.id}
              onClick={() => setActiveBatchId(batch.id)}
              className={`p-5 rounded-2xl border transition-all text-left group ${
                activeBatchId === batch.id 
                  ? 'bg-navy-900 text-white border-yellow-400 shadow-xl shadow-navy-900/10' 
                  : 'bg-white text-navy-900 border-slate-200 hover:border-navy-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                   activeBatchId === batch.id ? 'bg-yellow-400 text-navy-900' : 'bg-slate-100 text-slate-500'
                }`}>
                  {batch.programId}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${activeBatchId === batch.id ? 'text-navy-300' : 'text-slate-400'}`}>
                  {batch.room}
                </span>
              </div>
              <h4 className="text-lg font-bold mb-1 tracking-tight">{batch.time}</h4>
              <div className="flex items-center gap-2 text-[11px] font-medium opacity-70">
                <Users size={12} />
                <span>{batch.studentIds.length} Students Assigned</span>
              </div>
              {activeBatchId === batch.id && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-yellow-400 font-bold text-[10px] uppercase tracking-widest">
                  <span>Current Active Session</span>
                  <ChevronRight size={14} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Active Session Controller */}
        <AnimatePresence mode="wait">
          {activeBatchId ? (
            <motion.div 
              key={activeBatchId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-400 w-10 h-10 rounded-lg flex items-center justify-center text-navy-900">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Session Roster Engine</h3>
                    <p className="text-slate-500 text-[10px] font-bold mt-0.5">BATCH: {activeBatch?.programId} • {activeBatch?.time}</p>
                  </div>
                </div>
                <button className="text-[10px] bg-navy-900 text-yellow-400 px-4 py-1.5 rounded-lg font-bold hover:opacity-90">
                  Broadcast Update
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/20 border-b border-slate-50">
                      <th className="px-8 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Student Info</th>
                      <th className="px-8 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-8 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Milestone Logging</th>
                      <th className="px-8 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">CMD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {batchStudents.map(student => {
                      const note = sessionNotes[student.id];
                      return (
                        <tr key={student.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-sm">
                                {student.name[0]}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm whitespace-nowrap">{student.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Age {student.age} • {student.school}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <button 
                              onClick={() => handleToggleAttendance(student.id)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                note?.present === false 
                                  ? 'bg-rose-50 text-rose-600 border-rose-100' 
                                  : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}
                            >
                              {note?.present === false ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                              {note?.present === false ? 'Absent' : 'Present'}
                            </button>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex gap-3">
                              <div className="relative group min-w-[140px]">
                                <input 
                                  type="text" 
                                  placeholder="Book Ref"
                                  value={note?.book || ''}
                                  onChange={(e) => handleUpdateField(student.id, 'book', e.target.value)}
                                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:ring-2 focus:ring-navy-900/5 focus:border-navy-900 outline-none font-medium"
                                />
                              </div>
                              <div className="relative group flex-1 min-w-[240px]">
                                <input 
                                  type="text" 
                                  placeholder="Daily progress notes for parents..."
                                  value={note?.notes || ''}
                                  onChange={(e) => handleUpdateField(student.id, 'notes', e.target.value)}
                                  className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:ring-2 focus:ring-navy-900/5 focus:border-navy-900 outline-none font-medium"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <button 
                              onClick={() => handleSaveSession(student.id)}
                              className="bg-navy-900 text-yellow-400 w-10 h-10 rounded-lg hover:opacity-90 transition-all flex items-center justify-center shadow-sm"
                            >
                              <Save size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Calendar size={32} className="opacity-20" />
              </div>
              <p className="text-sm font-medium">Select a dynamic batch from the matrix above to start session logging.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
