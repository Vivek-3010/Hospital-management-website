/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  Database
} from 'lucide-react';
import { Doctor, Department, Appointment } from '../types';
import { DEPARTMENTS, DOCTORS } from '../data/hospitalData';
import { User as FirebaseUser } from 'firebase/auth';

interface BookingSectionProps {
  initialDoctorId: string | null;
  onBookingSuccess: (appointment: Appointment) => void;
  onNavigateToBookings: () => void;
  user: FirebaseUser | null;
  userProfile: any;
}

export default function BookingSection({ 
  initialDoctorId, 
  onBookingSuccess, 
  onNavigateToBookings,
  user,
  userProfile
}: BookingSectionProps) {
  
  // Local Form States
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  // Prefill user profile details when loaded
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setPatientName(userProfile.name);
      if (userProfile.phone) setPatientPhone(userProfile.phone);
      if (userProfile.email) setPatientEmail(userProfile.email);
    } else if (user) {
      if (user.displayName) setPatientName(user.displayName);
      if (user.email) setPatientEmail(user.email);
    }
  }, [user, userProfile]);
  
  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAppointment, setSuccessAppointment] = useState<Appointment | null>(null);
  const [submitError, setSubmitError] = useState<string>('');
  const [showRulesGuide, setShowRulesGuide] = useState<boolean>(false);
  const [copiedRules, setCopiedRules] = useState<boolean>(false);

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

  // Set initial doctor and department if redirected from doctor card
  useEffect(() => {
    if (initialDoctorId) {
      const doc = DOCTORS.find(d => d.id === initialDoctorId);
      if (doc) {
        setSelectedDeptId(doc.departmentId);
        setSelectedDoctorId(doc.id);
        // Clear slots when doctor is set
        setSelectedTime('');
      }
    } else {
      // Set default department if none selected
      setSelectedDeptId(DEPARTMENTS[0].id);
    }
  }, [initialDoctorId]);

  // Handle department changes
  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    // Reset doctor selection unless there's only one or we want to force select the first one
    const availableDocs = DOCTORS.filter(d => d.departmentId === deptId);
    if (availableDocs.length > 0) {
      setSelectedDoctorId(availableDocs[0].id);
    } else {
      setSelectedDoctorId('');
    }
    setSelectedTime('');
  };

  // Doctors belonging to the selected department
  const filteredDoctors = useMemo(() => {
    if (!selectedDeptId) return [];
    return DOCTORS.filter(doc => doc.departmentId === selectedDeptId);
  }, [selectedDeptId]);

  // Selected Doctor Object
  const selectedDoctor = useMemo(() => {
    return DOCTORS.find(d => d.id === selectedDoctorId) || null;
  }, [selectedDoctorId]);

  // Selected Department Object
  const selectedDepartment = useMemo(() => {
    return DEPARTMENTS.find(d => d.id === selectedDeptId) || null;
  }, [selectedDeptId]);

  // Determine working weekday match
  const dateDayName = useMemo(() => {
    if (!selectedDate) return '';
    const dateObj = new Date(selectedDate);
    // Use UTC string or correct timezone adjustment to avoid off-by-one errors
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  }, [selectedDate]);

  const isDoctorScheduledOnSelectedDate = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return true;
    return selectedDoctor.availability.days.includes(dateDayName);
  }, [selectedDoctor, selectedDate, dateDayName]);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setShowRulesGuide(false);
    const newErrors: Record<string, string> = {};

    if (!selectedDeptId) newErrors.dept = 'Please select a clinical department';
    if (!selectedDoctorId) newErrors.doctor = 'Please select a physician';
    if (!selectedDate) newErrors.date = 'Please select a booking date';
    if (selectedDate && !isDoctorScheduledOnSelectedDate) {
      newErrors.date = `${selectedDoctor?.name} is not scheduled to work on ${dateDayName}`;
    }
    if (!selectedTime) newErrors.time = 'Please select a time slot';
    
    if (!patientName.trim()) newErrors.name = 'Patient name is required';
    
    // Simple phone check
    const phoneRegex = /^\+?[\d\s-]{8,15}$/;
    if (!patientPhone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(patientPhone)) {
      newErrors.phone = 'Please provide a valid phone number';
    }

    // Simple email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patientEmail.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(patientEmail)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to errors or shake
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const generatedId = `apt-${Math.random().toString(36).substring(2, 9)}`;
      const appointment: Appointment = {
        id: generatedId,
        userId: user?.uid || '',
        doctorId: selectedDoctorId,
        doctorName: selectedDoctor?.name || 'NovaCare Clinician',
        departmentId: selectedDeptId,
        departmentName: selectedDepartment?.name || 'General Clinic',
        date: selectedDate,
        timeSlot: selectedTime,
        patientName,
        patientPhone,
        patientEmail,
        reason: reason.trim() || 'General Consultation Checkup',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      await onBookingSuccess(appointment);
      setSuccessAppointment(appointment);
    } catch (err: any) {
      console.error('Booking Error:', err);
      let errMsg = 'Failed to schedule appointment. Please try again.';
      if (err.message?.includes('permission-denied') || err.message?.includes('permissions')) {
        errMsg = 'Database Permissions Error: The database blocked saving this appointment because your Firestore Security Rules are locked or not configured. Please follow the step-by-step Troubleshooting Guide below.';
        setShowRulesGuide(true);
      }
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Restrict picking past dates
  const todayString = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const handleResetForm = () => {
    setSuccessAppointment(null);
    setSelectedDate('');
    setSelectedTime('');
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
    setReason('');
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left" id="appointment-booking-view">
      
      <AnimatePresence mode="wait">
        {!successAppointment ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
            id="booking-form-container"
          >
            {/* Header Title */}
            <div className="space-y-3">
              <h1 className="font-sans font-black text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                Schedule a Medical Visit
              </h1>
              <p className="font-sans text-neutral-600 text-sm sm:text-base leading-relaxed">
                Connect with our certified specialists in a few clicks. Please fill out the clinical details, select a time that fits your day, and enter your contact details securely.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden" id="booking-scheduler-form">
              <div className="p-6 sm:p-8 space-y-8">
                
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 font-sans space-y-3">
                    <div className="flex items-start space-x-2.5">
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Booking Failed</p>
                        <p className="text-red-700 leading-relaxed mt-1">{submitError}</p>
                      </div>
                    </div>
                    
                    {showRulesGuide && (
                      <div className="mt-4 border-t border-red-100 pt-4 space-y-3 text-left">
                        <div className="flex items-center space-x-2 text-red-800">
                          <Database className="h-4 w-4" />
                          <h4 className="font-sans font-black text-xs uppercase tracking-wider">Troubleshooting Guide</h4>
                        </div>
                        
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Your database was initialized in <strong>"Locked Mode"</strong>. To allow saving appointments, update your Firestore Security Rules:
                        </p>

                        <ol className="text-[11px] text-slate-600 list-decimal pl-5 space-y-1.5">
                          <li>
                            Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Firebase Console</a>.
                          </li>
                          <li>
                            Click on <strong>Firestore Database</strong> and choose the <strong>Rules</strong> tab at the top.
                          </li>
                          <li>
                            Replace existing rules with the medical configuration below and click <strong>Publish</strong>:
                          </li>
                        </ol>

                        <div className="relative mt-2">
                          <pre className="p-3 bg-slate-950 text-slate-300 font-mono text-[9px] rounded-xl overflow-x-auto max-h-36 leading-normal border border-slate-800">
                            {firestoreRulesText}
                          </pre>
                          <button
                            type="button"
                            onClick={copyRulesToClipboard}
                            className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-300 transition-colors cursor-pointer"
                            title="Copy Rules"
                          >
                            {copiedRules ? (
                              <Check className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* PART 1: Clinical Details */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs font-mono">1</span>
                    <h2 className="font-sans font-extrabold text-lg text-slate-900">Clinical Selection</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Department dropdown */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                        Clinical Specialty
                      </label>
                      <select
                        value={selectedDeptId}
                        onChange={(e) => handleDeptChange(e.target.value)}
                        className={`w-full p-3.5 bg-slate-50 border rounded-xl font-sans text-sm outline-none transition-colors cursor-pointer ${
                          errors.dept ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-blue-500'
                        }`}
                        id="form-dept-select"
                      >
                        <option value="" disabled>Select Department</option>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                      {errors.dept && <p className="text-red-500 text-xs font-medium pl-1">{errors.dept}</p>}
                    </div>

                    {/* Doctor dropdown */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                        Available Specialist
                      </label>
                      <select
                        value={selectedDoctorId}
                        onChange={(e) => {
                          setSelectedDoctorId(e.target.value);
                          setSelectedTime(''); // Reset selected time
                        }}
                        disabled={!selectedDeptId}
                        className={`w-full p-3.5 bg-slate-50 disabled:bg-slate-100 border rounded-xl font-sans text-sm outline-none transition-colors cursor-pointer ${
                          errors.doctor ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-blue-500'
                        }`}
                        id="form-doctor-select"
                      >
                        <option value="" disabled>Select Doctor</option>
                        {filteredDoctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} - {doc.specialty}
                          </option>
                        ))}
                      </select>
                      {errors.doctor && <p className="text-red-500 text-xs font-medium pl-1">{errors.doctor}</p>}
                    </div>
                  </div>
                </div>

                {/* PART 2: Date and Time selection */}
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs font-mono">2</span>
                    <h2 className="font-sans font-extrabold text-lg text-slate-900">Date & Hour Schedule</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Date picker */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                        Appointment Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          min={todayString}
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedTime(''); // Reset time
                          }}
                          className={`w-full p-3.5 bg-slate-50 border rounded-xl font-sans text-sm outline-none transition-colors cursor-pointer ${
                            errors.date ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-blue-500'
                          }`}
                          id="form-date-input"
                        />
                      </div>
                      
                      {/* Interactive Schedule Check Alert */}
                      {selectedDate && selectedDoctor && (
                        <div className={`p-3.5 rounded-xl border flex items-start space-x-3.5 text-xs ${
                          isDoctorScheduledOnSelectedDate
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          {isDoctorScheduledOnSelectedDate ? (
                            <>
                              <CheckCircle2 className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold">{selectedDoctor.name} is scheduled on {dateDayName}s.</p>
                                <p className="text-blue-600 font-medium mt-0.5">Hours: {selectedDoctor.availability.hours}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold">Not scheduled on {dateDayName}s.</p>
                                <p className="text-red-700 font-medium mt-0.5">
                                  {selectedDoctor.name} works on: <span className="font-bold">{selectedDoctor.availability.days.join(', ')}</span>.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {errors.date && <p className="text-red-500 text-xs font-medium pl-1">{errors.date}</p>}
                    </div>

                    {/* Time slots grid */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                        Available Hour Slots
                      </label>
                      
                      {selectedDoctor ? (
                        <div className="grid grid-cols-3 gap-2" id="form-time-slots-container">
                          {selectedDoctor.availability.slots.map((slot) => {
                            const isSelected = selectedTime === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={selectedDate && !isDoctorScheduledOnSelectedDate}
                                onClick={() => setSelectedTime(slot)}
                                className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer text-center ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-50'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:hover:bg-slate-50 disabled:cursor-not-allowed'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-semibold italic">
                          Please select a doctor to view scheduled hourly slots.
                        </div>
                      )}
                      {errors.time && <p className="text-red-500 text-xs font-medium pl-1">{errors.time}</p>}
                    </div>
                  </div>
                </div>

                {/* PART 3: Patient Information */}
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs font-mono">3</span>
                    <h2 className="font-sans font-extrabold text-lg text-slate-900">Patient Credentials</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Patient Full Name */}
                    <div className="space-y-2 sm:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                        Patient Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl font-sans text-sm outline-none transition-colors ${
                            errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-blue-500'
                          }`}
                          id="form-patient-name"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs font-medium pl-1">{errors.name}</p>}
                    </div>

                    {/* Patient Phone */}
                    <div className="space-y-2 sm:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="(555) 019-2834"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl font-sans text-sm outline-none transition-colors ${
                            errors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-blue-500'
                          }`}
                          id="form-patient-phone"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs font-medium pl-1">{errors.phone}</p>}
                    </div>

                    {/* Patient Email */}
                    <div className="space-y-2 sm:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="johndoe@gmail.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl font-sans text-sm outline-none transition-colors ${
                            errors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-blue-500'
                          }`}
                          id="form-patient-email"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs font-medium pl-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Reason for Visit (Medical Notes)
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <textarea
                        rows={3}
                        placeholder="Please describe symptoms, follow-up goals, or previous diagnostics..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-sm outline-none transition-colors resize-none"
                        id="form-visit-reason"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Submit Row */}
              <div className="px-6 py-5 bg-slate-50 border-t border-slate-150 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Instant SMS & Email Reminders</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-sm font-semibold px-6 py-3.5 rounded-xl shadow-md shadow-blue-100 hover:shadow-blue-200 transition-all cursor-pointer disabled:opacity-50"
                  id="form-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      <span>Secure Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* SUCCESS VIEW */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden p-8 sm:p-12 text-center space-y-8"
            id="booking-success-view"
          >
            {/* Visual Success Accent */}
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="h-10 w-10 text-blue-600 animate-bounce" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Appointment Booked Successfully!
              </h2>
              <p className="font-sans text-slate-500 text-sm max-w-lg mx-auto">
                Your medical consultation is secure. A text notification and email receipt have been forwarded to you with digital check-in barcodes.
              </p>
            </div>

            {/* Summarized Card */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
                <span className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">Appointment Details</span>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-mono font-bold text-[10px] uppercase">
                  {successAppointment.id}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Physician:</span>
                  <span className="font-bold text-slate-900">{successAppointment.doctorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Specialty:</span>
                  <span className="font-semibold text-slate-800">{successAppointment.departmentName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Date scheduled:</span>
                  <span className="font-bold text-blue-600">{successAppointment.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Scheduled hour:</span>
                  <span className="font-bold text-blue-600">{successAppointment.timeSlot}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-dashed border-slate-200">
                  <span className="text-slate-500 font-medium">Patient:</span>
                  <span className="font-semibold text-slate-900">{successAppointment.patientName}</span>
                </div>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button
                onClick={onNavigateToBookings}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:-translate-y-0.5 transition-all cursor-pointer text-sm"
                id="success-view-bookings-btn"
              >
                <span>View My Appointments</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={handleResetForm}
                className="flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-xl transition-all cursor-pointer text-sm"
                id="success-book-another-btn"
              >
                <span>Book Another Visit</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
