/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onBookNow: () => void;
}

export default function Footer({ setActiveTab, onBookNow }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 font-sans" id="main-footer">
      {/* Top Banner: Emergency Contact */}
      <div className="bg-blue-950/40 border-b border-blue-900 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <Phone className="h-5 w-5 animate-pulse" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-blue-400 font-bold font-mono">24/7 Emergency Line</p>
              <p className="text-lg font-bold text-white">+1 (800) 999-9111</p>
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-slate-200">Are you experiencing a medical emergency?</p>
            <p className="text-xs text-slate-400">Please contact our emergency response department immediately or visit the nearest ER.</p>
          </div>
          <div>
            <button
              onClick={onBookNow}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow-lg shadow-blue-950/50 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Get Directions / Urgent Care
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <span className="block font-bold text-lg text-white leading-none">NovaCare</span>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-blue-500 font-semibold mt-0.5">Medical Center</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Dedicated to delivering world-class, compassionate healthcare using the latest medical innovations. At NovaCare, your health and wellness are our life's calling.
            </p>
            <div className="flex space-x-4">
              {/* Custom social placeholders */}
              <span className="h-8 w-8 rounded-lg bg-neutral-800 flex items-center justify-center text-sm hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">FB</span>
              <span className="h-8 w-8 rounded-lg bg-neutral-800 flex items-center justify-center text-sm hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">TW</span>
              <span className="h-8 w-8 rounded-lg bg-neutral-800 flex items-center justify-center text-sm hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">LN</span>
              <span className="h-8 w-8 rounded-lg bg-neutral-800 flex items-center justify-center text-sm hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">IG</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors cursor-pointer">Home Dashboard</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('departments')} className="hover:text-white transition-colors cursor-pointer">Medical Departments</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('doctors')} className="hover:text-white transition-colors cursor-pointer">Meet Our Doctors</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bookings')} className="hover:text-white transition-colors cursor-pointer">My Appointments</button>
              </li>
              <li>
                <button onClick={onBookNow} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer">Book an Appointment</button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Departments</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => setActiveTab('departments')} className="hover:text-white transition-colors cursor-pointer">Cardiovascular Care</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('departments')} className="hover:text-white transition-colors cursor-pointer">Orthopedics & Joints</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('departments')} className="hover:text-white transition-colors cursor-pointer">Pediatrics & Wellness</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('departments')} className="hover:text-white transition-colors cursor-pointer">Neurology & Brain Science</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('departments')} className="hover:text-white transition-colors cursor-pointer">Clinical Dermatology</button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-6">Our Location</h3>
            <div className="flex items-start space-x-3 text-sm">
              <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <span>750 Medical Plaza Drive, Suite 200, San Francisco, CA 94115</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-5 w-5 text-blue-500 shrink-0" />
              <a href="mailto:contact@novacarehospital.com" className="hover:text-white transition-colors">contact@novacare.org</a>
            </div>
            <div className="flex items-start space-x-3 text-sm">
              <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white text-xs">Clinical Hours</p>
                <p className="text-xs text-slate-400">Mon - Fri: 8:00 AM - 6:00 PM</p>
                <p className="text-xs text-slate-400">Sat - Sun: 9:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800 text-xs text-neutral-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {currentYear} NovaCare Medical Center. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 cursor-pointer">Patient Rights & Responsibilities</span>
          </div>
          <p className="flex items-center">
            Built with <Heart className="h-3 w-3 text-red-500 mx-1 fill-red-500" /> for healthcare excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
