/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Search, 
  Filter, 
  Plus, 
  Check, 
  X, 
  Calendar, 
  User, 
  Phone, 
  Clock, 
  FileText, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  ChevronRight,
  Database,
  Activity,
  LogOut
} from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { Appointment, Doctor, Department } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';

interface AdminSectionProps {
  appointments: Appointment[];
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
  user: any;
  onSignOut: () => void;
  setActiveTab: (tab: string) => void;
}

export default function AdminSection({ 
  appointments, 
  showToast, 
  user, 
  onSignOut,
  setActiveTab
}: AdminSectionProps) {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  // Scheduler Modal State
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isAdmin = user && user.email === 'vivektest@gmail.com';

  // Available doctors based on selected department
  const filteredDoctors = DOCTORS.filter(d => !selectedDeptId || d.departmentId === selectedDeptId);

  // Time Slots list
  const availableSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
    "03:00 PM", "03:30 PM", "04:00 PM"
  ];

  // Auto-reset doctor selection if department changes and selected doctor is not in that department
  useEffect(() => {
    if (selectedDeptId && selectedDoctorId) {
      const docObj = DOCTORS.find(d => d.id === selectedDoctorId);
      if (docObj && docObj.departmentId !== selectedDeptId) {
        setSelectedDoctorId('');
      }
    }
  }, [selectedDeptId]);

  // Handle Admin Auth Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    if (email.trim().toLowerCase() !== 'vivektest@gmail.com') {
      setLoginError('Access Denied: Only designated administrators are authorized.');
      setIsLoading(false);
      return;
    }

    try {
      // First attempt standard sign in
      await signInWithEmailAndPassword(auth, email.trim(), password);
      showToast('Admin workspace authorized successfully.', 'success');
    } catch (err: any) {
      console.error('Admin Sign In failed:', err);
      
      // Auto-provision fallback if the credentials match but user does not exist in Firebase yet
      if (password === 'vivektest') {
        try {
          showToast('First-time setup: Provisioning administrator credentials in database...', 'info');
          const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
          
          // Set profile
          await setDoc(doc(db, 'users', credential.user.uid), {
            uid: credential.user.uid,
            email: email.trim().toLowerCase(),
            name: 'NovaCare Admin',
            phone: '000-000-0000',
            role: 'admin',
            createdAt: new Date().toISOString()
          });

          showToast('Admin credential successfully registered and logged in.', 'success');
        } catch (createErr: any) {
          console.error('Admin registration error:', createErr);
          setLoginError(`Database Auth Error: ${createErr.message || 'Verification failed.'}`);
        }
      } else {
        setLoginError('Invalid administrator credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Manage Bookings (Update Status)
  const handleUpdateStatus = async (bookingId: string, status: 'scheduled' | 'completed' | 'cancelled') => {
    const path = 'bookings';
    try {
      await updateDoc(doc(db, path, bookingId), { status });
      showToast(`Appointment status updated to '${status}'.`, 'success');
    } catch (err: any) {
      showToast('Failed to update appointment status.', 'error');
      handleFirestoreError(err, OperationType.UPDATE, `${path}/${bookingId}`);
    }
  };

  // Manage Bookings (Delete Booking)
  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this clinical record? This action cannot be undone.')) {
      return;
    }
    const path = 'bookings';
    try {
      await deleteDoc(doc(db, path, bookingId));
      showToast('Clinical record permanently deleted from database.', 'info');
    } catch (err: any) {
      showToast('Failed to delete clinical record.', 'error');
      handleFirestoreError(err, OperationType.DELETE, `${path}/${bookingId}`);
    }
  };

  // Admin Side Scheduler Submission
  const handleAdminSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    const errors: Record<string, string> = {};
    if (!patientName.trim()) errors.patientName = 'Patient full name is required';
    if (!patientEmail.trim()) errors.patientEmail = 'Patient email address is required';
    if (!patientPhone.trim()) errors.patientPhone = 'Patient phone number is required';
    if (!selectedDeptId) errors.dept = 'Please select a clinical department';
    if (!selectedDoctorId) errors.doctor = 'Please select a medical practitioner';
    if (!selectedDate) errors.date = 'Please select a clinical date';
    if (!selectedTimeSlot) errors.time = 'Please select an appointment slot';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const deptObj = DEPARTMENTS.find(d => d.id === selectedDeptId);
    const docObj = DOCTORS.find(d => d.id === selectedDoctorId);

    const generatedId = `apt-adm-${Math.random().toString(36).substring(2, 9)}`;
    const newBooking: Appointment = {
      id: generatedId,
      userId: user?.uid || 'admin-backoffice',
      doctorId: selectedDoctorId,
      doctorName: docObj?.name || 'Practitioner',
      departmentId: selectedDeptId,
      departmentName: deptObj?.name || 'Department',
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim(),
      reason: reason.trim() || 'General Clinical Consultation (Scheduled by Administration)',
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    const path = 'bookings';
    try {
      await setDoc(doc(db, path, generatedId), newBooking);
      showToast(`Appointment booked successfully for ${patientName}!`, 'success');
      
      // Reset state
      setIsSchedulerOpen(false);
      setPatientName('');
      setPatientEmail('');
      setPatientPhone('');
      setSelectedDeptId('');
      setSelectedDoctorId('');
      setSelectedDate('');
      setSelectedTimeSlot('');
      setReason('');
    } catch (err: any) {
      console.error('Admin booking error:', err);
      showToast('Failed to schedule appointment from admin side.', 'error');
      handleFirestoreError(err, OperationType.CREATE, `${path}/${generatedId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Login Panel
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 px-4" id="admin-login-panel">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 bg-red-50 border border-red-100 rounded-2xl text-red-600 mb-2">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h1 className="font-sans font-black text-2xl tracking-tight text-slate-800">
              Admin Workspace Access
            </h1>
            <p className="font-sans text-xs text-slate-500 max-w-xs mx-auto">
              This area contains protected clinical datasets and administrative functions. Authorized access only.
            </p>
          </div>

          {loginError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start space-x-2.5 animate-shake">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vivektest@gmail.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block font-sans text-xs font-bold text-slate-700 uppercase tracking-wider">
                Workspace Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-sans text-sm focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center space-x-1.5 text-slate-600 font-bold text-[10px] uppercase tracking-wide">
                <Database className="h-3.5 w-3.5 text-blue-500" />
                <span>Default Authorized Credentials</span>
              </div>
              <p className="font-sans text-[11px] text-slate-500 leading-normal">
                Use clinical admin email <strong>vivektest@gmail.com</strong> with password <strong>vivektest</strong>. System will automatically register these credentials in Firebase Auth on first submission.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-sans text-sm font-semibold py-3.5 rounded-xl shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Log In as Admin</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard Grid stats
  const totalCount = appointments.length;
  const scheduledCount = appointments.filter(a => a.status === 'scheduled').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

  // Apply filters
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientPhone.includes(searchTerm) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === 'all' || apt.doctorId === doctorFilter;
    const matchesDept = deptFilter === 'all' || apt.departmentId === deptFilter;

    return matchesSearch && matchesStatus && matchesDoctor && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="admin-portal-dashboard">
      
      {/* Admin Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm" id="admin-welcome-bar">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-sans font-bold text-xs uppercase tracking-wider text-blue-600">
              Clinical Workspace
            </span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl tracking-tight text-slate-800">
            Hospital Administration Portal
          </h1>
          <p className="font-sans text-xs text-slate-500">
            Logged in as <strong>{user?.email}</strong>. Managing global real-time patient registrations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsSchedulerOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-blue-100 transition-all cursor-pointer"
            id="admin-add-booking-btn"
          >
            <Plus className="h-4 w-4" />
            <span>Add Appointment</span>
          </button>
          
          <button
            onClick={onSignOut}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-100 font-sans text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            id="admin-logout-btn"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Clinical Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="clinical-metrics-grid">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Total Registrations
            </p>
            <p className="font-sans font-black text-2xl text-slate-800">{totalCount}</p>
          </div>
          <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Scheduled / Active
            </p>
            <p className="font-sans font-black text-2xl text-blue-600">{scheduledCount}</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Completed Visits
            </p>
            <p className="font-sans font-black text-2xl text-green-600">{completedCount}</p>
          </div>
          <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Cancelled Visits
            </p>
            <p className="font-sans font-black text-2xl text-slate-400">{cancelledCount}</p>
          </div>
          <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4" id="admin-filters-panel">
        <div className="flex items-center space-x-2 text-slate-800 font-sans font-bold text-sm">
          <Filter className="h-4 w-4 text-blue-600" />
          <span>Filter Clinical Ledger</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative col-span-1 lg:col-span-1">
            <Search className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 my-auto" />
            <input
              type="text"
              placeholder="Search patient, phone, id..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all outline-none"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 transition-all outline-none"
            >
              <option value="all">All Doctors</option>
              {DOCTORS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Database Listing Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden" id="admin-appointments-ledger">
        <div className="px-6 py-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
          <div className="text-left">
            <h3 className="font-sans font-bold text-sm text-slate-800">
              Appointment Records
            </h3>
            <p className="font-mono text-[10px] text-slate-500">
              Showing {filteredAppointments.length} matching entries out of {totalCount} total.
            </p>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-150">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left font-sans text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Patient Details
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left font-sans text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Clinician / Specialty
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left font-sans text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Date & Hour
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left font-sans text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Symptoms / Reason
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left font-sans text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right font-sans text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Actions & Protocols
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 bg-white">
                {filteredAppointments.map((apt) => {
                  const docObj = DOCTORS.find(d => d.id === apt.doctorId);
                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 font-bold font-sans text-xs">
                            {apt.patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'P'}
                          </div>
                          <div>
                            <p className="font-sans font-bold text-xs text-slate-800">
                              {apt.patientName}
                            </p>
                            <div className="flex flex-col font-sans text-[10px] text-slate-500 leading-normal">
                              <span>{apt.patientEmail}</span>
                              <span>{apt.patientPhone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <p className="font-sans font-bold text-xs text-slate-800">
                          {apt.doctorName}
                        </p>
                        <p className="font-mono text-[9px] text-blue-600 font-semibold uppercase tracking-wider">
                          {apt.departmentName}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-sans font-semibold text-xs text-slate-800">
                            {apt.date}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-500 mt-0.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-mono text-[10px]">
                            {apt.timeSlot}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-left max-w-xs">
                        <p className="font-sans text-xs text-slate-600 line-clamp-2" title={apt.reason}>
                          {apt.reason}
                        </p>
                        <p className="font-mono text-[8px] text-slate-400 mt-1">
                          ID: {apt.id}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-sans text-[10px] font-bold ${
                          apt.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          apt.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                          'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {apt.status === 'scheduled' && <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-1.5 animate-pulse" />}
                          {apt.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {apt.status === 'scheduled' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'completed')}
                                className="p-1.5 bg-white hover:bg-green-50 text-slate-600 hover:text-green-600 border border-slate-200 hover:border-green-200 rounded-lg transition-colors cursor-pointer"
                                title="Mark as Completed"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                                className="p-1.5 bg-white hover:bg-red-50 text-slate-600 hover:text-red-500 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                                title="Cancel Appointment"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                          
                          {apt.status !== 'scheduled' && (
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'scheduled')}
                              className="p-1.5 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors cursor-pointer font-sans text-[10px] font-bold"
                              title="Re-schedule"
                            >
                              Re-open
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteBooking(apt.id)}
                            className="p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                            title="Delete Permanently"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 space-y-3" id="no-matching-records">
            <AlertCircle className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="font-sans text-xs">
              No matching clinical appointments found in ledger matching selected filters.
            </p>
          </div>
        )}
      </div>

      {/* ADMIN SCHEDULER DRAWER MODAL */}
      {isSchedulerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="text-left flex items-center space-x-2.5">
                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-700">
                  <Plus className="h-4 w-4" />
                </div>
                <h3 className="font-sans font-black text-base text-slate-800 tracking-tight">
                  Schedule Clinical Appointment (Admin)
                </h3>
              </div>
              <button
                onClick={() => setIsSchedulerOpen(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAdminSchedule} className="overflow-y-auto p-6 sm:p-8 space-y-6 text-left">
              
              {/* Part 1: Patient Demographics */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                  1. Patient Demographics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Patient Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 my-auto" />
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Johnathan Doe"
                        className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                    {formErrors.patientName && <p className="font-sans text-[10px] text-red-600">{formErrors.patientName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Patient Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 my-auto" />
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="555-0199"
                        className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                    {formErrors.patientPhone && <p className="font-sans text-[10px] text-red-600">{formErrors.patientPhone}</p>}
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Patient Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute inset-y-0 left-3 h-4 w-4 text-slate-400 my-auto" />
                      <input
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        className="block w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 outline-none transition-all"
                      />
                    </div>
                    {formErrors.patientEmail && <p className="font-sans text-[10px] text-red-600">{formErrors.patientEmail}</p>}
                  </div>
                </div>
              </div>

              {/* Part 2: Department and Practitioner */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                  2. Department & Practitioner
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Clinical Department
                    </label>
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 outline-none transition-all"
                    >
                      <option value="">Select Clinical Department</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    {formErrors.dept && <p className="font-sans text-[10px] text-red-600">{formErrors.dept}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Medical Practitioner
                    </label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => setSelectedDoctorId(e.target.value)}
                      disabled={!selectedDeptId}
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 outline-none transition-all disabled:opacity-50"
                    >
                      <option value="">
                        {!selectedDeptId ? 'Select Department first' : 'Select Practitioner'}
                      </option>
                      {filteredDoctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                    {formErrors.doctor && <p className="font-sans text-[10px] text-red-600">{formErrors.doctor}</p>}
                  </div>
                </div>
              </div>

              {/* Part 3: Schedule Specifics */}
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                  3. Clinical Schedule
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 outline-none transition-all"
                    />
                    {formErrors.date && <p className="font-sans text-[10px] text-red-600">{formErrors.date}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Clinical Hours / Slot
                    </label>
                    <select
                      value={selectedTimeSlot}
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 outline-none transition-all"
                    >
                      <option value="">Select Hours</option>
                      {availableSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                    {formErrors.time && <p className="font-sans text-[10px] text-red-600">{formErrors.time}</p>}
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Primary Symptoms / Reason
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={2}
                      placeholder="e.g., Annual physical exam, routine follow-up"
                      className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSchedulerOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-sans text-xs font-bold transition-all shadow-md shadow-blue-100 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Scheduling...' : 'Authorize Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
