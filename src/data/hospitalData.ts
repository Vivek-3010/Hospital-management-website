/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department, Doctor } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    iconName: 'Heart',
    description: 'Expert care for your heart and cardiovascular system.',
    longDescription: 'Our Cardiology Department provides comprehensive care for patients with heart diseases and cardiovascular disorders. From preventive screenings to advanced interventional procedures, our team of world-class cardiologists utilizes cutting-edge medical technology to protect and heal your heart.',
    services: [
      'Electrocardiogram (ECG / EKG)',
      'Echocardiogram (Cardiac Ultrasound)',
      'Stress Testing & Coronary Angiography',
      'Hypertension & Cholesterol Management',
      'Heart Failure Care & Rehabilitation'
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    iconName: 'Bone',
    description: 'Restoring mobility, strength, and active lifestyles.',
    longDescription: 'NovaCare Orthopedics specializes in diagnosing and treating ailments of the musculoskeletal system, including bones, joints, ligaments, tendons, and muscles. Whether you are dealing with an athletic injury, arthritis, or chronic pain, we offer specialized surgical and non-surgical therapies.',
    services: [
      'Joint Replacement Surgery (Hip, Knee, Shoulder)',
      'Sports Injury Treatment & Arthroscopy',
      'Fracture Care & Trauma Surgery',
      'Spine Care & Back Pain management',
      'Physical Therapy & Rehabilitation Services'
    ],
    image: 'https://images.unsplash.com/photo-1597423498214-02914e68bc1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    iconName: 'Baby',
    description: 'Nurturing care for infants, children, and adolescents.',
    longDescription: 'Our Pediatrics Department provides dedicated and compassionate healthcare for young patients, from birth through adolescence. We understand that children have unique medical needs, and our warm, child-friendly environment makes medical visits a comfortable, positive experience for both child and parents.',
    services: [
      'Well-Child Checks & Developmental Milestones',
      'Childhood Immunizations & Vaccinations',
      'Acute Illness Care (Fever, Cough, Infections)',
      'Pediatric Asthma & Allergy Care',
      'Adolescent Health Counseling'
    ],
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    iconName: 'Brain',
    description: 'Advanced diagnosis and therapies for neurological wellness.',
    longDescription: 'The Neurology Department at NovaCare is dedicated to the study, diagnosis, and treatment of disorders affecting the brain, spinal cord, and nervous system. Our highly trained specialists treat complex conditions with tailored therapy plans to enhance cognitive and physical well-being.',
    services: [
      'Stroke Treatment & Prevention',
      'Epilepsy & Seizure Management',
      'Migraine & Chronic Headache Therapy',
      'Alzheimer’s & Dementia Care',
      'Movement Disorders (Parkinson’s Disease)'
    ],
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    iconName: 'Sparkles',
    description: 'Comprehensive medical and cosmetic skin solutions.',
    longDescription: 'NovaCare Dermatology offers expert evaluation and management of conditions affecting the skin, hair, and nails. Our services range from treating clinical skin diseases (such as acne, eczema, and psoriasis) to advanced skin cancer screenings and custom aesthetic rejuvenations.',
    services: [
      'Full-Body Skin Cancer Screenings',
      'Eczema, Psoriasis & Acne Treatments',
      'Mole and Cyst Removal Surgery',
      'Laser Skin Rejuvenation Therapy',
      'Allergy Testing & Contact Dermatitis care'
    ],
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    iconName: 'Stethoscope',
    description: 'Your gateway to long-term health and preventive care.',
    longDescription: 'Our General Medicine and Primary Care Department is the cornerstone of NovaCare Medical Center. We emphasize holistic health, regular physical exams, and preventive care. Our general practitioners act as your primary health partners, managing chronic illnesses and coordinating specialty services.',
    services: [
      'Annual Physical Examinations',
      'Chronic Disease Management (Diabetes, COPD)',
      'Preventive Health Screenings & Counseling',
      'Acute Care for Common Infections & Injuries',
      'Travel Medicine & Health Advisory'
    ],
    image: 'https://images.unsplash.com/photo-1584515901367-f134706ef87a?auto=format&fit=crop&w=800&q=80'
  }
];

export const DOCTORS: Doctor[] = [
  // Cardiology
  {
    id: 'doc-adrian-vance',
    name: 'Dr. Adrian Vance',
    title: 'Chief of Interventional Cardiology',
    departmentId: 'cardiology',
    specialty: 'Interventional Cardiology',
    rating: 4.9,
    experience: 16,
    patientsCount: 1420,
    bio: 'Dr. Adrian Vance is a board-certified interventional cardiologist specializing in minimally invasive catheter-based treatments for structural heart diseases. He completed his residency at Stanford Medicine and has published over 30 academic papers on coronary artery disease.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: '08:30 AM - 03:00 PM',
      slots: ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM']
    },
    education: [
      'MD, Harvard Medical School',
      'Residency in Internal Medicine, Stanford University Hospital',
      'Fellowship in Cardiology, Johns Hopkins Medicine'
    ],
    contactEmail: 'a.vance@novacare.org'
  },
  {
    id: 'doc-sarah-jenkins',
    name: 'Dr. Sarah Jenkins',
    title: 'Senior Consultant Cardiologist',
    departmentId: 'cardiology',
    specialty: 'Non-Invasive Cardiology & Heart Failure',
    rating: 4.8,
    experience: 12,
    patientsCount: 980,
    bio: 'Dr. Sarah Jenkins is passionate about preventive cardiology and cardiac rehabilitation. She emphasizes customized lifestyle planning coupled with pharmacological therapy to treat complex cardiovascular conditions and manage chronic heart failure.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Tuesday', 'Thursday'],
      hours: '09:00 AM - 04:00 PM',
      slots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM']
    },
    education: [
      'MD, Yale School of Medicine',
      'Residency in Internal Medicine, Columbia University Medical Center',
      'Fellowship in Cardiovascular Diseases, Mayo Clinic'
    ],
    contactEmail: 's.jenkins@novacare.org'
  },

  // Orthopedics
  {
    id: 'doc-marcus-thorne',
    name: 'Dr. Marcus Thorne',
    title: 'Director of Orthopedic Surgery',
    departmentId: 'orthopedics',
    specialty: 'Joint Reconstruction & Joint replacement',
    rating: 4.9,
    experience: 18,
    patientsCount: 1850,
    bio: 'Dr. Marcus Thorne is a nationally recognized specialist in primary and revision joint arthroplasty of the hip and knee. He utilizes computer-assisted and robotic surgical systems to ensure precise fit and fast recovery times for his patients.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday'],
      hours: '09:00 AM - 03:30 PM',
      slots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:30 PM', '02:30 PM']
    },
    education: [
      'MD, Perelman School of Medicine at University of Pennsylvania',
      'Residency in Orthopaedic Surgery, Cleveland Clinic',
      'Fellowship in Adult Reconstructive Orthopaedics, Hospital for Special Surgery'
    ],
    contactEmail: 'm.thorne@novacare.org'
  },
  {
    id: 'doc-elena-rostova',
    name: 'Dr. Elena Rostova',
    title: 'Consultant Sports Medicine Specialist',
    departmentId: 'orthopedics',
    specialty: 'Sports Medicine & Arthroscopic Surgery',
    rating: 4.7,
    experience: 10,
    patientsCount: 1100,
    bio: 'Dr. Elena Rostova provides premium sports injury treatment for professional athletes and active individuals. She specializes in arthroscopic knee ligament reconstructions (ACL/MCL) and shoulder rotator cuff repairs, promoting safe, speedy recovery programs.',
    image: 'https://images.unsplash.com/photo-1582750433449-64c024716887?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Wednesday', 'Thursday', 'Friday'],
      hours: '10:00 AM - 05:00 PM',
      slots: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']
    },
    education: [
      'MD, University of Chicago Pritzker School of Medicine',
      'Residency in Orthopaedic Surgery, Northwestern Memorial Hospital',
      'Fellowship in Orthopaedic Sports Medicine, Pitt Medical Center'
    ],
    contactEmail: 'e.rostova@novacare.org'
  },

  // Pediatrics
  {
    id: 'doc-lucas-sterling',
    name: 'Dr. Lucas Sterling',
    title: 'Head of Pediatric Services',
    departmentId: 'pediatrics',
    specialty: 'General Pediatrics & Neonatology',
    rating: 4.9,
    experience: 15,
    patientsCount: 2100,
    bio: 'Dr. Lucas Sterling is known for his incredibly gentle approach with children and informative guidance for parents. He has dedicated over 15 years to treating children with diverse health conditions and manages neonatal intensive care services with superb precision.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
      hours: '08:00 AM - 04:00 PM',
      slots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM']
    },
    education: [
      'MD, UC San Francisco School of Medicine',
      'Residency in Pediatrics, Boston Children’s Hospital',
      'Fellowship in Neonatal-Perinatal Medicine, Children’s Hospital Philadelphia'
    ],
    contactEmail: 'l.sterling@novacare.org'
  },
  {
    id: 'doc-maya-lin',
    name: 'Dr. Maya Lin',
    title: 'Consultant Pediatric Allergist',
    departmentId: 'pediatrics',
    specialty: 'Pediatric Asthma, Allergy, & Immunology',
    rating: 4.8,
    experience: 11,
    patientsCount: 1250,
    bio: 'Dr. Maya Lin helps children manage allergy, asthma, and immunological disorders so they can enjoy full, unrestricted childhoods. She develops personalized asthma plans and food allergy immunotherapy treatments in an encouraging, comforting setting.',
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Tuesday', 'Thursday'],
      hours: '09:00 AM - 04:30 PM',
      slots: ['09:00 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM', '03:30 PM']
    },
    education: [
      'MD, Duke University School of Medicine',
      'Residency in Pediatrics, Washington University St. Louis',
      'Fellowship in Allergy and Immunology, Colorado Children’s Hospital'
    ],
    contactEmail: 'm.lin@novacare.org'
  },

  // Neurology
  {
    id: 'doc-charles-mercer',
    name: 'Dr. Charles Mercer',
    title: 'Senior Neurologist',
    departmentId: 'neurology',
    specialty: 'Clinical Neurology & Stroke Care',
    rating: 4.8,
    experience: 17,
    patientsCount: 1150,
    bio: 'Dr. Charles Mercer is an expert in stroke prevention, epilepsy, and cognitive neurology. He is active in clinical trials for Alzheimer’s disease and aims to bring the latest technological and drug therapies directly to the bedside to optimize nervous system recovery.',
    image: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Monday', 'Wednesday', 'Thursday'],
      hours: '09:30 AM - 04:00 PM',
      slots: ['09:30 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM', '03:30 PM']
    },
    education: [
      'MD, Johns Hopkins University School of Medicine',
      'Residency in Neurology, Mass General Hospital (Harvard)',
      'Fellowship in Vascular Neurology, UCLA Medical Center'
    ],
    contactEmail: 'c.mercer@novacare.org'
  },
  {
    id: 'doc-fiona-gallagher',
    name: 'Dr. Fiona Gallagher',
    title: 'Neuromuscular Specialist',
    departmentId: 'neurology',
    specialty: 'Neuromuscular Disorders & Headache Management',
    rating: 4.9,
    experience: 13,
    patientsCount: 890,
    bio: 'Dr. Fiona Gallagher specializes in headache management, neuropathies, and neuromuscular disorders. She holds advanced certifications in diagnostic electromyography (EMG) and Botox therapy for chronic migraines, treating patients with deep empathy.',
    image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Tuesday', 'Friday'],
      hours: '09:00 AM - 03:00 PM',
      slots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM']
    },
    education: [
      'MD, Vanderbilt University School of Medicine',
      'Residency in Neurology, Yale New Haven Hospital',
      'Fellowship in Neuromuscular Medicine, Michigan Medicine'
    ],
    contactEmail: 'f.gallagher@novacare.org'
  },

  // Dermatology
  {
    id: 'doc-kimberly-zhao',
    name: 'Dr. Kimberly Zhao',
    title: 'Consultant Dermatologist',
    departmentId: 'dermatology',
    specialty: 'Medical & Cosmetic Dermatology',
    rating: 4.8,
    experience: 9,
    patientsCount: 1320,
    bio: 'Dr. Kimberly Zhao offers premium treatment for acne, skin cancers, eczema, and provides personalized consultations for cosmetic enhancements. She blends medical rigor with skin science to design custom treatments that optimize skin health and beauty.',
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Monday', 'Thursday', 'Friday'],
      hours: '09:00 AM - 05:00 PM',
      slots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']
    },
    education: [
      'MD, Cornell University Medical College',
      'Residency in Dermatology, NYU Langone Health',
      'Fellowship in Cosmetic & Laser Dermatology, UCSD Hospital'
    ],
    contactEmail: 'k.zhao@novacare.org'
  },
  {
    id: 'doc-oliver-brooks',
    name: 'Dr. Oliver Brooks',
    title: 'Senior Clinical Dermatologist',
    departmentId: 'dermatology',
    specialty: 'Dermatological Oncology & Surgical Dermatology',
    rating: 4.9,
    experience: 14,
    patientsCount: 1670,
    bio: 'Dr. Oliver Brooks specializes in the early diagnosis and surgical removal of melanoma and non-melanoma skin cancers. Certified in Mohs Micrographic Surgery, he is dedicated to achieving the highest cure rates while preserving optimal cosmetic appearance.',
    image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Tuesday', 'Wednesday'],
      hours: '08:30 AM - 04:00 PM',
      slots: ['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM', '03:30 PM']
    },
    education: [
      'MD, Boston University School of Medicine',
      'Residency in Dermatology, Barnes-Jewish Hospital (WUSTL)',
      'Fellowship in Mohs Micrographic Surgery, Emory University Hospital'
    ],
    contactEmail: 'o.brooks@novacare.org'
  },

  // General Medicine
  {
    id: 'doc-natalie-vance',
    name: 'Dr. Natalie Vance',
    title: 'Lead Family Physician',
    departmentId: 'general-medicine',
    specialty: 'Family Medicine & Preventive Care',
    rating: 4.9,
    experience: 13,
    patientsCount: 2450,
    bio: 'Dr. Natalie Vance provides comprehensive health services to patients of all ages. She focuses on long-term wellness, preventative testing, healthy aging, and the seamless coordination of physical and mental healthcare for families.',
    image: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
      hours: '08:00 AM - 04:30 PM',
      slots: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']
    },
    education: [
      'MD, Tufts University School of Medicine',
      'Residency in Family Medicine, Oregon Health & Science University'
    ],
    contactEmail: 'n.vance@novacare.org'
  },
  {
    id: 'doc-robert-chen',
    name: 'Dr. Robert Chen',
    title: 'Senior Specialist in Internal Medicine',
    departmentId: 'general-medicine',
    specialty: 'Internal Medicine & Complex Diagnostics',
    rating: 4.8,
    experience: 11,
    patientsCount: 1950,
    bio: 'Dr. Robert Chen specializes in diagnosing and treating complex multi-system chronic medical conditions such as diabetes, hypertension, and autoimmune disorders. He values evidence-based diagnostics and active, collaborative relationships with patients.',
    image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=400&h=400&q=80',
    availability: {
      days: ['Tuesday', 'Thursday', 'Friday'],
      hours: '09:00 AM - 05:00 PM',
      slots: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']
    },
    education: [
      'MD, University of Michigan Medical School',
      'Residency in Internal Medicine, UCSF Medical Center'
    ],
    contactEmail: 'r.chen@novacare.org'
  }
];
