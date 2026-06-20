/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { 
  Users, BarChart3, Wallet, Brain, Plus, Search, 
  MoreVertical, Edit2, Trash2, Check, X, ShieldCheck 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { students, batches, invoices } = useAcademy();
  const [searchTerm, setSearchTerm] = useState('');

  // KPIs
  const totalMinds = students.length;
  const activeBatchesCount = batches.length;
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingCollection = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    { label: 'Total Students', value: totalMinds, icon: <Brain size={24} />, color: 'bg-indigo-50 text-indigo-600', trend: '+8 This Month' },
    { label: 'Active Batches', value: activeBatchesCount, icon: <Users size={24} />, color: 'bg-amber-50 text-amber-600', trend: '4 Daily Slots' },
    { label: 'Fees Collected', value: '84%', icon: <Wallet size={24} />, color: 'bg-emerald-50 text-emerald-600', trend: 'Current Billing Cycle' },
    { label: 'Pending Admissions', value: 3, icon: <BarChart3 size={24} />, color: 'bg-rose-50 text-rose-600', trend: 'Review Needed' },
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8 flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 tracking-tight">Admin Console</h2>
            <p className="text-slate-500 text-sm font-medium">Mambakkam Center Management Suite</p>
          </div>
          <button className="bg-navy-900 text-white px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 hover:text-navy-900 transition-all shadow-xl shadow-navy-900/10 cursor-pointer">
            <Plus size={16} className="inline mr-2" />
            Master Registration
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h2 className="text-3xl font-bold text-navy-900">{stat.value}</h2>
              <p className={`text-[10px] font-bold mt-1 ${stat.label.includes('Pending') ? 'text-yellow-600' : 'text-slate-500'}`}>{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          {/* Main Management Table */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              <h3 className="text-navy-900 font-bold text-sm uppercase tracking-wider">Student & Enrollment Master</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter name or school..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-navy-900/5 outline-none w-full md:w-56"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10">
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Student Name</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Skill Tracks</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">School</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-sm whitespace-nowrap">{student.name}</p>
                        <p className="text-[10px] text-slate-400">PID: {student.parentId}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {student.enrolledPrograms.map(p => (
                            <span key={p} className="text-[9px] font-bold bg-navy-50 text-navy-600 px-2 py-0.5 rounded uppercase tracking-tighter">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {student.school}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-navy-900 rounded transition-all">
                            <Edit2 size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admission Requests Sidebar */}
          <div className="w-80 flex flex-col gap-8 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-navy-900 font-bold text-sm uppercase tracking-wider">Admission Intake</h3>
                <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded text-[10px] font-black">03</span>
              </div>
              
              <div className="p-6 space-y-4 overflow-auto">
                {[
                  { name: 'Sanjana Mani', age: 6, program: 'Phonics', time: '2h ago' },
                  { name: 'Varun Teja', age: 8, program: 'Abacus', time: '5h ago' },
                  { name: 'Deepika R', age: 10, program: 'English', time: '1d ago' },
                ].map((req, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="leading-tight">
                        <h4 className="font-bold text-slate-800 text-sm">{req.name}</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-bold mt-1 tracking-tighter">Request for {req.program}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">{req.time}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-navy-900 text-yellow-400 py-1.5 rounded-lg text-[10px] font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1">
                        <Check size={10} /> Approve
                      </button>
                      <button className="p-1.5 border border-slate-200 text-slate-400 rounded-lg hover:bg-white transition-all">
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Facility Status</p>
              <div className="flex items-center justify-center gap-2 mb-1">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                 <p className="text-sm font-bold text-navy-900">Mambakkam Center Active</p>
              </div>
              <p className="text-[10px] text-slate-500">Ponmar Main Road • Near SBIOA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
