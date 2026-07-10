/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, X, Bell, Info } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import DepartmentsSection from './components/DepartmentsSection';
import DoctorsSection from './components/DoctorsSection';
import BookingSection from './components/BookingSection';
import MyBookingsSection from './components/MyBookingsSection';
import AuthSection from './components/AuthSection';
import AdminSection from './components/AdminSection';
import { Appointment, Doctor } from './types';
import { DOCTORS } from './data/hospitalData';

// Firebase integrations
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hasFirestorePermissionError, setHasFirestorePermissionError] = useState<boolean>(false);
  
  // Auth and profile states
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  // States for cross-page redirection and detail modals
  const [selectedDoctorIdForBooking, setSelectedDoctorIdForBooking] = useState<string | null>(null);
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState<Doctor | null>(null);

  // Custom Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoadingUser(false);

      if (firebaseUser) {
        // Fetch user profile from Firestore users collection
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data());
          } else {
            setUserProfile({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              createdAt: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Sync user appointments from Firestore in real-time
  useEffect(() => {
    if (!user) {
      setAppointments([]);
      setHasFirestorePermissionError(false);
      return;
    }

    const path = 'bookings';
    const isAdminUser = user.email === 'vivektest@gmail.com';
    const q = isAdminUser
      ? query(collection(db, path))
      : query(collection(db, path), where('userId', '==', user.uid));
    
    const unsubscribeBookings = onSnapshot(q, (snapshot) => {
      const fetched: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        fetched.push(docSnap.data() as Appointment);
      });
      // Sort appointments by creation date descending
      fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAppointments(fetched);
      setHasFirestorePermissionError(false);
    }, (error) => {
      console.error("onSnapshot bookings error:", error);
      if (error.code === 'permission-denied' || error.message?.includes('permission-denied')) {
        setHasFirestorePermissionError(true);
      } else {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    });

    return () => {
      unsubscribeBookings();
    };
  }, [user]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // BOOK APPOINTMENT ACTION (Firestore integration)
  const handleBookingSuccess = async (newApt: Appointment) => {
    const path = 'bookings';
    try {
      await setDoc(doc(db, path, newApt.id), newApt);
      showToast(`Appointment scheduled successfully with ${newApt.doctorName}!`, 'success');
    } catch (error) {
      showToast('Failed to save booking. Please try again.', 'error');
      handleFirestoreError(error, OperationType.CREATE, `${path}/${newApt.id}`);
    }
  };

  // CANCEL APPOINTMENT ACTION (Firestore integration)
  const handleCancelAppointment = async (aptId: string) => {
    const path = 'bookings';
    try {
      await updateDoc(doc(db, path, aptId), { status: 'cancelled' });
      showToast('Your appointment has been successfully cancelled.', 'info');
    } catch (error) {
      showToast('Failed to cancel appointment. Please try again.', 'error');
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${aptId}`);
    }
  };

  // RESCHEDULE APPOINTMENT ACTION (Firestore integration)
  const handleRescheduleAppointment = async (aptId: string, newDate: string, newTime: string) => {
    const path = 'bookings';
    try {
      await updateDoc(doc(db, path, aptId), { 
        date: newDate, 
        timeSlot: newTime, 
        status: 'scheduled' 
      });
      showToast('Your appointment schedule has been successfully updated.', 'success');
    } catch (error) {
      showToast('Failed to update schedule. Please try again.', 'error');
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${aptId}`);
    }
  };

  // SIGN OUT ACTION
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setActiveTab('home');
      showToast('Successfully signed out.', 'info');
    } catch (err) {
      console.error('Logout error:', err);
      showToast('Failed to sign out. Please try again.', 'error');
    }
  };

  // REDIRECT AND PRE-SELECT DOCTOR IN BOOKING FORM
  const handleBookDoctorRedirect = (doctor: Doctor) => {
    setSelectedDoctorIdForBooking(doctor.id);
    setActiveTab('book-appointment');
    showToast(`Initiating booking for ${doctor.name}.`, 'info');
  };

  const handleOpenDoctorDetail = (doctor: Doctor) => {
    setSelectedDoctorDetail(doctor);
    setActiveTab('doctors');
  };

  // Render Page Content conditionally
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeSection 
            setActiveTab={setActiveTab} 
            onBookNow={() => {
              setSelectedDoctorIdForBooking(null);
              setActiveTab('book-appointment');
            }} 
          />
        );
      case 'departments':
        return (
          <DepartmentsSection 
            onBookDoctor={handleBookDoctorRedirect} 
            onViewDoctorDetails={handleOpenDoctorDetail}
          />
        );
      case 'doctors':
        return (
          <DoctorsSection 
            onBookDoctor={handleBookDoctorRedirect} 
            selectedDoctorDetail={selectedDoctorDetail}
            setSelectedDoctorDetail={setSelectedDoctorDetail}
          />
        );
      case 'book-appointment':
        if (!user) {
          return (
            <AuthSection 
              onAuthSuccess={() => {
                setActiveTab('book-appointment');
              }}
              showToast={showToast}
            />
          );
        }
        return (
          <BookingSection 
            initialDoctorId={selectedDoctorIdForBooking}
            onBookingSuccess={handleBookingSuccess}
            onNavigateToBookings={() => setActiveTab('bookings')}
            user={user}
            userProfile={userProfile}
          />
        );
      case 'bookings':
        if (!user) {
          return (
            <AuthSection 
              onAuthSuccess={() => {
                setActiveTab('bookings');
              }}
              showToast={showToast}
            />
          );
        }
        return (
          <MyBookingsSection 
            appointments={appointments}
            hasFirestorePermissionError={hasFirestorePermissionError}
            onCancelAppointment={handleCancelAppointment}
            onRescheduleAppointment={handleRescheduleAppointment}
            onNavigateToBookingForm={() => {
              setSelectedDoctorIdForBooking(null);
              setActiveTab('book-appointment');
            }}
          />
        );
      case 'admin':
        return (
          <AdminSection 
            appointments={appointments}
            showToast={showToast}
            user={user}
            onSignOut={handleSignOut}
            setActiveTab={setActiveTab}
          />
        );
      case 'auth':
        return (
          <AuthSection 
            onAuthSuccess={() => {
              setActiveTab('home');
            }}
            showToast={showToast}
          />
        );
      default:
        return (
          <HomeSection 
            setActiveTab={setActiveTab} 
            onBookNow={() => {
              setSelectedDoctorIdForBooking(null);
              setActiveTab('book-appointment');
            }} 
          />
        );
    }
  };

  const activeBookingsCount = appointments.filter(a => a.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="root-container">
      {/* Dynamic Alerts Banner */}
      <div className="bg-blue-600 text-blue-50 px-4 py-2.5 text-center text-xs font-semibold tracking-wide flex items-center justify-center space-x-2" id="header-alert-ribbon">
        <Bell className="h-4 w-4 shrink-0" />
        <span>NOTICE: NovaCare Medical Center is now accepting general walk-in visits. Standard clinical protocols remain active.</span>
      </div>

      {/* Main Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // If we navigate manually, reset the doctor pre-selection
          if (tab !== 'book-appointment') {
            setSelectedDoctorIdForBooking(null);
          }
        }} 
        onBookNow={() => {
          setSelectedDoctorIdForBooking(null);
          setActiveTab('book-appointment');
        }}
        bookingsCount={activeBookingsCount}
        user={user}
        onSignOut={handleSignOut}
        onSignInClick={() => setActiveTab('auth')}
      />

      {/* Micro-Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
            id="toast-notification"
          >
            <div className={`p-4 rounded-xl shadow-xl flex items-center justify-between border ${
              toast.type === 'success' ? 'bg-blue-600 border-blue-500 text-white' :
              toast.type === 'error' ? 'bg-red-600 border-red-500 text-white' :
              'bg-slate-900 border-slate-800 text-slate-100'
            }`}>
              <div className="flex items-center space-x-3 text-sm font-semibold">
                {toast.type === 'success' ? <CheckCircle className="h-5 w-5 text-blue-100 shrink-0" /> :
                 toast.type === 'error' ? <AlertCircle className="h-5 w-5 text-red-100 shrink-0" /> :
                 <Info className="h-5 w-5 text-blue-400 shrink-0" />}
                <span>{toast.message}</span>
              </div>
              <button 
                onClick={() => setToast(null)} 
                className="p-1 text-white/70 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Page Canvas */}
      <main className="flex-grow">
        {isLoadingUser ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">
              Securing clinical workspace...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Persistent Clinical Footer */}
      <Footer 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'book-appointment') {
            setSelectedDoctorIdForBooking(null);
          }
        }} 
        onBookNow={() => {
          setSelectedDoctorIdForBooking(null);
          setActiveTab('book-appointment');
        }}
      />
    </div>
  );
}
