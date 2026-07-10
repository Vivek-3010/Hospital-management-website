/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  specialty: string;
  rating: number;
  experience: number; // in years
  patientsCount: number;
  bio: string;
  image: string;
  availability: {
    days: string[]; // e.g. ["Monday", "Tuesday", "Wednesday"]
    hours: string; // e.g. "09:00 AM - 04:00 PM"
    slots: string[]; // e.g. ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"]
  };
  education: string[];
  contactEmail: string;
}

export interface Department {
  id: string;
  name: string;
  iconName: string; // Lucide icon identifier
  description: string;
  longDescription: string;
  services: string[];
  image: string;
}

export interface Appointment {
  id: string;
  userId?: string;
  doctorId: string;
  doctorName: string;
  departmentId: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}
