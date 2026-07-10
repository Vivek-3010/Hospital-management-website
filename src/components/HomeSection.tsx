/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Calendar, 
  Users, 
  Activity, 
  Award, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  Heart,
  FileText,
  PhoneCall
} from 'lucide-react';
import { DEPARTMENTS } from '../data/hospitalData';

const hospitalHero = '/src/assets/images/hospital_hero_1783676490224.jpg';

interface HomeSectionProps {
  setActiveTab: (tab: string) => void;
  onBookNow: () => void;
}

export default function HomeSection({ setActiveTab, onBookNow }: HomeSectionProps) {
  const stats = [
    { value: '150+', label: 'Elite Doctors & Physicians', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { value: '18+', label: 'Medical Specialties', icon: Activity, color: 'bg-indigo-50 text-indigo-600' },
    { value: '99.4%', label: 'Patient Satisfaction', icon: ShieldCheck, color: 'bg-blue-50 text-blue-600' },
    { value: '24/7', label: 'Emergency Response', icon: Clock, color: 'bg-red-50 text-red-600' },
  ];

  const coreStrengths = [
    {
      title: 'Expert Medical Team',
      desc: 'Our staff consists of board-certified leaders in their respective fields, holding prestigious educational degrees from top Ivy League clinics.',
      icon: Award,
    },
    {
      title: 'Advanced Technologies',
      desc: 'We invest in state-of-the-art robotic surgical assistants, high-resolution diagnostic scanners, and electronic healthcare record integrations.',
      icon: Activity,
    },
    {
      title: 'Patient-First Philosophy',
      desc: 'Compassionate care structured around your unique health requirements. We offer personalized attention, private recovery wings, and continuous monitoring.',
      icon: Heart,
    },
  ];

  const testimonials = [
    {
      quote: "The care I received at NovaCare was exemplary. The cardiology team explained my procedure with great clarity and handled my surgery with absolute professionalism. I am back to my daily runs!",
      author: "Robert Kowalski",
      role: "Heart Surgery Patient",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      quote: "Dr. Sterling and the pediatric group are absolute angels. My daughter is usually terrified of clinical visits, but their warm, colorful play areas and friendly demeanor made it an absolute breeze.",
      author: "Emily Martinez",
      role: "Mother of 4-year-old Sophia",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      quote: "After months of knee discomfort, I consulted Dr. Thorne. His recommended physical therapy regimen, paired with joint injections, worked miracles. I avoided surgery and feel ten years younger.",
      author: "James Chen",
      role: "Orthopedic Patient",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80"
    }
  ];

  const faqs = [
    {
      q: "How can I book an appointment with a specific specialist?",
      a: "You can book directly using our online scheduler! Go to the 'Book Appointment' tab, select your preferred department and doctor, pick an available slot, and confirm. Alternatively, you can search our doctor directory and click 'Book' on their profile."
    },
    {
      q: "Do you accept international health insurances?",
      a: "Yes! NovaCare Medical Center partners with a wide array of domestic and international insurance providers. Please check our billing page or contact our customer desk to verify your specific policy coverage prior to your visit."
    },
    {
      q: "What measures do you have in place for urgent walk-ins?",
      a: "Our Emergency Wing is open 24 hours a day, 7 days a week, fully staffed by trauma specialists. No appointment is needed for immediate, life-critical issues. For urgent non-life-threatening ailments, we offer priority walk-in care."
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden" id="home-view">
      {/* Hero Section */}
      <section className="relative bg-neutral-50 pt-8 pb-16 md:py-20 lg:py-24" id="hero-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
                <ShieldCheck className="h-4 w-4" />
                <span>Premier Healthcare Excellence</span>
              </div>
              <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-none">
                Your Health is Our <span className="text-blue-600 block sm:inline">Life's Mission.</span>
              </h1>
              <p className="font-sans text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                NovaCare Medical Center brings together world-class medical experts, groundbreaking diagnostic facilities, and a deeply compassionate care model to protect your family's health and wellness.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onBookNow}
                  id="hero-book-btn"
                  className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  id="hero-meet-doctors-btn"
                  className="flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold px-8 py-4 rounded-xl shadow-sm transition-all hover:border-slate-300 cursor-pointer"
                >
                  <span>Meet Our Specialists</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-bold text-sm">✓</span>
                  <span className="text-slate-500 text-sm font-medium">JCI Accredited Facility</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-bold text-sm">✓</span>
                  <span className="text-slate-500 text-sm font-medium">Top-Rated Physicians</span>
                </div>
              </div>
            </motion.div>

            {/* Right Media Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-video bg-slate-200">
                <img 
                  src={hospitalHero} 
                  alt="NovaCare Medical Center state-of-the-art building" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to beautiful Unsplash image in case of load failure
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                {/* Floating Patient-Care Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100 flex items-center space-x-3 max-w-[240px]">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Fast Care Response</p>
                    <p className="text-sm font-bold text-slate-800">Walk-Ins Priority Response</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Background Glows */}
              <div className="absolute -z-10 -top-6 -right-6 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />
              <div className="absolute -z-10 -bottom-6 -left-6 h-48 w-48 rounded-full bg-blue-100/50 blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Quick Action Blocks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="quick-actions-cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-20 relative z-20">
          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-sans font-bold text-xl text-slate-900">Book an Appointment</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Skip the waiting line. Select your preferred physician and secure a convenient booking slot in less than two minutes.
              </p>
            </div>
            <button 
              onClick={onBookNow}
              className="mt-6 inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 group cursor-pointer"
            >
              <span>Schedule now</span>
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-sans font-bold text-xl text-slate-900">Meet Our Specialists</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Browse our team of board-certified clinicians, read detailed medical backgrounds, patient testimonials, and book direct care.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('doctors')}
              className="mt-6 inline-flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 group cursor-pointer"
            >
              <span>Meet the doctors</span>
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="font-sans font-bold text-xl text-slate-900">Find Specialties</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                From pediatrics to cardiology, our highly specialized clinics offer personalized medical therapies tailored to your conditions.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('departments')}
              className="mt-6 inline-flex items-center text-indigo-600 font-semibold text-sm hover:text-indigo-700 group cursor-pointer"
            >
              <span>Explore departments</span>
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Hospital Stats Grid */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden" id="hospital-stats">
        {/* Background ambient accents */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {stats.map((stat, idx) => (
            <div key={idx} className={`pt-6 lg:pt-0 ${idx > 0 ? 'lg:pl-8' : ''}`}>
              <div className="flex justify-center mb-4">
                <span className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </span>
              </div>
              <p className="font-sans font-black text-4xl sm:text-5xl text-white tracking-tight mb-2">
                {stat.value}
              </p>
              <p className="font-sans text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Clinical Highlights & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16" id="core-values-section">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">Our Principles</h2>
          <h3 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Setting the Standard in Healthcare Excellence
          </h3>
          <p className="font-sans text-slate-600 text-base">
            We are dedicated to providing comprehensive, continuous care. Here is how we create a healthier, happier community day by day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {coreStrengths.map((strength, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-100">
                <strength.icon className="h-6 w-6" />
              </div>
              <h4 className="font-sans font-bold text-xl text-slate-900 mb-3">{strength.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{strength.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mini Department Preview Section */}
      <section className="bg-slate-50 py-20" id="departments-preview-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">Our Specialties</h2>
              <h3 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Our Leading Specialized Care Departments
              </h3>
            </div>
            <div>
              <button
                onClick={() => setActiveTab('departments')}
                className="flex items-center space-x-2 bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 hover:border-blue-300 font-semibold px-5 py-3 rounded-xl shadow-sm transition-all cursor-pointer text-sm"
              >
                <span>View All Departments</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEPARTMENTS.slice(0, 3).map((dept) => (
              <div 
                key={dept.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col h-full hover:shadow-xl transition-shadow"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={dept.image} 
                    alt={dept.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${dept.id}/800/600`;
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white p-2.5 rounded-xl shadow">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div>
                    <h4 className="font-sans font-bold text-lg text-slate-900 mb-2">{dept.name}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">{dept.description}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('departments')}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-xs flex items-center group cursor-pointer"
                  >
                    <span>Read Specialization details</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16" id="patient-testimonials">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">Patient Stories</h2>
          <h3 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Hear From Our Healed Patients
          </h3>
          <p className="font-sans text-slate-500 text-sm">
            Nothing validates our commitment like the real experiences of those who entrusted us with their health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-150 flex flex-col justify-between space-y-6 relative"
            >
              {/* Star Rating */}
              <div className="flex space-x-1">
                {Array.from({ length: test.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "{test.quote}"
              </p>

              <div className="flex items-center space-x-3.5 pt-4 border-t border-slate-100">
                <img 
                  src={test.image} 
                  alt={test.author} 
                  className="h-10 w-10 rounded-full object-cover shadow-inner bg-slate-200"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${test.author}/150/150`;
                  }}
                />
                <div>
                  <h4 className="font-sans font-bold text-sm text-slate-900 leading-none">{test.author}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Informative FAQ accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="faq-accordions">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">Common Questions</h2>
          <h3 className="font-sans font-extrabold text-3xl text-slate-900 tracking-tight">
            Frequently Asked Clinical Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-left">
              <h4 className="font-sans font-bold text-slate-900 text-base mb-2 flex items-start">
                <span className="text-blue-600 font-mono font-bold mr-2 text-sm mt-0.5">Q.</span>
                {faq.q}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="appointment-footer-cta">
        <div className="bg-blue-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-xl shadow-blue-50/50">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 -mr-16 -mt-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 -ml-16 -mb-16 blur-2xl" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h3 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
              Ready to Secure Your Personalized Healthcare Plan?
            </h3>
            <p className="font-sans text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Do not put your wellness on hold. Book a direct appointment with our leading specialists today and experience premium medical care.
            </p>
            <div className="flex justify-center pt-2">
              <button
                onClick={onBookNow}
                className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-blue-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Calendar className="h-5 w-5" />
                <span>Schedule Appointment Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
