// src/types.ts

import { User } from 'firebase/auth';
import { ReactNode } from 'react';

// --- Auth Types ---
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// --- Data Types (from Attendance.tsx) ---
export interface AccessLog {
  uid: string;
  status: string; // "GRANTED" | "DENIED"
  timestamp: number;
  date: string;
}

export interface Stats {
  totalScans: number;
  granted: number;
  denied: number;
}

export interface Subject {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
}