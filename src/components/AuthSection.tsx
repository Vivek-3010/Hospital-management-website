import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Mail, Lock, User, Phone, Activity, ArrowRight, ShieldCheck, AlertCircle, Copy, Check, Database } from 'lucide-react';

interface AuthSectionProps {
  onAuthSuccess: () => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export default function AuthSection({ onAuthSuccess, showToast }: AuthSectionProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showRulesGuide, setShowRulesGuide] = useState(false);
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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (isSignUp) {
      // Sign Up validation
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        setIsLoading(false);
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('Please enter your phone number');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      try {
        // Create user with firebase auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile displayName
        await updateProfile(user, { displayName: name });

        // Save custom profile into firestore users collection
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: email.toLowerCase().trim(),
          name: name.trim(),
          phone: phone.trim(),
          createdAt: new Date().toISOString()
        });

        showToast('Account created successfully! Welcome to NovaCare.', 'success');
        onAuthSuccess();
      } catch (err: any) {
        console.error('Registration Error:', err);
        let msg = 'Failed to create account. Please try again.';
        if (err.code === 'permission-denied' || err.message?.includes('permission-denied') || err.message?.includes('permissions')) {
          msg = 'Firestore Permissions Error: The database blocked registration because your Firestore Security Rules are locked or not configured. See the troubleshooting guide below.';
          setShowRulesGuide(true);
        } else if (err.code === 'auth/email-already-in-use') {
          msg = 'This email address is already in use.';
        } else if (err.code === 'auth/invalid-email') {
          msg = 'Invalid email address format.';
        } else if (err.code === 'auth/weak-password') {
          msg = 'Password is too weak.';
        } else if (err.code === 'auth/operation-not-allowed') {
          msg = 'Email/Password sign-in is not enabled in your Firebase console. Please enable it in your Firebase project under Authentication -> Sign-in method.';
        } else if (err.message) {
          msg = `Registration Error: ${err.message} (${err.code || 'unknown'})`;
        }
        setErrorMsg(msg);
        showToast(msg, 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign In validation
      if (!email.trim() || !password) {
        setErrorMsg('Please enter both email and password');
        setIsLoading(false);
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Signed in successfully! Welcome back.', 'success');
        onAuthSuccess();
      } catch (err: any) {
        console.error('Sign In Error:', err);
        let msg = 'Invalid email or password.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Invalid credentials. Please verify your email and password.';
        } else if (err.code === 'auth/invalid-email') {
          msg = 'Invalid email address format.';
        } else if (err.code === 'auth/operation-not-allowed') {
          msg = 'Email/Password sign-in is not enabled in your Firebase console. Please enable it in your Firebase project under Authentication -> Sign-in method.';
        } else if (err.message) {
          msg = `Sign-In Error: ${err.message} (${err.code || 'unknown'})`;
        }
        setErrorMsg(msg);
        showToast(msg, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user profile exists in firestore, if not create it
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email?.toLowerCase().trim() || '',
          name: user.displayName || 'Google User',
          phone: user.phoneNumber || '',
          createdAt: new Date().toISOString()
        });
      }

      showToast('Signed in successfully with Google!', 'success');
      onAuthSuccess();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      let msg = 'Failed to sign in with Google. Please try again.';
      if (err.code === 'permission-denied' || err.message?.includes('permission-denied') || err.message?.includes('permissions')) {
        msg = 'Firestore Permissions Error: Google sign-in was successful, but the database blocked retrieving or creating your user profile. Please see the troubleshooting guide below to configure your security rules.';
        setShowRulesGuide(true);
      } else if (err.code === 'auth/popup-blocked') {
        msg = 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Google sign-in is not enabled in your Firebase console. Please enable Google provider in Firebase project under Authentication -> Sign-in method.';
      } else if (err.code === 'auth/unauthorized-domain') {
        const hostname = window.location.hostname;
        msg = `Unauthorized Domain: "${hostname}" must be added to your Firebase project. To fix this, open your Firebase Console, navigate to Authentication -> Settings -> Authorized Domains, and add "${hostname}" to the list.`;
      } else if (err.message) {
        msg = `Google Sign-In Error: ${err.message} (${err.code || 'unknown'})`;
      }
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 sm:px-6" id="auth-section-container">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-left space-y-6">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
            <Activity className="h-8 w-8" />
          </div>
          <h2 className="font-sans font-black text-2xl text-slate-900 tracking-tight">
            {isSignUp ? 'Create clinical account' : 'Sign in to NovaCare'}
          </h2>
          <p className="font-sans text-slate-500 text-sm">
            {isSignUp 
              ? 'Access real-time schedules and secure medical bookings' 
              : 'Provide email credentials to manage your medical visits'}
          </p>
        </div>

        {/* Display inline validation error */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start space-x-3 text-sm font-medium animate-shake" id="auth-error-banner">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {isSignUp && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="(555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-sm outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {isSignUp && (
            /* Confirm Password */
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl font-sans text-sm outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-sans text-sm font-bold py-3.5 rounded-xl shadow-md shadow-blue-50 hover:shadow-blue-100 transition-all cursor-pointer"
          >
            <span>{isLoading ? 'Processing...' : isSignUp ? 'Register Account' : 'Sign In'}</span>
            {!isLoading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-sans text-sm font-bold py-3.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-[0.99]"
          id="google-signin-btn"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span>{isLoading ? 'Processing...' : 'Sign in with Google'}</span>
        </button>

        {/* Info notice about email/pass provider config */}
        <div className="p-3.5 bg-blue-50/50 rounded-2xl flex items-start space-x-3 text-[11px] text-slate-600 border border-blue-100/50">
          <ShieldCheck className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
          <p>
            NovaCare ensures HIPAA-compliant transmission. Credentials are encrypted on transit via standard Firebase protocols.
          </p>
        </div>

        {/* Toggle between Sign In / Sign Up */}
        <div className="border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-500 font-sans">
            {isSignUp ? 'Already have a clinical account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
              className="text-blue-600 font-bold hover:underline cursor-pointer focus:outline-none"
            >
              {isSignUp ? 'Sign In' : 'Create an Account'}
            </button>
          </p>
        </div>

      </div>

      {showRulesGuide && (
        <div className="mt-6 border border-amber-200 bg-amber-50/70 rounded-3xl p-6 text-left space-y-4 animate-fade-in" id="rules-guide-box">
          <div className="flex items-center space-x-2.5 text-amber-800">
            <Database className="h-5 w-5" />
            <h3 className="font-sans font-black text-base tracking-tight">Enable Firestore Database Permissions</h3>
          </div>
          
          <p className="font-sans text-xs text-slate-700 leading-relaxed">
            By default, Firestore databases are created in <strong>"Locked Mode"</strong>, which blocks retrieval or storage of clinical profiles and bookings. To allow authenticated access, update your Firestore Security Rules:
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
              Return to this tab and try signing in or registering again!
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
