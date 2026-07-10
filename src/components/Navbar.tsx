/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Activity, Menu, X, Calendar, User, LogOut, LogIn } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBookNow: () => void;
  bookingsCount: number;
  user: FirebaseUser | null;
  onSignOut: () => void;
  onSignInClick: () => void;
}

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onBookNow, 
  bookingsCount, 
  user, 
  onSignOut, 
  onSignInClick 
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseNavItems: { id: string; label: string; count?: number }[] = [
    { id: 'home', label: 'Home' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Our Doctors' },
  ];

  const getNavItems = () => {
    const items = [...baseNavItems];
    if (user) {
      if (user.email === 'vivektest@gmail.com') {
        items.push({ id: 'admin', label: 'Admin Portal', count: undefined });
      } else {
        items.push({ id: 'bookings', label: 'My Appointments', count: bookingsCount });
      }
    } else {
      items.push({ id: 'bookings', label: 'My Appointments', count: undefined });
      items.push({ id: 'admin', label: 'Admin Portal', count: undefined });
    }
    return items;
  };

  const navItems = getNavItems();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 cursor-pointer group"
              id="brand-logo-btn"
            >
              <div className="p-2.5 bg-blue-600 rounded-xl text-white group-hover:bg-blue-700 transition-colors shadow-md shadow-blue-100">
                <Activity className="h-6 w-6" />
              </div>
              <div className="text-left">
                <span className="block font-sans font-bold text-xl tracking-tight text-slate-800">
                  NovaCare
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-blue-600 font-semibold">
                  Medical Center
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Book Appointment CTA & Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onBookNow}
              id="cta-book-appointment-btn"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-100 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 pl-3 pr-2 py-1.5 rounded-xl">
                <div className="text-left shrink-0 max-w-[120px]">
                  <p className="font-sans font-bold text-xs text-slate-800 truncate">
                    {user.displayName || 'Clinical User'}
                  </p>
                  <p className="font-mono text-[9px] text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-1.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg text-slate-500 transition-colors cursor-pointer"
                  title="Sign Out"
                  id="navbar-signout-btn"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignInClick}
                className="flex items-center space-x-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-sans text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                id="navbar-signin-btn"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white" id="mobile-menu-drawer">
          <div className="px-2 pt-3 pb-6 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between px-4 py-3 rounded-xl font-sans text-base font-medium ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-4 px-4 space-y-3">
              <button
                onClick={() => {
                  onBookNow();
                  setIsMobileMenuOpen(false);
                }}
                id="mobile-cta-book-btn"
                className="flex w-full items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-sans text-base font-semibold py-3 rounded-xl shadow-md transition-colors"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Appointment</span>
              </button>

              {user ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-left">
                  <div>
                    <p className="font-sans font-bold text-sm text-slate-800">
                      {user.displayName || 'Clinical User'}
                    </p>
                    <p className="font-mono text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center space-x-2 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 py-2.5 rounded-lg text-slate-700 font-sans text-sm font-semibold transition-colors cursor-pointer"
                    id="mobile-navbar-signout-btn"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onSignInClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center space-x-2 border border-slate-200 hover:bg-slate-50 py-3 rounded-xl text-slate-700 font-sans text-base font-semibold transition-colors cursor-pointer"
                  id="mobile-navbar-signin-btn"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
