/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Trash, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  Search,
  RefreshCw,
  FileText,
  Activity,
  Check,
  Copy,
  Database
} from 'lucide-react';
import { Appointment, Doctor } from '../types';
import { DOCTORS } from '../data/hospitalData';

interface MyBookingsSectionProps {
  appointments: Appointment[];
  hasFirestorePermissionError?: boolean;
  onCancelAppointment: (appointmentId: string) => void;
  onRescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => void;
  onNavigateToBookingForm: () => void;
}

export default function MyBookingsSection({ 
  appointments, 
  hasFirestorePermissionError = false,
  onCancelAppointment, 
  onRescheduleAppointment,
  onNavigateToBookingForm
}: MyBookingsSectionProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [copiedRules, setCopiedRules] = useState(false);

  const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() && request.auth.token.email == "vivektest@gmail.com";
    }

    // Users Collection Rules
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId) 
        && request.resource.data.keys().hasAll(['uid', 'email'])
        && request.resource.data.uid == request.auth.uid;
      allow update: if (isOwner(userId) && request.resource.data.uid == resource.data.uid) || isAdmin();
      allow delete: if isAdmin();
    }

    // Bookings Collection Rules
    match /bookings/{bookingId} {
      allow read, list: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      
      allow create: if isSignedIn() 
        && (request.resource.data.userId == request.auth.uid || isAdmin())
        && request.resource.data.status == 'scheduled'
        && request.resource.data.keys().hasAll(['id', 'userId', 'doctorId', 'doctorName', 'departmentId', 'departmentName', 'date', 'timeSlot', 'patientName', 'patientPhone', 'patientEmail', 'status', 'createdAt']);

      allow update: if isSignedIn()
        && (resource.data.userId == request.auth.uid || isAdmin())
        && (isAdmin() || (
          request.resource.data.userId == request.auth.uid
          && request.resource.data.id == resource.data.id
          && request.resource.data.doctorId == resource.data.doctorId
          && request.resource.data.createdAt == resource.data.createdAt
        ));

      allow delete: if isAdmin();
    }
  }
}`;

  const copyRulesToClipboard = () => {
    navigator.clipboard.writeText(firestoreRulesText);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 3000);
  };
  
  // Rescheduling Modal State
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');

  // Cancel Confirmation Modal State
  const [cancellingAptId, setCancellingAptId] = useState<string | null>(null);

  // Retrieve matching doctor object for rescheduling validation
  const reschedulingDoctor = useMemo(() => {
    if (!reschedulingApt) return null;
    return DOCTORS.find(d => d.id === reschedulingApt.doctorId) || null;
  }, [reschedulingApt]);

  // Determine reschedule weekday match
  const rescheduleDayName = useMemo(() => {
    if (!rescheduleDate) return '';
    const dateObj = new Date(rescheduleDate);
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  }, [rescheduleDate]);

  const isRescheduleDoctorScheduled = useMemo(() => {
    if (!reschedulingDoctor || !rescheduleDate) return true;
    return reschedulingDoctor.availability.days.includes(rescheduleDayName);
  }, [reschedulingDoctor, rescheduleDate, rescheduleDayName]);

  // Stats
  const stats = useMemo(() => {
    const total = appointments.length;
    const active = appointments.filter(a => a.status === 'scheduled').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    return { total, active, cancelled };
  }, [appointments]);

  // Filtering
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }

    // Search term
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.departmentName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }

    // Sort by scheduled date descending (most recent appointment date first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  }, [appointments, statusFilter, searchTerm]);

  // Handle open reschedule modal
  const handleOpenReschedule = (apt: Appointment) => {
    setReschedulingApt(apt);
    setRescheduleDate(apt.date);
    setRescheduleTime(apt.timeSlot);
    setRescheduleError('');
  };

  // Submit reschedule
  const handleSubmitReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleDate) {
      setRescheduleError('Please select a new appointment date');
      return;
    }
    if (!isRescheduleDoctorScheduled) {
      setRescheduleError(`${reschedulingDoctor?.name} is not scheduled to work on ${rescheduleDayName}s.`);
      return;
    }
    if (!rescheduleTime) {
      setRescheduleError('Please select a time slot');
      return;
    }

    onRescheduleAppointment(reschedulingApt!.id, rescheduleDate, rescheduleTime);
    setReschedulingApt(null);
  };

  const handleConfirmCancel = () => {
    if (cancellingAptId) {
      onCancelAppointment(cancellingAptId);
      setCancellingAptId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left animate-fade-in" id="bookings-dashboard">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <h1 className="font-sans font-black text-3xl text-slate-900 tracking-tight">My Appointments</h1>
          <p className="font-sans text-slate-500 text-sm">
            Review, reschedule, or cancel your upcoming clinical visits.
          </p>
        </div>
        <div>
          <button
            onClick={onNavigateToBookingForm}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md cursor-pointer transition-colors"
            id="book-new-visit-btn"
          >
            <span>Book New Appointment</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4" id="bookings-stats-grid">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase font-mono tracking-wider">Total Booked</span>
          <span className="font-sans font-black text-2xl text-slate-950 mt-2">{stats.total}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-blue-600 font-bold uppercase font-mono tracking-wider">Scheduled</span>
          <span className="font-sans font-black text-2xl text-blue-600 mt-2">{stats.active}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-red-400 font-bold uppercase font-mono tracking-wider">Cancelled</span>
          <span className="font-sans font-black text-2xl text-red-500 mt-2">{stats.cancelled}</span>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-sm outline-none transition-colors"
            id="bookings-search-input"
          />
        </div>

        {/* Status Filter Toggles */}
        <div className="flex items-center space-x-1 border border-slate-200 rounded-xl p-1 bg-slate-50 shrink-0">
          {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-lg cursor-pointer transition-colors ${
                statusFilter === status
                  ? 'bg-white text-blue-600 border border-slate-200 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {hasFirestorePermissionError && (
        <div className="border border-red-200 bg-red-50/70 rounded-3xl p-6 text-left space-y-4 animate-fade-in" id="rules-guide-box">
          <div className="flex items-center space-x-2.5 text-red-800">
            <Database className="h-5 w-5" />
            <h3 className="font-sans font-black text-base tracking-tight">Firestore Database Permissions Error</h3>
          </div>
          
          <p className="font-sans text-xs text-slate-700 leading-relaxed">
            The database blocked retrieving your appointments because your <strong>Firestore Security Rules</strong> are locked or not configured. Follow these quick steps to enable secure access and see your booked appointments in real-time:
          </p>

          <ol className="font-sans text-xs text-slate-700 list-decimal pl-5 space-y-2">
            <li>
              Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Firebase Console</a> and open your project.
            </li>
            <li>
              Click on <strong>Firestore Database</strong> in the left menu.
            </li>
            <li>
              Click the <strong>Rules</strong> tab at the top of the Firestore dashboard.
            </li>
            <li>
              Replace the existing rules with the clinical configuration below:
            </li>
          </ol>

          <div className="relative">
            <pre className="p-3 bg-slate-950 text-slate-300 font-mono text-[10px] rounded-xl overflow-x-auto max-h-48 leading-normal border border-slate-800">
              {firestoreRulesText}
            </pre>
            <button
              type="button"
              onClick={copyRulesToClipboard}
              className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title="Copy Rules"
            >
              {copiedRules ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <ol className="font-sans text-xs text-slate-700 list-decimal pl-5 space-y-2" start={5}>
            <li>
              Click the <strong>Publish</strong> button at the top-right to apply.
            </li>
            <li>
              Return to this tab, and your appointments will immediately sync and appear in the list below!
            </li>
          </ol>
        </div>
      )}

      {/* Appointment Listings */}
      <div className="space-y-4" id="bookings-list-view">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => {
            const isCancelled = apt.status === 'cancelled';
            const isCompleted = apt.status === 'completed';
            const isScheduled = apt.status === 'scheduled';

            return (
              <div 
                key={apt.id}
                className={`bg-white border rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                  isCancelled ? 'border-slate-150 opacity-75' : 'border-slate-200'
                }`}
                id={`appointment-card-${apt.id}`}
              >
                {/* Left Block: Doctor, Specialty, Date & Hour */}
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-2xl shrink-0">
                    <Calendar className={`h-6 w-6 ${isCancelled ? 'text-slate-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="font-sans font-bold text-lg text-slate-900 leading-none">{apt.doctorName}</h3>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                        isScheduled ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        isCancelled ? 'bg-red-50 text-red-600 border border-red-100' :
                        'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{apt.departmentName}</p>
                    
                    {/* Timestamp Grid */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-xs font-semibold text-slate-600 font-sans">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{apt.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{apt.timeSlot}</span>
                      </span>
                    </div>

                    {/* Patient credentials summary */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-3 text-[11px] text-slate-400 border-t border-dashed border-slate-100 mt-2">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>Patient: <span className="font-bold text-slate-600">{apt.patientName}</span></span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{apt.patientEmail}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Block: Action Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 shrink-0">
                  {isScheduled && (
                    <>
                      <button
                        onClick={() => handleOpenReschedule(apt)}
                        className="flex items-center justify-center space-x-1 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex-grow md:flex-grow-0"
                        id={`reschedule-btn-${apt.id}`}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Reschedule</span>
                      </button>
                      <button
                        onClick={() => setCancellingAptId(apt.id)}
                        className="flex items-center justify-center space-x-1 bg-red-50 hover:bg-red-100/70 border border-red-100 hover:border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex-grow md:flex-grow-0"
                        id={`cancel-btn-${apt.id}`}
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                  {isCancelled && (
                    <span className="text-xs text-slate-400 font-mono italic">Appointment Cancelled</span>
                  )}
                  {isCompleted && (
                    <span className="text-xs text-blue-600 font-mono font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Consultation Completed</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <p className="text-slate-500 font-sans text-base">You do not have any appointments matching this category.</p>
            <button
              onClick={onNavigateToBookingForm}
              className="text-blue-600 font-bold hover:underline text-sm cursor-pointer"
            >
              Click here to schedule your first visit
            </button>
          </div>
        )}
      </div>

      {/* DIALOG 1: Cancellation Confirmation */}
      <AnimatePresence>
        {cancellingAptId && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center" id="cancel-confirm-modal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancellingAptId(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl max-w-sm w-full mx-4 p-6 shadow-2xl border border-slate-200 text-center space-y-5 z-10"
            >
              <div className="flex justify-center">
                <span className="p-3 bg-red-50 text-red-600 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </span>
              </div>
              <div className="space-y-1.5">
                <h3 className="font-sans font-extrabold text-lg text-slate-900">Cancel Appointment?</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to cancel this appointment? This action will open your slot back up to other clinical patients and cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancellingAptId(null)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  No, Keep Slot
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  id="confirm-cancel-btn"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIALOG 2: Quick Reschedule Modal */}
      <AnimatePresence>
        {reschedulingApt && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center" id="reschedule-modal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReschedulingApt(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-3xl max-w-md w-full mx-4 shadow-2xl overflow-hidden border border-slate-200 z-10"
            >
              <form onSubmit={handleSubmitReschedule}>
                <div className="p-6 space-y-6">
                  {/* Header Title */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h3 className="font-sans font-extrabold text-lg text-slate-900">Reschedule Consultation</h3>
                    <button 
                      type="button" 
                      onClick={() => setReschedulingApt(null)}
                      className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {rescheduleError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium flex items-start space-x-2.5">
                      <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0" />
                      <span>{rescheduleError}</span>
                    </div>
                  )}

                  {/* Doctor Info Indicator */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50 flex items-center space-x-3 text-sm">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-800">{reschedulingApt.doctorName}</p>
                      <p className="text-xs text-slate-500 font-medium">{reschedulingApt.departmentName}</p>
                    </div>
                  </div>

                  {/* Date Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      New Booking Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={rescheduleDate}
                      onChange={(e) => {
                        setRescheduleDate(e.target.value);
                        setRescheduleTime('');
                        setRescheduleError('');
                      }}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm outline-none focus:border-blue-500 transition-colors"
                      id="reschedule-date-input"
                    />
                    
                    {rescheduleDate && reschedulingDoctor && (
                      <div className={`p-3 rounded-xl border flex items-start space-x-2 text-xs ${
                        isRescheduleDoctorScheduled
                          ? 'bg-blue-50 border-blue-100 text-blue-800'
                          : 'bg-red-50 border-red-100 text-red-800'
                      }`}>
                        {isRescheduleDoctorScheduled ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold">{reschedulingDoctor.name} works on {rescheduleDayName}s.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold">Doctor is off on {rescheduleDayName}s.</p>
                              <p className="text-red-700 text-[11px] mt-0.5">Works on: {reschedulingDoctor.availability.days.join(', ')}</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Time Slots */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Available Time Slots
                    </label>
                    {reschedulingDoctor ? (
                      <div className="grid grid-cols-3 gap-2">
                        {reschedulingDoctor.availability.slots.map((slot) => {
                          const isSelected = rescheduleTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={rescheduleDate && !isRescheduleDoctorScheduled}
                              onClick={() => {
                                setRescheduleTime(slot);
                                setRescheduleError('');
                              }}
                              className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 disabled:opacity-45'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No specialist loaded</p>
                    )}
                  </div>
                </div>

                {/* Submit Row */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setReschedulingApt(null)}
                    className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all"
                    id="confirm-reschedule-btn"
                  >
                    Reschedule Now
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
