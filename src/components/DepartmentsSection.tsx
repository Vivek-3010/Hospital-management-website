/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Bone, 
  Baby, 
  Brain, 
  Sparkles, 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight, 
  Calendar,
  Star,
  Clock,
  User,
  ExternalLink
} from 'lucide-react';
import { Department, Doctor } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';

// Map iconName to Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  Heart,
  Bone,
  Baby,
  Brain,
  Sparkles,
  Stethoscope,
};

interface DepartmentsSectionProps {
  onBookDoctor: (doctor: Doctor) => void;
  onViewDoctorDetails: (doctor: Doctor) => void;
}

export default function DepartmentsSection({ onBookDoctor, onViewDoctorDetails }: DepartmentsSectionProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('cardiology');

  const selectedDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];
  const deptDoctors = DOCTORS.filter(doc => doc.departmentId === selectedDept.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left" id="departments-view">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          <span>Clinical Excellence</span>
        </div>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Specialized Clinical Departments
        </h1>
        <p className="font-sans text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          NovaCare Medical Center boasts world-class facilities and specialized treatment programs across six main clinical fields. Tap on any department below to explore their premium medical services and meet our leading physicians.
        </p>
      </div>

      {/* Main Grid: Sidebar Navigator + Detail Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Hand Navigation Rail */}
        <div className="lg:col-span-4 space-y-3" id="department-sidebar">
          <p className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Select a specialty</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {DEPARTMENTS.map((dept) => {
              const IconComponent = iconMap[dept.iconName] || Stethoscope;
              const isSelected = dept.id === selectedDeptId;
              
              return (
                <button
                  key={dept.id}
                  id={`dept-tab-${dept.id}`}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`flex items-center space-x-4 p-4.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`p-2.5 rounded-xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-600'}`}>
                    <IconComponent className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-sans font-bold text-sm sm:text-base leading-snug">{dept.name}</h3>
                    <p className={`text-xs mt-0.5 line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {dept.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Hand Detail Stage */}
        <div className="lg:col-span-8 space-y-10" id="department-detail-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDept.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm space-y-8 p-6 sm:p-8"
            >
              {/* Image banner & Title */}
              <div className="space-y-6">
                <div className="h-60 sm:h-72 rounded-2xl overflow-hidden relative shadow-inner bg-slate-100">
                  <img 
                    src={selectedDept.image} 
                    alt={selectedDept.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedDept.id}/800/600`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white space-y-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400 font-mono bg-blue-950/40 backdrop-blur-md px-2.5 py-1 rounded-md">
                      Specialization Details
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black font-sans">{selectedDept.name} Department</h2>
                  </div>
                </div>
                
                <p className="font-sans text-slate-600 text-base leading-relaxed">
                  {selectedDept.longDescription}
                </p>
              </div>

              {/* Bulleted Services */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="font-sans font-bold text-lg text-slate-900">Specialized Services Offered</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedDept.services.map((service, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-sm text-slate-700">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departmental Doctors list */}
              <div className="space-y-6 pt-8 border-t border-slate-100" id="department-doctors-roster">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans font-bold text-lg text-slate-900">
                    Doctors in {selectedDept.name} ({deptDoctors.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {deptDoctors.map((doc) => (
                    <div 
                      key={doc.id}
                      className="bg-slate-50 rounded-2xl border border-slate-200/60 p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        <img 
                          src={doc.image} 
                          alt={doc.name} 
                          className="h-16 w-16 rounded-2xl object-cover shrink-0 bg-slate-200 border-2 border-white shadow-sm"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${doc.id}/400/400`;
                          }}
                        />
                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-base text-slate-900 leading-snug">{doc.name}</h4>
                          <p className="text-xs text-blue-600 font-semibold">{doc.title}</p>
                          <div className="flex items-center text-xs text-slate-500 space-x-3.5 pt-1">
                            <span className="flex items-center text-yellow-500 font-bold">
                              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 mr-1" />
                              {doc.rating}
                            </span>
                            <span>{doc.experience} Years Exp</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-200/30 flex items-center justify-between gap-3">
                        <button
                          onClick={() => onViewDoctorDetails(doc)}
                          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white px-3 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>View Profile</span>
                        </button>
                        <button
                          onClick={() => onBookDoctor(doc)}
                          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Book Doctor</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
