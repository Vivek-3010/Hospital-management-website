/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  Award, 
  BookOpen, 
  Mail, 
  Clock, 
  Calendar, 
  Users, 
  X,
  ChevronRight,
  Activity
} from 'lucide-react';
import { Doctor } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';

interface DoctorsSectionProps {
  onBookDoctor: (doctor: Doctor) => void;
  selectedDoctorDetail: Doctor | null;
  setSelectedDoctorDetail: (doctor: Doctor | null) => void;
}

export default function DoctorsSection({ onBookDoctor, selectedDoctorDetail, setSelectedDoctorDetail }: DoctorsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'experience'

  // Filter and Sort doctors
  const filteredDoctors = useMemo(() => {
    let result = [...DOCTORS];

    // Search query
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (doc) => 
          doc.name.toLowerCase().includes(query) || 
          doc.specialty.toLowerCase().includes(query) ||
          doc.bio.toLowerCase().includes(query)
      );
    }

    // Department filter
    if (selectedDeptFilter !== 'all') {
      result = result.filter((doc) => doc.departmentId === selectedDeptFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'experience') {
        return b.experience - a.experience;
      }
      return 0;
    });

    return result;
  }, [searchTerm, selectedDeptFilter, sortBy]);

  const activeDeptInfo = useMemo(() => {
    if (selectedDeptFilter === 'all') return null;
    return DEPARTMENTS.find(d => d.id === selectedDeptFilter);
  }, [selectedDeptFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left" id="doctors-view">
      
      {/* Header Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          <span>Our Specialists</span>
        </div>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Meet Our Expert Doctors & Clinicians
        </h1>
        <p className="font-sans text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          At NovaCare, our staff consists of highly certified medical leaders dedicated to patient-centric outcomes. Filter by departments or search specialists to find the perfect health partner.
        </p>
      </div>

      {/* Control Panel: Search & Filter bar */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center" id="doctors-controls">
        {/* Search Input */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, specialty, bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-sm outline-none transition-all"
            id="doctor-search-input"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Department filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-xs sm:text-sm font-medium outline-none transition-colors cursor-pointer"
              id="department-filter-select"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-500 font-semibold font-mono uppercase">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-xs sm:text-sm font-medium outline-none transition-colors cursor-pointer"
              id="doctor-sort-select"
            >
              <option value="rating">Highest Rating</option>
              <option value="experience">Years of Experience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="relative" id="doctors-grid-container">
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc, idx) => {
              const dept = DEPARTMENTS.find((d) => d.id === doc.departmentId);
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
                  id={`doctor-card-${doc.id}`}
                >
                  {/* Doctor Thumbnail */}
                  <div className="relative h-64 overflow-hidden bg-slate-100 group">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${doc.id}/400/400`;
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-100 flex items-center space-x-1.5 shadow-sm">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      <span className="font-sans font-bold text-xs text-slate-800">{doc.rating}</span>
                    </div>
                    {dept && (
                      <div className="absolute bottom-4 left-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono font-bold text-white shadow-sm">
                        {dept.name}
                      </div>
                    )}
                  </div>

                  {/* Doctor Info Block */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-sans font-extrabold text-xl text-slate-900 leading-snug">{doc.name}</h3>
                      <p className="text-xs font-semibold text-blue-600 font-mono uppercase tracking-wider">{doc.title}</p>
                      <p className="text-xs text-slate-600 font-medium">{doc.specialty}</p>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-2 italic">
                        "{doc.bio}"
                      </p>
                    </div>

                    {/* Simple Stats block */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-center border border-slate-200/50">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-mono tracking-wider">Experience</p>
                        <p className="font-sans font-extrabold text-slate-800 text-sm sm:text-base mt-0.5">{doc.experience} Years</p>
                      </div>
                      <div className="border-l border-slate-200">
                        <p className="text-xs text-slate-500 uppercase font-mono tracking-wider">Patients</p>
                        <p className="font-sans font-extrabold text-slate-800 text-sm sm:text-base mt-0.5">{doc.patientsCount}+</p>
                      </div>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-4">
                    <button
                      onClick={() => setSelectedDoctorDetail(doc)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 bg-white px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onBookDoctor(doc)}
                      className="flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-50 hover:shadow-blue-100 transition-all cursor-pointer flex-grow"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <p className="text-slate-500 font-sans text-base">No doctors matched your current search parameters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDeptFilter('all');
              }}
              className="text-blue-600 font-semibold hover:underline text-sm cursor-pointer"
            >
              Clear filters and search again
            </button>
          </div>
        )}
      </div>

      {/* Doctor Detail Modal (Slide-over or popup) */}
      <AnimatePresence>
        {selectedDoctorDetail && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center" id="doctor-detail-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoctorDetail(null)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl max-w-2xl w-full mx-4 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-left border border-neutral-200 z-10"
            >
              {/* Top bar */}
              <div className="absolute top-5 right-5 z-20">
                <button
                  onClick={() => setSelectedDoctorDetail(null)}
                  className="p-2.5 bg-neutral-900/60 hover:bg-neutral-900 text-white rounded-full transition-colors cursor-pointer"
                  id="close-doctor-modal-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="overflow-y-auto flex-grow">
                {/* Header portrait banner */}
                <div className="relative h-60 sm:h-72 bg-slate-100">
                  <img
                    src={selectedDoctorDetail.image}
                    alt={selectedDoctorDetail.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedDoctorDetail.id}/400/400`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <p className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold bg-blue-950/50 backdrop-blur-sm px-2.5 py-1 rounded-md inline-block">
                      {DEPARTMENTS.find(d => d.id === selectedDoctorDetail.departmentId)?.name || 'NovaCare Clinician'}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black font-sans leading-tight">{selectedDoctorDetail.name}</h2>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">{selectedDoctorDetail.title}</p>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Bio */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Professional Bio</h3>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic">
                      "{selectedDoctorDetail.bio}"
                    </p>
                  </div>

                  {/* Core details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-sm text-slate-700">
                        <Award className="h-5 w-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900">Experience & Practice</p>
                          <p className="text-xs text-slate-500 mt-0.5">{selectedDoctorDetail.experience} Years active ({selectedDoctorDetail.patientsCount}+ patients)</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-sm text-slate-700">
                        <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900">Direct Contact Email</p>
                          <p className="text-xs text-slate-500 mt-0.5">{selectedDoctorDetail.contactEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 text-sm text-slate-700">
                        <Clock className="h-5 w-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900">Clinical Hours</p>
                          <p className="text-xs text-slate-500 mt-0.5">{selectedDoctorDetail.availability.hours}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-sm text-slate-700">
                        <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900">Working Days</p>
                          <p className="text-xs text-slate-500 mt-0.5">{selectedDoctorDetail.availability.days.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education qualifications */}
                  <div className="space-y-3.5 pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Academic Qualifications</h3>
                    <ul className="space-y-2.5">
                      {selectedDoctorDetail.education.map((edu, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700">
                          <BookOpen className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-1" />
                          <span className="font-medium">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Available Time Slots preview */}
                  <div className="space-y-3 pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Daily Time Slots</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctorDetail.availability.slots.map((slot, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Book CTA */}
              <div className="p-6 border-t border-slate-150 bg-slate-50 flex items-center justify-between gap-4">
                <div className="hidden sm:block">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Appointment Fee</p>
                  <p className="text-lg font-black text-slate-900">$120 <span className="text-xs text-slate-400 font-normal">/ Consultation</span></p>
                </div>
                <button
                  onClick={() => {
                    onBookDoctor(selectedDoctorDetail);
                    setSelectedDoctorDetail(null);
                  }}
                  className="flex w-full sm:w-auto items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-100 transition-colors cursor-pointer"
                  id="modal-book-cta"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Consultation</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
